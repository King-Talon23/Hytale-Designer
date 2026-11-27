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
 * The in-game wardrobe: the open Lumberjack wardrobe with the player's own skin on the left of the post and the skins saved in the
 * website's Locker ("My skins" in the skins folder) on the right, each on a hook with the picture the site saves beside it. A click
 * wears that skin (the mod writes Wearing.json, so custom pieces and the keepOwn rule work as from the site); the own skin gives the
 * real one back. The skin under the pointer lifts off the rail; the worn one hangs forward in a warm light. Opened by using the
 * Designer Wardrobe block; no commands.
 */
final class WardrobePage extends InteractiveCustomUIPage<WardrobePage.Event> {
    static final String PAGE_ID = "HytaleDesigner_Wardrobe";
    static final String LAYOUT = "Pages/HytaleDesigner/Wardrobe.ui";
    static final String CARD = "Pages/HytaleDesigner/WardrobeCard.ui";

    private final Wardrobe wardrobe;
    private final PlayerRef who;
    private int hovered = -2;                                   // the hanger under the pointer: -1 = own skin, -2 = none
    private List<Wardrobe.Look> looks = List.of();
    private String status = "";

    WardrobePage(PlayerRef who, Wardrobe wardrobe) {
        super(who, CustomPageLifetime.CanDismissOrCloseThroughInteraction, Event.CODEC);
        this.wardrobe = wardrobe; this.who = who;
    }

    @Override
    public void build(@Nonnull Ref<EntityStore> ref, @Nonnull UICommandBuilder ui, @Nonnull UIEventBuilder ev, @Nonnull Store<EntityStore> store) {
        ui.append(LAYOUT);
        looks = wardrobe.looks();
        for (int i = 0; i < looks.size(); i++) {
            String card = "#Grid[" + i + "] ";
            ui.append("#Grid", CARD);
            ui.set(card + "#Name.Text", looks.get(i).name());
            String pic = looks.get(i).picture();
            if (pic != null) ui.set(card + "#Pic.AssetPath", pic);
            ui.set(card + "#Rail.Visible", i >= 3);                 // the first row hangs from the wardrobe's own rail
            bind(ev, card + "#Card", Integer.toString(i));
        }
        String own = wardrobe.ownPicture(who.getUuid());
        if (own != null) ui.set("#OwnPic.AssetPath", own);
        ui.set("#OwnName.Text", who.getUsername());
        bind(ev, "#OwnCard", "own");
        ui.set("#Count.Text", looks.size() + " / 50");
        ui.set("#Empty.Visible", looks.isEmpty());
        render(ui);
    }

    private static void bind(UIEventBuilder ev, String sel, String slot) {
        ev.addEventBinding(CustomUIEventBindingType.Activating, sel, EventData.of("Type", "Wear").append("Slot", slot), false);
        ev.addEventBinding(CustomUIEventBindingType.MouseEntered, sel, EventData.of("Type", "Enter").append("Slot", slot), false);
        ev.addEventBinding(CustomUIEventBindingType.MouseExited, sel, EventData.of("Type", "Leave").append("Slot", slot), false);
    }

    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref, @Nonnull Store<EntityStore> store, @Nonnull Event e) {
        if (e.type == null || e.slot == null) return;
        int i;
        try { i = "own".equals(e.slot) ? -1 : Integer.parseInt(e.slot); } catch (NumberFormatException x) { return; }
        if (i < -1 || i >= looks.size()) return;
        switch (e.type) {
            case "Enter" -> hovered = i;
            case "Leave" -> { if (hovered == i) hovered = -2; }
            case "Wear" -> {
                try { if (i == -1) wardrobe.wearOwn(); else wardrobe.wear(looks.get(i)); status = ""; }
                catch (Exception ex) { status = "Could not change: " + ex.getMessage(); }
            }
            default -> { return; }
        }
        UICommandBuilder ui = new UICommandBuilder(); render(ui); sendUpdate(ui, null, false);
    }

    /** the worn skin glows and hangs forward (a little bigger); the one under the pointer lifts off the rail */
    private void render(UICommandBuilder ui) {
        String worn = wardrobe.wornName();
        for (int i = 0; i < looks.size(); i++) {
            boolean on = looks.get(i).name().equals(worn); String card = "#Grid[" + i + "] ";
            ui.set(card + "#Worn.Visible", on);
            ui.setObject(card + "#Hang.Anchor", box(0, hovered == i ? -8 : 0, 120, 200));
            ui.setObject(card + "#Pic.Anchor", on ? box(2, 64, 116, 116) : box(6, 68, 108, 108));
        }
        boolean own = wardrobe.wearingOwn();
        ui.set("#OwnWorn.Visible", own);
        ui.setObject("#OwnHang.Anchor", box(0, hovered == -1 ? -8 : 0, 124, 200));
        ui.setObject("#OwnPic.Anchor", own ? box(24, 64, 76, 122) : box(27, 68, 70, 112));
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
