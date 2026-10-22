import Translation from "./_i18n"
import English_US from "./English_US"

const German_DE: Translation = {
    ...English_US,
    //
    displayName: "Deutsch (DE)",
    //
    header: {
        caption_dashboard: "Übersicht",
        caption_setup: "Einstellungen",
        caption_network: "Netzwerk",
        caption_about: "Über diese Software",
        caption_notfound: "Nicht gefunden",
    },
    navmenu: {
        menu_dashboard: "Übersicht",
        menu_setup: "Setup",
    },
    shell: {
        hide_header: "Obere Leiste ausblenden",
        show_header: "Obere Leiste einblenden",
        hide_nav: "Navigationsleiste ausblenden",
        show_nav: "Navigationsleiste einblenden",
    },
    setup: {
        category_appearance: "Darstellung",
        language: "Sprache",
        language_desc: "Sprache der Oberfläche.",
        dark_mode: "Dunkler Modus",
        dark_mode_desc: "Dunkles Farbschema für die Oberfläche verwenden.",
        ui_size: "Oberflächengröße",
        ui_size_desc: "Dichte der Bedienelemente in der Oberfläche.",
        size_compact: "Kompakt",
        size_cozy: "Komfortabel",
        size_condensed: "Kondensiert",
        font_size: "Schriftgröße",
        font_size_desc: "Textgröße der Oberfläche.",
        font_default: "Standard",
        font_enlarged: "Vergrößert",
    }
}

export default German_DE
