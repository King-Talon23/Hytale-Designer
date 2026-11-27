package skineditor;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * The game's own wardrobes open the wardrobe screen too, each in its own look. An item JSON at the same path in the live pack replaces
 * the vanilla item, so at startup (before the packs are read) each set's vanilla item JSON is copied from this PC's Assets.zip with a
 * Use interaction added that opens that set's page. Art and layout per set: dev/tools/render-wardrobe.py (keep SETS in step with it).
 */
final class WardrobeSets {
    /** sets with art; Lumberjack is the Designer Wardrobe's own look */
    static final List<String> SETS = List.of("Lumberjack", "Temple_Dark", "Ancient", "Crude", "Desert", "Feran", "Frozen_Castle", "Human_Ruins",
        "Jungle", "Kweebec", "Royal_Magic", "Tavern", "Temple_Emerald", "Temple_Light", "Temple_Wind", "Village");
    static final Pattern ITEM = Pattern.compile("^Server/Item/Items/Furniture/([A-Za-z_]+)/Furniture_([A-Za-z_]+)_Wardrobe\\.json$");

    static String pageId(String set) { return set.equals("Lumberjack") ? WardrobePage.PAGE_ID : WardrobePage.PAGE_ID + "_" + set; }
    /** sets whose pages turn with the plaques on the doors (render-wardrobe.py makes them) instead of the doors themselves; none since 11-27 */
    static final Set<String> PLAQUES = Set.of();
    static boolean doorsTurnPages(String set) { return !PLAQUES.contains(set); }
    static String setOf(String layout) { Matcher m = Pattern.compile("Wardrobe_([A-Za-z_]+)\\.ui$").matcher(layout); return m.find() ? m.group(1) : "Lumberjack"; }
    static String layout(String set) { return set.equals("Lumberjack") ? WardrobePage.LAYOUT : "Pages/HytaleDesigner/Wardrobe_" + set + ".ui"; }

    /** writes (or refreshes) the override item JSONs into the live pack and removes ones for sets no longer listed; returns how many it wrote */
    static int write(Path live, Path assetsZip) throws Exception {
        if (!Files.isRegularFile(assetsZip)) return 0;
        Path root = live.resolve("Server").resolve("Item").resolve("Items").resolve("Furniture");
        Set<Path> keep = new HashSet<>(); int wrote = 0;
        try (var z = new java.util.zip.ZipFile(assetsZip.toFile())) {
            for (var en = z.entries(); en.hasMoreElements(); ) {
                var e = en.nextElement(); Matcher m = ITEM.matcher(e.getName());
                if (!m.matches() || !SETS.contains(m.group(2))) continue;
                JsonObject item; try (var in = z.getInputStream(e)) { item = JsonParser.parseString(new String(in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8)).getAsJsonObject(); }
                if (!item.has("BlockType") || !item.get("BlockType").isJsonObject()) continue;
                JsonObject block = item.getAsJsonObject("BlockType");
                if (block.has("Interactions")) continue;   // a wardrobe that already does something on use is left alone
                JsonObject page = new JsonObject(); page.addProperty("Id", pageId(m.group(2)));
                JsonObject open = new JsonObject(); open.addProperty("Type", "OpenCustomUI"); open.add("Page", page);
                JsonArray list = new JsonArray(); list.add(open);
                JsonObject use = new JsonObject(); use.add("Interactions", list);
                JsonObject inter = new JsonObject(); inter.add("Use", use); block.add("Interactions", inter);
                Path out = root.resolve(m.group(1)).resolve(Path.of(e.getName()).getFileName().toString()); keep.add(out);
                String text = new GsonBuilder().setPrettyPrinting().create().toJson(item) + "\n";
                if (Files.isRegularFile(out) && Files.readString(out).equals(text)) continue;
                Files.createDirectories(out.getParent()); Files.writeString(out, text); wrote++;
            }
        }
        if (Files.isDirectory(root)) try (Stream<Path> s = Files.walk(root)) {
            for (Path p : (Iterable<Path>) s::iterator)
                if (Files.isRegularFile(p) && p.getFileName().toString().matches("Furniture_[A-Za-z_]+_Wardrobe\\.json") && !keep.contains(p)) Files.delete(p);
        }
        return wrote;
    }
}
