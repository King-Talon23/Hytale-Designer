package skineditor;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.regex.Pattern;

/**
 * The website saves straight into the skins folder through this, so nobody has to pick a folder: a tiny web server on this computer
 * only (127.0.0.1), answering only the Hytale Designer website, and only inside "Hytale Skins" (its four subfolders and Wearing.json).
 *   GET    /v1/hello                 { app, version }
 *   GET    /v1/list?dir=<subfolder>  [ { name, size } ]
 *   GET    /v1/file?path=<sub/name>  the file
 *   PUT    /v1/file?path=<sub/name>  write it (20 MB at most)
 *   DELETE /v1/file?path=<sub/name>  remove it
 */
final class SkinBridge {
    static final int[] PORTS = { 47815, 47816, 47817 };
    private static final Set<String> SITES = Set.of("https://hytaledesigner.com", "https://www.hytaledesigner.com", "https://hytale-skin-editor.com", "https://www.hytale-skin-editor.com");
    private static final Pattern DEV = Pattern.compile("^http://([a-z0-9-]+\\.)?localhost:\\d{2,5}$");   // the local test server, only when dev-origins is switched on
    private static final Set<String> DIRS = Set.of("My skins", "In-game slots", "Custom assets", "Animations");
    private static final Set<String> TOP_READ = Set.of("Wearing.json", "Skin Editor Sync.json"), TOP_WRITE = Set.of("Wearing.json");
    private static final Pattern EXT = Pattern.compile("(?i).+\\.(json|png|blockymodel|blockyanim)$");
    private static final Pattern BAD = Pattern.compile("[\\\\/:*?\"<>|\\u0000-\\u001f]");
    private static final long MAX = 20L << 20;

    private final Supplier<Path> folder; private final String version; private final boolean dev; private final Consumer<String> log;
    private HttpServer server; int port;

    SkinBridge(Supplier<Path> folder, String version, boolean dev, Consumer<String> log) { this.folder = folder; this.version = version; this.dev = dev; this.log = log; }

    void start() {
        for (int p : PORTS) {
            try { server = HttpServer.create(new InetSocketAddress(InetAddress.getLoopbackAddress(), p), 16); port = p; break; } catch (IOException e) { /* taken: next */ }
        }
        if (server == null) { log.accept("no free port for the website bridge"); return; }
        server.createContext("/", this::handle); server.setExecutor(Executors.newSingleThreadExecutor(r -> { Thread t = new Thread(r, "SkinEditor-bridge"); t.setDaemon(true); return t; }));
        server.start(); log.accept("website bridge on 127.0.0.1:" + port + (dev ? " (test server allowed)" : ""));
    }
    void stop() { if (server != null) server.stop(0); }

    private boolean allowed(String origin) { return origin != null && (SITES.contains(origin) || (dev && DEV.matcher(origin).matches())); }

    private void handle(HttpExchange x) throws IOException {
        try (x) {
            String origin = x.getRequestHeaders().getFirst("Origin"), host = x.getRequestHeaders().getFirst("Host");
            // only this computer's own address in Host (no website can rename itself to us), only Hytale Designer in Origin
            if (host == null || !(host.equals("127.0.0.1:" + port) || host.equals("localhost:" + port)) || !allowed(origin)) { send(x, 403, "{\"error\":\"not allowed\"}"); return; }
            var h = x.getResponseHeaders(); h.set("Access-Control-Allow-Origin", origin); h.set("Vary", "Origin"); h.set("Cache-Control", "no-store"); h.set("X-Content-Type-Options", "nosniff");
            String m = x.getRequestMethod(), path = x.getRequestURI().getPath();
            if (m.equals("OPTIONS")) { h.set("Access-Control-Allow-Methods", "GET, PUT, DELETE"); h.set("Access-Control-Allow-Headers", "Content-Type");
                h.set("Access-Control-Allow-Private-Network", "true"); h.set("Access-Control-Max-Age", "600"); x.sendResponseHeaders(204, -1); return; }
            Path root = folder.get(); if (root == null) { send(x, 503, "{\"error\":\"no skins folder\"}"); return; }
            String q = query(x, path.equals("/v1/list") ? "dir" : "path");
            switch (path) {
                case "/v1/hello" -> send(x, 200, "{\"app\":\"skin-editor-sync\",\"version\":\"" + version + "\"}");
                case "/v1/list" -> {
                    if (q == null || !DIRS.contains(q)) { send(x, 400, "{\"error\":\"bad folder\"}"); return; }
                    Path d = root.resolve(q); Files.createDirectories(d); StringBuilder sb = new StringBuilder("["); int n = 0;
                    try (var s = Files.list(d)) { for (Path f : (Iterable<Path>) s::iterator) { if (!Files.isRegularFile(f) || ++n > 2000) continue; if (sb.length() > 1) sb.append(',');
                        sb.append("{\"name\":").append(json(f.getFileName().toString())).append(",\"size\":").append(Files.size(f)).append('}'); } }
                    send(x, 200, sb.append(']').toString());
                }
                case "/v1/file" -> {
                    Path f = target(root, q, !m.equals("GET")); if (f == null) { send(x, 400, "{\"error\":\"bad path\"}"); return; }
                    switch (m) {
                        case "GET" -> { if (!Files.isRegularFile(f)) { send(x, 404, "{\"error\":\"not found\"}"); return; } byte[] b = Files.readAllBytes(f);
                            h.set("Content-Type", "application/octet-stream"); x.sendResponseHeaders(200, b.length); try (OutputStream o = x.getResponseBody()) { o.write(b); } }
                        case "PUT" -> { byte[] b = readBody(x.getRequestBody()); if (b == null) { send(x, 413, "{\"error\":\"too large\"}"); return; }
                            Files.createDirectories(f.getParent()); Path tmp = f.resolveSibling(f.getFileName() + ".part"); Files.write(tmp, b);
                            Files.move(tmp, f, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE); send(x, 200, "{\"ok\":true}"); }
                        case "DELETE" -> { Files.deleteIfExists(f); send(x, 200, "{\"ok\":true}"); }
                        default -> send(x, 405, "{\"error\":\"method\"}");
                    }
                }
                default -> send(x, 404, "{\"error\":\"not found\"}");
            }
        } catch (Exception e) { try { send(x, 500, "{\"error\":\"failed\"}"); } catch (Exception ignored) { } }
    }

    /** "<sub>/<name>" inside the skins folder, or a top-level Wearing.json; anything else is refused */
    private static Path target(Path root, String rel, boolean write) {
        if (rel == null) return null; String[] parts = rel.split("/", -1);
        for (String s : parts) if (s.isEmpty() || s.equals(".") || s.equals("..") || s.length() > 120 || BAD.matcher(s).find() || s.endsWith(".") || s.endsWith(" ")) return null;
        if (parts.length == 1) return (write ? TOP_WRITE : TOP_READ).contains(parts[0]) ? root.resolve(parts[0]) : null;
        if (parts.length != 2 || !DIRS.contains(parts[0]) || !EXT.matcher(parts[1]).matches()) return null;
        Path f = root.resolve(parts[0]).resolve(parts[1]).normalize(); return f.startsWith(root) ? f : null;
    }

    private static String query(HttpExchange x, String key) {
        String raw = x.getRequestURI().getRawQuery(); if (raw == null) return null;
        for (String kv : raw.split("&")) { int i = kv.indexOf('='); if (i > 0 && kv.substring(0, i).equals(key)) return URLDecoder.decode(kv.substring(i + 1), StandardCharsets.UTF_8); }
        return null;
    }
    private static byte[] readBody(InputStream in) throws IOException { byte[] b = in.readNBytes((int) MAX + 1); return b.length > MAX ? null : b; }
    private static void send(HttpExchange x, int code, String body) throws IOException {
        byte[] b = body.getBytes(StandardCharsets.UTF_8); x.getResponseHeaders().set("Content-Type", "application/json"); x.sendResponseHeaders(code, b.length); try (OutputStream o = x.getResponseBody()) { o.write(b); }
    }
    private static String json(String s) { StringBuilder sb = new StringBuilder("\""); for (char c : s.toCharArray()) { if (c == '"' || c == '\\') sb.append('\\').append(c); else if (c < 0x20) sb.append(String.format("\\u%04x", (int) c)); else sb.append(c); } return sb.append('"').toString(); }
    static List<Integer> ports() { return List.of(PORTS[0], PORTS[1], PORTS[2]); }
}
