package skineditor;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.PlayerSkin;
import com.hypixel.hytale.server.core.asset.type.model.config.Model;
import com.hypixel.hytale.server.core.asset.type.model.config.ModelAttachment;
import com.hypixel.hytale.server.core.cosmetics.CosmeticsModule;
import com.hypixel.hytale.server.core.cosmetics.PlayerSkinPart;
import com.hypixel.hytale.server.core.modules.entity.component.ModelComponent;
import com.hypixel.hytale.server.core.modules.entity.player.PlayerSkinComponent;
import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.Universe;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Companion mod for the Hytale Designer website. No commands: it dresses you automatically.
 *
 * The website writes to a skins folder on this PC (default Documents/Hytale Skins): your custom assets in "Custom assets", and,
 * while its "Show in game" switch is on, what you are wearing on the site in "Wearing.json". Once a second this mod reads that
 * file and dresses your character to match; switch it off on the site and your own skin comes back.
 *
 * Custom textures reach players through a folder pack this mod keeps in the world (mods/SkinEditor_Live). A repainted texture
 * gets a new file name, because game clients keep textures they have already loaded.
 *
 * The client draws a player's skin parts from its own copy of the cosmetics, so custom textures cannot ride on the skin. While
 * custom pieces are worn the player becomes the Player model with one attachment per part (the same parts and colours) plus the
 * custom pieces. A look made only of game parts is put on as a normal skin. Slots the website marks "keepOwn" (edition and
 * reward items) always keep the player's own part, so the mod never gives anyone a paid cosmetic.
 *
 * Who is "you": the account whose skin the game cached on this PC (UserData/CachedPlayerSkins), so this works in your own
 * worlds. Other players in the world see you dressed, because the server sends it.
 */
public final class SkinEditorPlugin extends JavaPlugin {

    static final Pattern ID = Pattern.compile("^[0-9a-f]{8}$");
    static final Pattern ASSET_PATH = Pattern.compile("^[A-Za-z0-9_ ./-]{1,200}$");
    static final Pattern TEX = Pattern.compile("^Characters/SkinEditor/[0-9a-f]{8}-[0-9a-f]{8}\\.png$");
    static final Pattern PART = Pattern.compile("^[A-Za-z0-9_ -]{1,64}(\\.[A-Za-z0-9_ +-]{1,96}){0,2}$");
    static final String NO_EYES = "Characters/SkinEditorBase/NoEyes/";   // + a face texture's own path: that face with its eye area smoothed over
    static volatile Path liveCommon;
    static final List<String> NEEDED = List.of("bodyCharacteristic", "underwear", "face", "ears", "mouth", "eyes");   // the game's skin check needs these
    static final Set<String> NONE_OK = Set.of("eyes", "mouth", "ears");   // the site offers None for these
    static final String[] FIELDS = { "bodyCharacteristic", "underwear", "face", "ears", "mouth", "haircut", "facialHair", "eyebrows", "eyes", "pants", "overpants",
        "undertop", "overtop", "shoes", "headAccessory", "faceAccessory", "earAccessory", "skinFeature", "gloves", "cape" };
    static final Set<String> SLOTS = Set.of(FIELDS);
    static final String LIVE = "SkinEditor_Live";
    static final String VERSION = "1.4.0";
    static final String WARDROBE_ITEM = "HytaleDesigner_Wardrobe";
    static final Pattern WORD = Pattern.compile("^[A-Za-z0-9_ -]{1,64}$");
    static final Map<String, String> GENERIC = Map.of("Short", "GenericShort", "Medium", "GenericMedium", "Long", "GenericLong");   // Cosmetics/CharacterCreator/HaircutFallbacks.json

    record Asset(String id, String field, String model, String texture, String baseId, String tone) {}   // baseId: the game item it was copied from; tone: a copied body's skin tone
    /** what the website says you are wearing */
    record Wearing(Map<String, String> parts, Set<String> keepOwn, String raw) {}

    private Path modsDir, userData, skinsDir;
    private ScheduledExecutorService tick;
    private final Map<UUID, PlayerSkin> own = new java.util.concurrent.ConcurrentHashMap<>();       // each dressed player's real skin
    private final Map<UUID, String> dressedWith = new java.util.concurrent.ConcurrentHashMap<>();   // the Wearing.json text last applied
    private final Map<UUID, PlayerSkin> applied = new java.util.concurrent.ConcurrentHashMap<>();   // the plain skin we put on (no custom pieces)
    private volatile String lastSync = "";
    private volatile String markedOn = "";   // the day the folder marker was last written

    public SkinEditorPlugin(JavaPluginInit init) {
        super(init);
        // the live pack must be a valid pack before the server loads asset packs (after plugins are found, before setup)
        try { locate(); ensureLivePack(); syncAssets(true); syncAnims(true); wardrobe.prune(); wardrobe.looks(); } catch (Throwable ignored) { }   // prune before the packs are read: removing a file after that crashes clients
        // a world only loads packs it was told about (single-player worlds start with "default mods enabled" off), so the live pack is
        // switched on here, unless the player turned it off themselves
        try { var cfg = com.hypixel.hytale.server.core.HytaleServer.get().getConfig().getModConfig();
            var id = new com.hypixel.hytale.common.plugin.PluginIdentifier("SkinEditorPack", "Live"); var mc = cfg.get(id);
            if (mc == null || mc.getEnabled() == null) { if (mc == null) mc = new com.hypixel.hytale.server.core.config.ModConfig(); mc.setEnabled(true); cfg.put(id, mc); }
        } catch (Throwable e) { System.err.println("[Hytale Designer Sync] could not switch the live pack on: " + e); }
    }

    @Override
    protected void setup() {
        try { locate(); ensureLivePack(); syncAssets(false); syncAnims(false); } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not prepare: " + e); }
        // the in-game wardrobe: the Designer Wardrobe item opens it (no commands); every player gets one the first time they join
        com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.OpenCustomUIInteraction.registerSimple(this, WardrobePage.class, WardrobePage.PAGE_ID, pr -> new WardrobePage(pr, wardrobe));
        getEventRegistry().registerGlobal(com.hypixel.hytale.server.core.event.events.player.PlayerReadyEvent.class, e -> {
            Ref<EntityStore> r = e.getPlayerRef(); if (r == null || !r.isValid()) return;
            r.getStore().getExternalData().getWorld().execute(() -> giveWardrobe(r));
        });
        tick = Executors.newSingleThreadScheduledExecutor(r -> { Thread t = new Thread(r, "SkinEditor"); t.setDaemon(true); return t; });
        tick.scheduleWithFixedDelay(this::step, 2, 1, TimeUnit.SECONDS);
        // the website saves straight into the skins folder through this (no folder picking): this computer only, the Hytale Designer site only
        try { boolean dev = Files.exists(getDataDirectory().resolve("dev-origins"));
            bridge = new SkinBridge(() -> skinsDir, VERSION, dev, msg -> getLogger().atInfo().log("[Hytale Designer Sync] " + msg)); bridge.start();
        } catch (Throwable e) { getLogger().atWarning().log("[Hytale Designer Sync] website bridge off: " + e); }
    }

    private SkinBridge bridge;
    final Wardrobe wardrobe = new Wardrobe(() -> skinsDir, () -> liveCommon);

    /** one Designer Wardrobe per player, given once (a player who throws it away can craft another from 4 fibre) */
    private void giveWardrobe(Ref<EntityStore> ref) {
        try {
            if (!ref.isValid()) return; Store<EntityStore> store = ref.getStore();
            PlayerRef pr = store.getComponent(ref, PlayerRef.getComponentType()); if (pr == null) return;
            Path given = getDataDirectory().resolve("wardrobe-given.txt");
            List<String> who = Files.isRegularFile(given) ? Files.readAllLines(given) : new ArrayList<>();
            if (who.contains(pr.getUuid().toString())) return;
            var hotbar = store.getComponent(ref, com.hypixel.hytale.server.core.inventory.InventoryComponent.Hotbar.getComponentType());
            var storage = store.getComponent(ref, com.hypixel.hytale.server.core.inventory.InventoryComponent.Storage.getComponentType());
            var item = new com.hypixel.hytale.server.core.inventory.ItemStack(WARDROBE_ITEM, 1);
            if (hotbar != null && hotbar.getInventory().canAddItemStack(item)) { hotbar.getInventory().addItemStack(item); hotbar.markDirty(); }
            else if (storage != null && storage.getInventory().canAddItemStack(item)) { storage.getInventory().addItemStack(item); storage.markDirty(); }
            else return;   // full: tried again next join
            Files.createDirectories(given.getParent()); Files.writeString(given, pr.getUuid() + "\n", java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
            pr.sendMessage(com.hypixel.hytale.server.core.Message.raw("Hytale Designer Sync: use the Designer Wardrobe to wear any skin from your Locker."));
        } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not give the wardrobe: " + e); }
    }
    @Override
    protected void shutdown() { if (bridge != null) bridge.stop(); if (tick != null) tick.shutdownNow(); }

    private void locate() {
        modsDir = getDataDirectory().toAbsolutePath().getParent();                      // <save>/mods
        Path save = modsDir.getParent(), saves = save == null ? null : save.getParent();
        userData = saves == null ? null : saves.getParent();                              // UserData (Saves/<world>/mods)
        chooseFolder(true);
    }

    /** Windows' own Documents folder (the one a browser's folder picker opens in): often OneDrive's Documents */
    private static Path knownDocuments() {
        try { Process pr = new ProcessBuilder("reg", "query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders", "/v", "Personal").redirectErrorStream(true).start();
            String out = new String(pr.getInputStream().readAllBytes()); pr.waitFor();
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("Personal\\s+REG_\\w+\\s+(.+)").matcher(out); if (!m.find()) return null;
            String v = m.group(1).trim(); for (String k : List.of("USERPROFILE", "OneDrive", "HOMEDRIVE", "HOMEPATH")) { String e = System.getenv(k); if (e != null) v = v.replace("%" + k + "%", e); }
            return v.contains("%") ? null : Path.of(v);
        } catch (Exception e) { return null; } }

    private static long lastUsed(Path dir) {   // the newest change in the folder or its first level (where the site writes)
        long t = 0; try { t = Files.getLastModifiedTime(dir).toMillis(); try (var s = Files.list(dir)) { for (Path p : (Iterable<Path>) s::iterator) t = Math.max(t, Files.getLastModifiedTime(p).toMillis()); } } catch (Exception e) { /* gone */ } return t; }

    /** The skins folder: of every "Hytale Skins" that exists (Windows' Documents, the home Documents, OneDrive's Documents), the one the site used last;
     *  if none exists yet, one is made in Windows' Documents, where the browser's folder picker opens. Checked again every 10 seconds. */
    private void chooseFolder(boolean create) {
        Path home = Path.of(System.getProperty("user.home")), known = knownDocuments();
        java.util.LinkedHashSet<Path> docs = new java.util.LinkedHashSet<>(); if (known != null) docs.add(known); docs.add(home.resolve("Documents")); docs.add(home.resolve("OneDrive").resolve("Documents"));
        Path best = null; long bestT = -1;
        for (Path d : docs) { Path p = d.resolve("Hytale Skins"); if (!Files.isDirectory(p)) continue; long t = lastUsed(p); if (t > bestT) { best = p; bestT = t; } }
        if (best == null) { if (!create) return; Path base = docs.stream().filter(Files::isDirectory).findFirst().orElse(home.resolve("Documents")); best = base.resolve("Hytale Skins");
            try { Files.createDirectories(best); } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not make " + best + ": " + e); } }
        if (!best.equals(skinsDir)) { if (skinsDir != null) getLogger().atInfo().log("[Hytale Designer Sync] skins folder is now " + best); skinsDir = best; markedOn = null; }
    }

    // ------------------------------------------------------------------ once a second
    private int steps = 0;
    private void step() {
        if (++steps % 10 == 0) chooseFolder(false);   // follow the folder the site actually writes to
        markFolder();
        try { syncAssets(false); syncAnims(false); } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] sync: " + e); }
        try {
            UUID me = localPlayer(); if (me == null) return;
            PlayerRef pr = Universe.get().getPlayer(me); if (pr == null) return;
            Ref<EntityStore> ref = pr.getReference(); if (ref == null || !ref.isValid()) return;
            Wearing want = readWearing(); Map<String, Asset> all = assets();
            World w = ref.getStore().getExternalData().getWorld();
            w.execute(() -> { try { apply(ref.getStore(), ref, me, want, all); } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not dress: " + e); } });
        } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] step: " + e); }
    }

    /** "Skin Editor Sync.json" in the skins folder tells the website this mod is installed and has run (once a day, only if the folder exists) */
    private void markFolder() {
        String today = java.time.LocalDate.now().toString(); if (today.equals(markedOn) || skinsDir == null || !Files.isDirectory(skinsDir)) return;
        String body = "{\n \"format\": \"skin-editor-sync\",\n \"version\": \"" + VERSION + "\",\n \"seen\": \"" + today + "\"\n}\n";
        try { Files.writeString(skinsDir.resolve("Skin Editor Sync.json"), body); markedOn = today; }
        catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not write the folder marker: " + e); markedOn = today; }
    }

    /** the account this PC plays as: the newest skin the game cached in UserData/CachedPlayerSkins */
    private UUID localPlayer() {
        if (userData == null) return null; Path dir = userData.resolve("CachedPlayerSkins"); if (!Files.isDirectory(dir)) return null;
        try (Stream<Path> fs = Files.list(dir)) {
            Path newest = null; long t = Long.MIN_VALUE;
            for (Path f : (Iterable<Path>) fs::iterator) { String n = f.getFileName().toString(); if (!n.endsWith(".json")) continue; long m = Files.getLastModifiedTime(f).toMillis(); if (m > t) { t = m; newest = f; } }
            return newest == null ? null : UUID.fromString(newest.getFileName().toString().replace(".json", ""));
        } catch (Exception e) { return null; }
    }

    private Wearing readWearing() {
        try { Path f = skinsDir.resolve("Wearing.json"); if (!Files.isRegularFile(f) || Files.size(f) > 20_000) return null;
            String json = Files.readString(f); if (!"skin-editor-wearing".equals(str(json, "format")) || !"true".equals(raw(json, "on"))) return null;
            int at = json.indexOf("\"skin\""); if (at < 0) return null; String body = json.substring(at);
            Map<String, String> parts = new LinkedHashMap<>();
            for (String fld : FIELDS) { Matcher m = Pattern.compile("\"" + fld + "\"\\s*:\\s*(null|\"([^\"]*)\")").matcher(body);
                String v = m.find() && m.group(2) != null ? m.group(2) : null; if (v != null && !PART.matcher(v).matches()) return null; parts.put(fld, v); }
            Set<String> keep = new HashSet<>(); Matcher k = Pattern.compile("\"keepOwn\"\\s*:\\s*\\[([^\\]]*)\\]").matcher(json);
            if (k.find()) for (String fld : FIELDS) if (k.group(1).contains("\"" + fld + "\"")) keep.add(fld);
            return new Wearing(parts, keep, json);
        } catch (Exception e) { return null; }
    }

    /** on the world thread: dress the player to match the website, or give their own skin back */
    private void apply(Store<EntityStore> store, Ref<EntityStore> ref, UUID who, Wearing want, Map<String, Asset> all) throws Exception {
        if (!ref.isValid()) return;
        PlayerSkinComponent pc = store.getComponent(ref, PlayerSkinComponent.getComponentType());
        boolean ours = pc == null || (applied.containsKey(who) && same(pc.getPlayerSkin(), applied.get(who)));
        if (!ours) { own.put(who, new PlayerSkin(pc.getPlayerSkin())); dressedWith.remove(who); }   // the game put the real skin (back): a join, respawn or world change
        String key = want == null ? null : want.raw() + "|" + all.keySet() + "|" + all.values().stream().map(Asset::texture).toList();
        if (Objects.equals(key, dressedWith.get(who))) return;   // already dressed like this
        PlayerSkin base = own.get(who); if (base == null) return;
        if (want == null) {   // switched off on the site: the real skin goes back
            if (dressedWith.remove(who) != null) { applied.remove(who); plain(store, ref, base); }
            return;
        }
        PlayerSkin skin = new PlayerSkin(base); Map<String, Asset> custom = new LinkedHashMap<>();
        for (String f : FIELDS) {
            String v = want.parts().get(f);
            // a paid item: the player's own part stays. The site also lists None eyes, mouth or ears here, for mods before 1.3 (the
            // game's own skin check refuses those); this one draws them as None
            if (want.keepOwn().contains(f) && !(v == null && NONE_OK.contains(f))) continue;
            if (v != null && v.startsWith("Custom_")) { Asset a = all.get(v.substring(7).split("\\.")[0]); if (a != null && a.field().equals(f)) custom.put(f, a); continue; }
            put(skin, f, v);
        }
        boolean none = false;
        for (String f : NONE_OK) if (get(skin, f) == null) none = true;
        for (String f : NEEDED) if (!NONE_OK.contains(f) && get(skin, f) == null) put(skin, f, (String) get(base, f));   // never a hole in the head or body
        if (custom.isEmpty() && !none) {
            try { CosmeticsModule.get().validateSkin(skin); } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] the website's skin has parts this game version lacks"); dressedWith.put(who, key); return; }
            applied.put(who, new PlayerSkin(skin)); plain(store, ref, skin);
        } else {
            applied.remove(who);
            for (var e : custom.entrySet()) { String f = e.getKey(); Asset a = e.getValue();
                // the body, hat and haircut keep their game item underneath (tone, covering rules, hair length); the custom piece is drawn in its place
                put(skin, f, f.equals("bodyCharacteristic") && a.baseId() != null && a.tone() != null ? a.baseId() + "." + a.tone() : null); }   // only the body keeps its game item (for the tone); hat and hair rules read the custom pieces' base items in skinToModel
            CosmeticsModule cm = CosmeticsModule.get();
            // the game builds a model only from a complete skin: the base model gets the player's own parts in the empty slots, and
            // skinToModel then draws exactly the parts the site chose (None stays empty)
            PlayerSkin full = new PlayerSkin(skin);
            for (String f : NEEDED) if (get(full, f) == null) put(full, f, (String) get(base, f));
            Model m = skinToModel(cm, skin, cm.createModel(full), custom);
            if (store.getComponent(ref, PlayerSkinComponent.getComponentType()) != null) store.removeComponent(ref, PlayerSkinComponent.getComponentType());
            store.putComponent(ref, ModelComponent.getComponentType(), new ModelComponent(m));
        }
        dressedWith.put(who, key);
    }

    private static void plain(Store<EntityStore> store, Ref<EntityStore> ref, PlayerSkin skin) {
        PlayerSkinComponent psc = new PlayerSkinComponent(skin); psc.setNetworkOutdated();   // marked so it is sent to the clients again
        store.putComponent(ref, PlayerSkinComponent.getComponentType(), psc);
        store.putComponent(ref, ModelComponent.getComponentType(), new ModelComponent(CosmeticsModule.get().createModel(skin)));
    }
    static Object get(PlayerSkin s, String f) throws Exception { return PlayerSkin.class.getField(f).get(s); }
    static void put(PlayerSkin s, String f, String v) throws Exception { PlayerSkin.class.getField(f).set(s, v); }
    static boolean same(PlayerSkin a, PlayerSkin b) throws Exception { for (String f : FIELDS) if (!Objects.equals(get(a, f), get(b, f))) return false; return true; }

    // ------------------------------------------------------------------ custom assets: skins folder -> live pack
    private void ensureLivePack() throws Exception {
        Path live = modsDir.resolve(LIVE);
        Files.createDirectories(live.resolve("Common").resolve("Characters").resolve("SkinEditor")); Files.createDirectories(live.resolve("Server").resolve("SkinEditor"));
        liveCommon = live.resolve("Common");
        try { makeNoEyeFaces(liveCommon); } catch (Throwable e) { System.err.println("[Hytale Designer Sync] could not make the faces for None eyes: " + e); }
        Path m = live.resolve("manifest.json");
        // "DisabledByDefault": false: a pack that appears after the world was made is otherwise skipped as disabled (fresh installs)
        if (!Files.isRegularFile(m) || !Files.readString(m).contains("DisabledByDefault")) Files.writeString(m, "{\n \"Group\": \"SkinEditorPack\",\n \"Name\": \"Live\",\n \"Version\": \"1.0.0\",\n"
            + " \"Description\": \"Kept up to date by the Hytale Designer Sync mod from your skins folder. Do not edit.\",\n \"Authors\": [{ \"Name\": \"Hytale Designer Sync\" }],\n \"ServerVersion\": \"*\",\n \"DisabledByDefault\": false\n}\n");
    }

    /** copies "<skins folder>/Custom assets" into the live pack; each texture is named after its content, so a repaint is a new file */
    // animations made on the site: "<skins folder>/Animations/<name> (<id>).blockyanim" -> an emote in the live pack (animation file +
    // Server/Emote entry). A new emote or a changed animation is read when the world starts (each version is a new file).
    static final Pattern ANIM_FILE = Pattern.compile("^(.{1,60}) \\(([0-9a-fA-F-]{8,40})\\)\\.blockyanim$");
    String lastAnimSync = null;
    synchronized void syncAnims(boolean prune) throws Exception {
        Path src = skinsDir.resolve("Animations"); if (!Files.isDirectory(src)) return;
        StringBuilder stamp = new StringBuilder();
        try (Stream<Path> fs = Files.list(src)) { for (Path f : (Iterable<Path>) fs::iterator) stamp.append(f.getFileName()).append(Files.getLastModifiedTime(f).toMillis()).append(Files.size(f)).append(';'); }
        if (stamp.toString().equals(lastAnimSync)) return;
        ensureLivePack(); Path live = modsDir.resolve(LIVE), animDir = live.resolve("Common").resolve("Characters").resolve("Animations").resolve("SkinEditor"), emDir = live.resolve("Server").resolve("Emote"), iconDir = live.resolve("Common").resolve("Icons").resolve("Emotes");
        Files.createDirectories(animDir); Files.createDirectories(emDir); Files.createDirectories(iconDir); Set<String> keep = new HashSet<>();
        try (Stream<Path> fs = Files.list(src)) {
            for (Path f : (Iterable<Path>) fs::iterator) {
                Matcher m = ANIM_FILE.matcher(f.getFileName().toString()); if (!m.matches() || Files.size(f) > 2_000_000) continue;
                String body = Files.readString(f).trim(); if (!body.startsWith("{") || !body.contains("\"nodeAnimations\"")) continue;
                String id = "SE_" + m.group(2).replace("-", "").toLowerCase().substring(0, Math.min(12, m.group(2).replace("-", "").length()));
                String name = m.group(1).replace("\\", "").replace("\"", "'").trim(); boolean loop = !body.replace(" ", "").contains("\"holdLastKeyframe\":true");
                // the animation and icon files are named after their content: the game client keeps an animation by its path for as
                // long as it runs (world restarts included), so a file rewritten in place kept playing its first version, which was
                // the site's first, still-empty save of a new animation: the emote did nothing (2026-11-24)
                String anim = id + "-" + String.format("%08x", body.hashCode()) + ".blockyanim", png = id + "-" + String.format("%08x", name.hashCode()) + ".png";
                Path a = animDir.resolve(anim); if (!Files.isRegularFile(a)) Files.writeString(a, body);
                String entry = "{\n \"Animation\": \"Characters/Animations/SkinEditor/" + anim + "\",\n \"Name\": \"" + name + "\",\n \"Icon\": \"Icons/Emotes/" + png + "\",\n \"IsLooping\": " + loop + "\n}\n";
                Path e = emDir.resolve(id + ".json"); if (!Files.isRegularFile(e) || !Files.readString(e).equals(entry)) Files.writeString(e, entry);
                Path ic = iconDir.resolve(png); if (!Files.isRegularFile(ic)) Files.write(ic, icon(name));   // the game refuses an emote whose icon file is missing
                keep.add(anim); keep.add(id + ".json"); keep.add(png);
            }
        }
        if (prune) for (Path dir : List.of(animDir, emDir, iconDir)) try (Stream<Path> fs = Files.list(dir)) {   // deleted animations go (at world start only)
            for (Path f : (Iterable<Path>) fs::iterator) if (f.getFileName().toString().startsWith("SE_") && !keep.contains(f.getFileName().toString())) Files.deleteIfExists(f);
        }
        lastAnimSync = stamp.toString();
    }
    // a plain emote icon: the name's first letter on a round badge (64x64 PNG)
    static byte[] icon(String name) throws Exception {
        java.awt.image.BufferedImage im = new java.awt.image.BufferedImage(64, 64, java.awt.image.BufferedImage.TYPE_INT_ARGB); java.awt.Graphics2D g = im.createGraphics();
        g.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON); g.setRenderingHint(java.awt.RenderingHints.KEY_TEXT_ANTIALIASING, java.awt.RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setColor(new java.awt.Color(0x1d, 0x3a, 0x5a)); g.fillOval(2, 2, 60, 60); g.setColor(new java.awt.Color(0xf4, 0xc4, 0x52)); g.setStroke(new java.awt.BasicStroke(3f)); g.drawOval(3, 3, 58, 58);
        String t = name.isEmpty() ? "?" : name.substring(0, 1).toUpperCase(); g.setFont(new java.awt.Font(java.awt.Font.SANS_SERIF, java.awt.Font.BOLD, 34)); java.awt.FontMetrics fm = g.getFontMetrics();
        g.drawString(t, 32 - fm.stringWidth(t) / 2, 32 + (fm.getAscent() - fm.getDescent()) / 2); g.dispose();
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream(); javax.imageio.ImageIO.write(im, "png", out); return out.toByteArray();
    }
    synchronized void syncAssets(boolean prune) throws Exception {   // prune: only at world start; a texture removed while a client may still draw it crashes that client
        Path src = skinsDir.resolve("Custom assets"); if (!Files.isDirectory(src)) return;
        StringBuilder stamp = new StringBuilder();
        try (Stream<Path> fs = Files.list(src)) { for (Path f : (Iterable<Path>) fs::iterator) stamp.append(f.getFileName()).append(Files.getLastModifiedTime(f).toMillis()).append(Files.size(f)).append(';'); }
        if (stamp.toString().equals(lastSync)) return;
        ensureLivePack(); Path live = modsDir.resolve(LIVE), texDir = live.resolve("Common").resolve("Characters").resolve("SkinEditor"), entDir = live.resolve("Server").resolve("SkinEditor");
        Set<String> keepFiles = new HashSet<>();
        try (Stream<Path> fs = Files.list(src)) {
            for (Path f : (Iterable<Path>) fs::iterator) {
                String n = f.getFileName().toString(); if (!n.endsWith(".json") || Files.size(f) > 20_000) continue;
                String json = Files.readString(f); if ("true".equals(raw(json, "locked"))) continue;   // repaints of edition and reward items stay on the site
                String id = str(json, "id"), field = str(json, "field"), model = str(json, "model");
                if (id == null || !ID.matcher(id).matches() || field == null || !SLOTS.contains(field) || model == null || !ASSET_PATH.matcher(model).matches() || model.contains("..") || !model.endsWith(".blockymodel")) continue;
                Path png = src.resolve(n.substring(0, n.length() - 5) + ".png"); if (!Files.isRegularFile(png) || Files.size(png) > 2_000_000) continue;
                byte[] data = Files.readAllBytes(png); if (data.length < 8 || (data[0] & 0xff) != 0x89 || data[1] != 'P' || data[2] != 'N' || data[3] != 'G') continue;
                String ver = String.format("%08x", java.util.Arrays.hashCode(data)), tex = id + "-" + ver + ".png";
                Path out = texDir.resolve(tex); if (!Files.isRegularFile(out)) Files.write(out, data);
                // a reshaped asset brings its own model: it gets a content-named file too, and the entry points at it
                Path shp = src.resolve(n.substring(0, n.length() - 5) + ".blockymodel");
                if (Files.isRegularFile(shp) && Files.size(shp) <= 200_000) { String mj = Files.readString(shp).trim();
                    if (mj.startsWith("{") && mj.contains("\"nodes\"")) { String mf = id + "-" + String.format("%08x", mj.hashCode()) + ".blockymodel";
                        Path mo = texDir.resolve(mf); if (!Files.isRegularFile(mo)) Files.writeString(mo, mj); keepFiles.add(mf); model = "Characters/SkinEditor/" + mf; } }
                String baseId = str(json, "baseId"), tone = str(json, "tone"); if (baseId != null && !WORD.matcher(baseId).matches()) baseId = null; if (tone != null && !WORD.matcher(tone).matches()) tone = null;
                String entry = "{\"format\": \"skin-editor-asset\", \"id\": \"" + id + "\", \"field\": \"" + field + "\", \"model\": \"" + model + "\", \"texture\": \"Characters/SkinEditor/" + tex + "\""
                    + (baseId != null ? ", \"baseId\": \"" + baseId + "\"" : "") + (tone != null ? ", \"tone\": \"" + tone + "\"" : "") + "}\n";
                Path ent = entDir.resolve(id + ".json"); if (!Files.isRegularFile(ent) || !Files.readString(ent).equals(entry)) Files.writeString(ent, entry);
                keepFiles.add(tex); keepFiles.add(id + ".json");
            }
        }
        if (prune) for (Path dir : List.of(texDir, entDir)) try (Stream<Path> fs = Files.list(dir)) {   // old repaints and deleted assets go (at world start only)
            for (Path f : (Iterable<Path>) fs::iterator) if (!keepFiles.contains(f.getFileName().toString())) Files.deleteIfExists(f);
        }
        lastSync = stamp.toString();
    }

    /** the custom assets in the live pack, by id */
    Map<String, Asset> assets() {
        Map<String, Asset> out = new LinkedHashMap<>(); Path live = modsDir.resolve(LIVE), entDir = live.resolve("Server").resolve("SkinEditor");
        if (!Files.isDirectory(entDir)) return out;
        try (Stream<Path> fs = Files.list(entDir)) {
            for (Path f : (Iterable<Path>) fs::iterator) {
                if (!f.getFileName().toString().endsWith(".json")) continue; String json = Files.readString(f);
                String id = str(json, "id"), field = str(json, "field"), model = str(json, "model"), tex = str(json, "texture");
                if (id == null || !ID.matcher(id).matches() || field == null || !SLOTS.contains(field) || model == null || tex == null || !TEX.matcher(tex).matches()) continue;
                String baseId = str(json, "baseId"), tone = str(json, "tone"); if (baseId != null && !WORD.matcher(baseId).matches()) baseId = null; if (tone != null && !WORD.matcher(tone).matches()) tone = null;
                if (Files.isRegularFile(live.resolve("Common").resolve(tex))) out.put(id, new Asset(id, field, model, tex, baseId, tone));
            }
        } catch (Exception e) { getLogger().atWarning().log("[Hytale Designer Sync] could not read the live pack: " + e); }
        return out;
    }

    private static String str(String json, String key) {
        Matcher m = Pattern.compile("\"" + key + "\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"").matcher(json);
        return m.find() ? m.group(1).replace("\\\"", "\"").replace("\\\\", "\\") : null;
    }
    private static String raw(String json, String key) { Matcher m = Pattern.compile("\"" + key + "\"\\s*:\\s*(true|false)").matcher(json); return m.find() ? m.group(1) : null; }

    /** None eyes: every face texture of the game, from this PC's own Assets.zip, with its eye area smoothed over (as the website draws
     *  it), written into the live pack once per game version. Kept out of Characters/SkinEditor, which the asset sync prunes. */
    static void makeNoEyeFaces(Path common) throws Exception {
        Path jar = Path.of(CosmeticsModule.class.getProtectionDomain().getCodeSource().getLocation().toURI()), zip = jar.getParent().getParent().resolve("Assets.zip");
        if (!Files.isRegularFile(zip)) return;
        Path dir = common.resolve(NO_EYES), mark = dir.resolve("made-from.txt");
        String stamp = Files.size(zip) + " " + Files.getLastModifiedTime(zip).toMillis() + " v2";
        if (Files.isRegularFile(mark) && Files.readString(mark).equals(stamp)) return;
        try (var z = new java.util.zip.ZipFile(zip.toFile())) {
            for (var en = z.entries(); en.hasMoreElements(); ) { var e = en.nextElement(); String n = e.getName();
                if (!n.startsWith("Common/Characters/Body_Attachments/Faces/") || !n.endsWith(".png")) continue;
                java.awt.image.BufferedImage im; try (var in = z.getInputStream(e)) { im = javax.imageio.ImageIO.read(in); }
                if (im == null) continue;
                Path out = dir.resolve(n.substring("Common/".length())); Files.createDirectories(out.getParent());
                javax.imageio.ImageIO.write(smoothEyes(im), "png", out.toFile()); } }
        Files.writeString(mark, stamp);
    }

    /** the same as smoothEyes in the website's figure.js: blink lids and lashes cleared, each eye hole and its painted rim (2 px to the
     *  sides, 4 above, 1 below) refilled column by column from the skin just above to the skin just below (window medians) */
    static java.awt.image.BufferedImage smoothEyes(java.awt.image.BufferedImage src) {
        int w = src.getWidth(), h = src.getHeight(), sc = Math.max(1, Math.round(w / 64f)), fw = Math.min(w, 30 * sc), fh = Math.min(h, 28 * sc);
        var im = new java.awt.image.BufferedImage(w, h, java.awt.image.BufferedImage.TYPE_INT_ARGB); im.getGraphics().drawImage(src, 0, 0, null);
        for (int[] r : new int[][] { { 14, 38, 52, 52 }, { 30, 0, 64, 28 } })
            for (int y = r[1] * sc; y < Math.min(h, r[3] * sc); y++) for (int x = r[0] * sc; x < Math.min(w, r[2] * sc); x++) im.setRGB(x, y, 0);
        boolean[] seen = new boolean[w * h];
        for (int y0 = 0; y0 < fh; y0++) for (int x0 = 0; x0 < fw; x0++) {
            if (seen[y0 * w + x0] || (im.getRGB(x0, y0) >>> 24) != 0) continue;
            int l = x0, r = x0, t = y0, b = y0; var st = new java.util.ArrayDeque<int[]>(); st.push(new int[] { x0, y0 }); seen[y0 * w + x0] = true;
            while (!st.isEmpty()) { int[] q = st.pop(); int x = q[0], y = q[1]; l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y);
                for (int[] d : new int[][] { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } }) { int nx = x + d[0], ny = y + d[1];
                    if (nx >= 0 && ny >= 0 && nx < fw && ny < fh && !seen[ny * w + nx] && (im.getRGB(nx, ny) >>> 24) == 0) { seen[ny * w + nx] = true; st.push(new int[] { nx, ny }); } } }
            if ((r - l + 1) * (b - t + 1) < 4 * sc * sc) continue;   // a stray clear pixel, not an eye hole
            l = Math.max(0, l - 2 * sc); r = Math.min(fw - 1, r + 2 * sc); t = Math.max(1, t - 4 * sc); b = Math.min(fh - 2, b + sc);
            for (int x = l; x <= r; x++) { int up = edge(im, x, t - 1, t - 2, sc), dn = edge(im, x, b + 1, b + 2, sc);
                for (int y = t; y <= b; y++) { double f = (y - t + 1) / (double) (b - t + 2); int c = 0xff000000;
                    for (int k = 0; k < 24; k += 8) c |= (int) Math.round(((up >> k) & 255) * (1 - f) + ((dn >> k) & 255) * f) << k;
                    im.setRGB(x, y, c); } }
        }
        return im;
    }
    /** the skin at an edge of an eye area: the median (by brightness) of a 5 x 2 window, so a freckle or wrinkle isn't stretched into a streak */
    static int edge(java.awt.image.BufferedImage im, int x, int y1, int y2, int sc) {
        List<Integer> px = new ArrayList<>();
        for (int y : new int[] { y1, y2 }) for (int xx = Math.max(0, x - 2 * sc); xx <= Math.min(im.getWidth() - 1, x + 2 * sc); xx++)
            if (y >= 0 && y < im.getHeight() && (im.getRGB(xx, y) >>> 24) != 0) px.add(im.getRGB(xx, y));
        if (px.isEmpty()) return 0xffe4e4e4;
        px.sort(java.util.Comparator.comparingInt(c -> ((c >> 16) & 255) + ((c >> 8) & 255) + (c & 255)));
        return px.get(px.size() / 2);
    }

    /** a skin as the Player model with one attachment per part, resolved from the game's cosmetics list (variant, fixed texture, or greyscale + colour) */
    @SuppressWarnings("unchecked")
    static Model skinToModel(CosmeticsModule cm, PlayerSkin ps, Model base, Map<String, Asset> custom) throws Exception {
        var reg = cm.getRegistry();
        java.util.function.Function<String, com.hypixel.hytale.server.core.cosmetics.PlayerSkin.PlayerSkinPartId> pid =
            id -> id == null ? null : com.hypixel.hytale.server.core.cosmetics.PlayerSkin.PlayerSkinPartId.fromString(id);
        var bodyId = pid.apply(ps.bodyCharacteristic); String tone = bodyId != null && bodyId.textureId != null ? bodyId.textureId : "02";
        var hairId = pid.apply(ps.haircut); String hair = hairId != null ? hairId.textureId : null;
        Object[][] parts = { {ps.face, reg.getFaces()}, {ps.ears, reg.getEars()}, {ps.mouth, reg.getMouths()}, {ps.eyes, reg.getEyes()}, {ps.eyebrows, reg.getEyebrows()},
            {ps.haircut, reg.getHaircuts()}, {ps.facialHair, reg.getFacialHairs()}, {ps.underwear, reg.getUnderwear()}, {ps.pants, reg.getPants()}, {ps.overpants, reg.getOverpants()},
            {ps.undertop, reg.getUndertops()}, {ps.overtop, reg.getOvertops()}, {ps.shoes, reg.getShoes()}, {ps.gloves, reg.getGloves()}, {ps.headAccessory, reg.getHeadAccessories()},
            {ps.faceAccessory, reg.getFaceAccessories()}, {ps.earAccessory, reg.getEarAccessories()}, {ps.skinFeature, reg.getSkinFeatures()}, {ps.cape, reg.getCapes()} };
        // a hat covers hair as in the game: fully covering hides it, half covering swaps a tall cut for the generic one of its length
        Asset ch = custom.get("headAccessory"), cHair = custom.get("haircut");
        var hatId = pid.apply(ps.headAccessory); var hat = ch != null ? (ch.baseId() == null ? null : reg.getHeadAccessories().get(ch.baseId())) : hatId == null ? null : reg.getHeadAccessories().get(hatId.assetId);
        var hairPart = cHair != null ? (cHair.baseId() == null ? null : reg.getHaircuts().get(cHair.baseId())) : hairId == null ? null : reg.getHaircuts().get(hairId.assetId);
        var hatType = hat == null ? null : hat.getHeadAccessoryType();
        boolean hairHidden = hatType == PlayerSkinPart.HeadAccessoryType.FullyCovering;
        boolean hairGeneric = !hairHidden && hatType == PlayerSkinPart.HeadAccessoryType.HalfCovering && hairPart != null && hairPart.doesRequireGenericHaircut();
        String genericHair = hairGeneric && hairPart.getHairType() != null ? GENERIC.get(hairPart.getHairType().name()) : null;
        // earrings hang from R/L-Ear-Attachment (or Head), which every body model has, so they are drawn like the rest
        List<ModelAttachment> out = new ArrayList<>();   // custom pieces first: the client draws only the first several attachments
        for (var e : custom.entrySet()) { String f = e.getKey(); Asset a = e.getValue();
            if (f.equals("bodyCharacteristic")) continue;   // the body is the model itself (set below), not a second body on top
            if (f.equals("haircut") && (hairHidden || hairGeneric)) continue;   // under a hat: hidden, or the game's generic cut drawn below
            out.add(new ModelAttachment(a.model(), a.texture(), null, null, 1.0)); }
        String hairTone = null; try { var hs = reg.getGradientSets().get("Hair"); if (hs != null) { var gm = hs.getClass().getMethod("getGradients").invoke(hs); if (gm instanceof Map<?, ?> mm && !mm.isEmpty()) hairTone = mm.containsKey("PitchBlack") ? "PitchBlack" : String.valueOf(mm.keySet().iterator().next()); }   /* the site draws it in the first hair colour (PitchBlack) */ } catch (Exception ignored) { }
        for (Object[] pr : parts) {
            String id = (String) pr[0];
            if (pr[1] == reg.getHaircuts() && (id == null || id.isEmpty()) && cHair != null && hairGeneric && genericHair != null && hairTone != null) id = genericHair + "." + hairTone;   // a custom cut under a half-covering hat: the game's generic one shows
            if (id == null || id.isEmpty()) continue;
            if (pr[1] == reg.getHaircuts()) { if (hairHidden) continue;
                if (hairGeneric && genericHair != null && reg.getHaircuts().containsKey(genericHair)) { var hp = pid.apply(id); id = genericHair + (hp.textureId != null ? "." + hp.textureId : ""); } }
            if (id.isEmpty()) continue;
            if (pr[1] == reg.getHeadAccessories() && custom.containsKey("headAccessory")) continue;   // the custom hat is drawn instead
            var map = (Map<String, PlayerSkinPart>) pr[1];
            var p = pid.apply(id); var part = map.get(p.assetId); if (part == null) continue;
            String mdl = part.getModel(), grey = part.getGreyscaleTexture(); var texs = part.getTextures();
            if (p.variantId != null && part.getVariants() != null && part.getVariants().containsKey(p.variantId)) { var v = part.getVariants().get(p.variantId);
                if (v.getModel() != null) mdl = v.getModel(); if (v.getGreyscaleTexture() != null) grey = v.getGreyscaleTexture(); if (v.getTextures() != null) texs = v.getTextures(); }
            String tex, gset = null, gid = null;
            if (texs != null && p.textureId != null && texs.containsKey(p.textureId)) tex = texs.get(p.textureId).getTexture();
            else { tex = grey; gset = part.getGradientSet(); gid = p.textureId != null ? p.textureId : "Skin".equals(gset) ? tone : "Hair".equals(gset) ? hair : null; }
            if (pr[1] == reg.getFaces() && tex != null && (ps.eyes == null || ps.eyes.isEmpty()) && !custom.containsKey("eyes") && liveCommon != null
                && Files.isRegularFile(liveCommon.resolve(NO_EYES + tex))) tex = NO_EYES + tex;   // None eyes: the face without its eye holes
            if (mdl != null && tex != null) out.add(new ModelAttachment(mdl, tex, gset, gid, 1.0));
        }
        Model m = new Model(base); var body = bodyId == null ? null : reg.getBodyCharacteristics().get(bodyId.assetId);
        java.util.function.BiConsumer<String, Object> set = (f, v) -> { try { var fl = Model.class.getDeclaredField(f); fl.setAccessible(true); fl.set(m, v); } catch (Exception e) { throw new RuntimeException(e); } };
        set.accept("attachments", out.toArray(new ModelAttachment[0]));
        Asset cb = custom.get("bodyCharacteristic");
        if (cb != null) { set.accept("model", cb.model()); set.accept("texture", cb.texture()); set.accept("gradientSet", null); set.accept("gradientId", null); }   // a copied body is painted already: its own model and texture, no tint
        else { if (body != null) { if (body.getModel() != null) set.accept("model", body.getModel()); if (body.getGreyscaleTexture() != null) set.accept("texture", body.getGreyscaleTexture()); }
            set.accept("gradientSet", "Skin"); set.accept("gradientId", tone); }
        set.accept("cachedPacket", null);
        return m;
    }

}
