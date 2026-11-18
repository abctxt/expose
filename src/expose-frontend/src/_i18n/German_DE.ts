import Translation from "./_i18n"
import English_US from "./English_US"

const German_DE: Translation = {
    ...English_US,
    //
    displayName: "Deutsch (DE)",
    //
    header: {
        caption_dashboard: "Übersicht",
        caption_etf_holdings: "ETF-Positionen",
        caption_setup: "Einstellungen",
        caption_network: "Netzwerk",
        caption_about: "Über diese Software",
        caption_notfound: "Nicht gefunden",
    },
    navmenu: {
        menu_dashboard: "Übersicht",
        menu_etf_holdings: "ETF-Positionen",
        menu_setup: "Setup",
    },
    shell: {
        hide_header: "Obere Leiste ausblenden",
        show_header: "Obere Leiste einblenden",
        hide_nav: "Navigationsleiste ausblenden",
        show_nav: "Navigationsleiste einblenden",
    },
    dashboard: {
        viewport_expand: "Ansicht erweitern",
        viewport_collapse: "Ansicht einklappen",
        view_map: "Karte",
        view_satellite: "Satellit",
        grid_lock: "Raster sperren",
        grid_unlock: "Raster entsperren",
    },
    setup: {
        category_appearance: "Darstellung",
        language: "Sprache",
        language_desc: "Sprache der Oberfläche.",
        dark_mode: "Dunkler Modus",
        dark_mode_desc: "Dunkles Farbschema für die Oberfläche verwenden.",
        accent: "Akzentfarbe",
        accent_desc: "Farbe aktiver Hervorhebungen. Der Fokus verwendet eine hellere Stufe.",
        accent_red: "Rot",
        accent_blue: "Blau",
        accent_teal: "Petrol",
        accent_amber: "Bernstein",
        accent_violet: "Violett",
        ui_size: "Oberflächengröße",
        ui_size_desc: "Dichte der Bedienelemente in der Oberfläche.",
        size_compact: "Kompakt",
        size_cozy: "Komfortabel",
        size_condensed: "Kondensiert",
        font_size: "Schriftgröße",
        font_size_desc: "Textgröße der Oberfläche.",
        font_default: "Standard",
        font_enlarged: "Vergrößert",
        category_behavior: "Verhalten",
        scroll_menus: "Menüs scrollen",
        scroll_menus_desc: "Scrollen im aktiven Menü wechselt dessen Seiten. Linkes Menü und obere Leiste bleiben getrennt, und am Ende bleibt die Seite stehen.",
    }
}

export default German_DE
