package skineditor;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.Anchor;
import com.hypixel.hytale.server.core.ui.Value;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import java.util.List;
import javax.annotation.Nonnull;

/**
 * The in-game wardrobe: the open Lumberjack wardrobe with two racks. The top one holds the player's own skin (the in-game preset
 * slots join it once Hytale allows sign-in); the bottom one the skins saved in the website's Locker ("My skins" in the skins folder),
 * five to a page turned with the arrows on the doors, each on a hook with the picture the site saves beside it. A click
 * wears that skin (the mod writes Wearing.json, so custom pieces and the keepOwn rule work as from the site); the own skin gives the
 * real one back. The skin under the pointer lifts off the rail; the worn one hangs forward in a warm light. Opened by using the
 * Designer Wardrobe block, or any of the game's wardrobes in WardrobeSets (each in its own look); no commands.
 */
final class WardrobePage extends InteractiveCustomUIPage<WardrobePage.Event> {
    static final String PAGE_ID = "HytaleDesigner_Wardrobe";
    static final String LAYOUT = "Pages/HytaleDesigner/Wardrobe.ui";
    static final String CARD = "Pages/HytaleDesigner/WardrobeCard.ui";

    private final Wardrobe wardrobe;
    private final PlayerRef who;
    private final String layout;                                // the wardrobe set's own art and layout (WardrobeSets)
    private int hovered = -2;                                   // the hanger under the pointer: -1 = own skin, 0..4 = bottom rack, -2 = none
    private int page = 0;
    static final int RACK = 5;                                  // hangers on a rack
    static final String NO_PIC = "UI/Custom/Pages/Memories/MissingIcon.png";
    private List<Wardrobe.Look> looks = List.of();
    private String status = "";

    WardrobePage(PlayerRef who, Wardrobe wardrobe, String layout) {
        super(who, CustomPageLifetime.CanDismissOrCloseThroughInteraction, Event.CODEC);
        this.wardrobe = wardrobe; this.who = who; this.layout = layout;
    }

    @Override
    public void build(@Nonnull Ref<EntityStore> ref, @Nonnull UICommandBuilder ui, @Nonnull UIEventBuilder ev, @Nonnull Store<EntityStore> store) {
        ui.append(layout);
        looks = wardrobe.looks();
        String worn = wardrobe.wornName();                      // open on the page holding the skin worn
        for (int i = 0; i < looks.size(); i++) if (looks.get(i).name().equals(worn)) page = i / RACK;
        for (int i = 0; i < RACK; i++) {
            ui.append("#Grid", CARD);
            bind(ev, "#Grid[" + i + "] #Card", Integer.toString(i));
        }
        String own = wardrobe.ownPicture(who.getUuid());
        if (own != null) ui.set("#OwnPic.AssetPath", own);
        ui.set("#OwnName.Text", who.getUsername());
        bind(ev, "#OwnCard", "own");
        ev.addEventBinding(CustomUIEventBindingType.Activating, "#PrevPage", EventData.of("Type", "Page").append("Slot", "-1"), false);
        ev.addEventBinding(CustomUIEventBindingType.Activating, "#NextPage", EventData.of("Type", "Page").append("Slot", "1"), false);
        ui.set("#Count.Text", looks.size() + " / 50");
        ui.set("#Empty.Visible", looks.isEmpty());
        fill(ui);
        render(ui);
    }

    private static void bind(UIEventBuilder ev, String sel, String slot) {
        ev.addEventBinding(CustomUIEventBindingType.Activating, sel, EventData.of("Type", "Wear").append("Slot", slot), false);
        ev.addEventBinding(CustomUIEventBindingType.MouseEntered, sel, EventData.of("Type", "Enter").append("Slot", slot), false);
        ev.addEventBinding(CustomUIEventBindingType.MouseExited, sel, EventData.of("Type", "Leave").append("Slot", slot), false);
    }

    private int pages() { return Math.max(1, (looks.size() + RACK - 1) / RACK); }

    /** the bottom rack's five hangers show the page's skins */
    private void fill(UICommandBuilder ui) {
        for (int i = 0; i < RACK; i++) {
            int k = page * RACK + i; String card = "#Grid[" + i + "] ";
            ui.set(card + "#Card.Visible", k < looks.size());
            if (k >= looks.size()) continue;
            ui.set(card + "#Name.Text", looks.get(k).name());
            ui.set(card + "#Fav.Visible", looks.get(k).fav());
            String pic = looks.get(k).picture();
            ui.set(card + "#Pic.AssetPath", pic != null ? pic : NO_PIC);
        }
        ui.set("#Page.Text", pages() > 1 ? (page + 1) + " / " + pages() : "");
    }

    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref, @Nonnull Store<EntityStore> store, @Nonnull Event e) {
        if (e.type == null || e.slot == null) return;
        int i;
        try { i = "own".equals(e.slot) ? -1 : Integer.parseInt(e.slot); } catch (NumberFormatException x) { return; }
        UICommandBuilder ui = new UICommandBuilder();
        if ("Page".equals(e.type)) {
            int to = Math.floorMod(page + Integer.signum(i), pages()); if (to == page) return;   // both plaques always shown: paging wraps round
            page = to; hovered = -2; fill(ui);
        } else {
            if (i < -1 || i >= RACK || (i >= 0 && page * RACK + i >= looks.size())) return;
            switch (e.type) {
                case "Enter" -> hovered = i;
                case "Leave" -> { if (hovered == i) hovered = -2; }
                case "Wear" -> {
                    try { if (i == -1) wardrobe.wearOwn(); else wardrobe.wear(looks.get(page * RACK + i)); status = ""; }
                    catch (Exception ex) { status = "Could not change: " + ex.getMessage(); }
                }
                default -> { return; }
            }
        }
        render(ui); sendUpdate(ui, null, false);
    }

    /** the worn skin glows and comes forward (bigger), the one under the pointer a little; both grow around the coat hanger's
     *  shoulder bar (96 below the rack's top), so a skin never leaves its hanger. Shoulders sit 32% down a site picture and 36%
     *  down the game's own avatar picture (which is 0.617 as wide as tall). */
    private void render(UICommandBuilder ui) {
        String worn = wardrobe.wornName();
        for (int i = 0; i < RACK; i++) {
            int k = page * RACK + i; boolean on = k < looks.size() && looks.get(k).name().equals(worn); String card = "#Grid[" + i + "] ";
            ui.set(card + "#Worn.Visible", on);
            int s = on ? 94 : hovered == i ? 90 : 86;
            ui.setObject(card + "#Pic.Anchor", box(47 - s / 2, 96 - Math.round(s * 0.32f), s, s));
        }
        boolean own = wardrobe.wearingOwn();
        ui.set("#OwnWorn.Visible", own);
        int h = own ? 100 : hovered == -1 ? 96 : 92, w = Math.round(h * 0.617f);
        ui.setObject("#OwnPic.Anchor", box(47 - w / 2, 96 - Math.round(h * 0.36f), w, h));
        ui.set("#Status.Text", status);
    }

    private static Anchor box(int left, int top, int width, int height) {
        Anchor a = new Anchor(); a.setLeft(Value.of(left)); a.setTop(Value.of(top)); a.setWidth(Value.of(width)); a.setHeight(Value.of(height));
        return a;
    }

    static final class Event {
        static final BuilderCodec<Event> CODEC = BuilderCodec.builder(Event.class, Event::new)
            .append(new KeyedCodec<>("Type", Codec.STRING), (o, v) -> o.type = v, o -> o.type).add()
            .append(new KeyedCodec<>("Slot", Codec.STRING), (o, v) -> o.slot = v, o -> o.slot).add()
            .build();
        String type;
        String slot;
    }
}
