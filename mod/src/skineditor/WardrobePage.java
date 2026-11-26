package skineditor;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import java.util.List;
import javax.annotation.Nonnull;

/**
 * The in-game wardrobe: a grid of the skins saved in the website's Locker ("My skins" in the skins folder), each with the picture
 * the site saves beside it. A click wears that skin (the mod writes Wearing.json, so custom pieces and the keepOwn rule work as from
 * the site); "My own skin" gives the real skin back. Opened with the Designer Wardrobe item; no commands.
 */
final class WardrobePage extends InteractiveCustomUIPage<WardrobePage.Event> {
    static final String PAGE_ID = "HytaleDesigner_Wardrobe";
    static final String LAYOUT = "Pages/HytaleDesigner/Wardrobe.ui";
    static final String CARD = "Pages/HytaleDesigner/WardrobeCard.ui";

    private final Wardrobe wardrobe;
    private List<Wardrobe.Look> looks = List.of();
    private String status = "";

    WardrobePage(PlayerRef who, Wardrobe wardrobe) {
        super(who, CustomPageLifetime.CanDismissOrCloseThroughInteraction, Event.CODEC);
        this.wardrobe = wardrobe;
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
            ev.addEventBinding(CustomUIEventBindingType.Activating, card + "#Card", EventData.of("Type", "Wear").append("Slot", Integer.toString(i)), false);
        }
        ev.addEventBinding(CustomUIEventBindingType.Activating, "#OwnButton", EventData.of("Type", "Own"), false);
        ui.set("#Count.Text", looks.size() + " / 50");
        ui.set("#Empty.Visible", looks.isEmpty());
        render(ui);
    }

    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref, @Nonnull Store<EntityStore> store, @Nonnull Event e) {
        if (e.type == null) return;
        try {
            switch (e.type) {
                case "Wear" -> {
                    int i = Integer.parseInt(e.slot);
                    if (i < 0 || i >= looks.size()) return;
                    wardrobe.wear(looks.get(i)); status = "";
                }
                case "Own" -> { wardrobe.wearOwn(); status = ""; }
                default -> { return; }
            }
        } catch (Exception ex) { status = "Could not change: " + ex.getMessage(); }
        UICommandBuilder ui = new UICommandBuilder(); render(ui); sendUpdate(ui, null, false);
    }

    private void render(UICommandBuilder ui) {
        String worn = wardrobe.wornName();
        for (int i = 0; i < looks.size(); i++) ui.set("#Grid[" + i + "] #Worn.Visible", looks.get(i).name().equals(worn));
        ui.set("#Status.Text", status);
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
