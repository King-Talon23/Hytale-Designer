package skineditor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * The skins saved in the website's Locker, read from "<skins folder>/My skins" (one .json per skin, a .png picture beside it), and
 * wearing one from in game by writing Wearing.json the way the site does. The pictures go into the live pack (content-named, so a
 * changed picture is a new file), where the game sends them to the client like the custom textures.
 */
final class Wardrobe {
    static final String PICS = "UI/Custom/Pages/HytaleDesigner/Pics/";
    record Look(String name, JsonObject skin, Set<String> keepOwn, String picture, boolean fav) {}

    private final Supplier<Path> skinsDir, liveCommon, userData;
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();

    Wardrobe(Supplier<Path> skinsDir, Supplier<Path> liveCommon, Supplier<Path> userData) { this.skinsDir = skinsDir; this.liveCommon = liveCommon; this.userData = userData; }

    /** the saved skins, starred ones ("favourite" in the file, set on the site) first, then by name; each picture copied into the live pack */
    synchronized List<Look> looks() {
        List<Look> out = new ArrayList<>(); Path dir = skinsDir.get() == null ? null : skinsDir.get().resolve("My skins");
        if (dir == null || !Files.isDirectory(dir)) return out;
        List<Path> files = new ArrayList<>();
        try (Stream<Path> s = Files.list(dir)) { s.filter(p -> p.getFileName().toString().endsWith(".json")).forEach(files::add); } catch (Exception e) { return out; }
        files.sort(Comparator.comparing(p -> p.getFileName().toString().toLowerCase()));
        for (Path f : files) {
            try {
                if (Files.size(f) > 20_000) continue;
                JsonObject j = JsonParser.parseString(Files.readString(f)).getAsJsonObject();
                if (!j.has("format") || !"skin-editor-skin".equals(j.get("format").getAsString()) || !j.has("skin") || !j.get("skin").isJsonObject()) continue;
                String stem = f.getFileName().toString().replaceFirst("\\.json$", "");
                String name = j.has("name") && j.get("name").isJsonPrimitive() ? j.get("name").getAsString() : stem;
                if (name.length() > 40) name = name.substring(0, 40);
                Set<String> keep = new HashSet<>();
                if (j.has("keepOwn") && j.get("keepOwn").isJsonArray()) for (JsonElement k : j.getAsJsonArray("keepOwn")) if (k.isJsonPrimitive() && SkinEditorPlugin.SLOTS.contains(k.getAsString())) keep.add(k.getAsString());
                boolean fav = j.has("favourite") && j.get("favourite").isJsonPrimitive() && j.get("favourite").getAsBoolean();
                out.add(new Look(name, j.getAsJsonObject("skin"), keep, picture(dir.resolve(stem + ".png")), fav));
                if (out.size() >= 60) break;
            } catch (Exception e) { /* a broken file is skipped */ }
        }
        out.sort(Comparator.comparing(l -> !l.fav()));     // stable: name order kept within each group
        return out;
    }

    private String picture(Path png) {
        try {
            if (!Files.isRegularFile(png) || Files.size(png) > 1_000_000) return null;
            byte[] b = Files.readAllBytes(png); if (b.length < 8 || (b[0] & 0xff) != 0x89 || b[1] != 'P') return null;
            return picture(b);
        } catch (Exception e) { return null; }
    }

    private String picture(byte[] b) {
        Path common = liveCommon.get(); if (common == null) return null;
        try {
            // the client reads UI pictures from the @2x file (a plain one alone draws nothing); the page names the plain path
            String name = String.format("%08x", java.util.Arrays.hashCode(b));
            Path out = common.resolve(PICS + name + "@2x.png"); if (!Files.isRegularFile(out)) { Files.createDirectories(out.getParent()); Files.write(out, b); }
            return PICS + name + ".png";
        } catch (Exception e) { return null; }
    }

    /** the player's own skin as the game drew it for the account (UserData/CachedAvatarPreviews/<uuid>.png), its flat backdrop
     *  taken out so it hangs like the others; null when the game has not drawn one on this PC */
    String ownPicture(java.util.UUID who) {
        Path ud = userData.get(); if (ud == null || who == null) return null;
        Path f = ud.resolve("CachedAvatarPreviews").resolve(who + ".png");
        try {
            if (!Files.isRegularFile(f) || Files.size(f) > 1_000_000) return null;
            java.awt.image.BufferedImage src = javax.imageio.ImageIO.read(f.toFile()); if (src == null) return null;
            int w = src.getWidth(), h = src.getHeight();
            java.awt.image.BufferedImage im = new java.awt.image.BufferedImage(w, h, java.awt.image.BufferedImage.TYPE_INT_ARGB);
            im.getGraphics().drawImage(src, 0, 0, null);
            int bg = im.getRGB(0, 0) & 0xffffff; boolean[] seen = new boolean[w * h]; java.util.ArrayDeque<Integer> q = new java.util.ArrayDeque<>();
            for (int x = 0; x < w; x++) { q.add(x); q.add((h - 1) * w + x); }
            for (int y = 0; y < h; y++) { q.add(y * w); q.add(y * w + w - 1); }
            while (!q.isEmpty()) {          // the backdrop reached from the edges goes; its anti-aliased rim fades out
                int i = q.poll(); if (seen[i]) continue; seen[i] = true;
                int x = i % w, y = i / w, c = im.getRGB(x, y); double d = dist(c & 0xffffff, bg);
                if (d >= 80) continue;
                if (d < 20) im.setRGB(x, y, 0);
                else { im.setRGB(x, y, ((int) Math.round(255 * (d - 20) / 60) << 24) | (c & 0xffffff)); continue; }
                if (x > 0) q.add(i - 1); if (x < w - 1) q.add(i + 1); if (y > 0) q.add(i - w); if (y < h - 1) q.add(i + w);
            }
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream(); javax.imageio.ImageIO.write(im, "png", out);
            return picture(out.toByteArray());
        } catch (Exception e) { return null; }
    }

    private static double dist(int a, int b) {
        int dr = (a >> 16 & 255) - (b >> 16 & 255), dg = (a >> 8 & 255) - (b >> 8 & 255), db = (a & 255) - (b & 255);
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    /** removes pictures no saved skin uses any more (world start only: a picture removed while a client draws it can crash it) */
    synchronized void prune() {
        Path common = liveCommon.get(); if (common == null) return; Path dir = common.resolve(PICS); if (!Files.isDirectory(dir)) return;
        Set<String> keep = new HashSet<>(); for (Look l : looks()) if (l.picture() != null) keep.add(Path.of(l.picture()).getFileName().toString().replace(".png", "@2x.png"));
        try (Stream<Path> s = Files.list(dir)) { for (Path p : (Iterable<Path>) s::iterator) if (!keep.contains(p.getFileName().toString())) Files.deleteIfExists(p); } catch (Exception ignored) { }
    }

    /** wear a saved skin: Wearing.json as the site writes it, with its keepOwn list, so paid items stay the player's own */
    synchronized void wear(Look l) throws Exception {
        JsonObject w = new JsonObject(); w.addProperty("format", "skin-editor-wearing"); w.addProperty("version", 1); w.addProperty("on", true); w.addProperty("name", l.name());
        com.google.gson.JsonArray k = new com.google.gson.JsonArray(); for (String f : SkinEditorPlugin.FIELDS) if (l.keepOwn().contains(f)) k.add(f); w.add("keepOwn", k);
        w.add("skin", l.skin().deepCopy()); write(w);
    }

    /** the player's own skin back: Wearing.json switched off, as the site's "Show in game" switch does */
    synchronized void wearOwn() throws Exception {
        JsonObject w = current(); if (w == null) { w = new JsonObject(); w.addProperty("format", "skin-editor-wearing"); w.addProperty("version", 1); }
        w.addProperty("on", false); write(w);
    }

    /** true when the player wears their own skin (nothing from the site is switched on) */
    boolean wearingOwn() { JsonObject w = current(); return w == null || !w.has("on") || !w.get("on").getAsBoolean(); }

    /** the saved skin being worn now (matched by its parts), or null */
    String wornName() {
        JsonObject w = current(); if (w == null || !w.has("on") || !w.get("on").getAsBoolean() || !w.has("skin")) return null;
        for (Look l : looks()) if (l.skin().equals(w.get("skin"))) return l.name();
        return null;
    }

    private JsonObject current() {
        try { Path f = skinsDir.get().resolve("Wearing.json"); if (!Files.isRegularFile(f) || Files.size(f) > 20_000) return null;
            JsonObject j = JsonParser.parseString(Files.readString(f)).getAsJsonObject(); return "skin-editor-wearing".equals(j.get("format").getAsString()) ? j : null;
        } catch (Exception e) { return null; }
    }

    private void write(JsonObject w) throws Exception {
        Path f = skinsDir.get().resolve("Wearing.json"), tmp = f.resolveSibling("Wearing.json.part");
        Files.writeString(tmp, GSON.toJson(w)); Files.move(tmp, f, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
    }
}
