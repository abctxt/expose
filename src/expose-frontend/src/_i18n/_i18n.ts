//
// Common interface for all translations
//
interface Translation {
    readonly displayName: string;
    readonly header: Translation_Header
    readonly navmenu: Translation_NavMenu
    readonly shell: Translation_Shell
    readonly dashboard: Translation_Dashboard
    readonly setup: Translation_Setup
}

interface Translation_Header {
    readonly caption_dashboard: string
    readonly caption_setup: string
    readonly caption_network: string
    readonly caption_about: string
    readonly caption_notfound: string
}

interface Translation_NavMenu {
    readonly menu_dashboard: string
    readonly menu_setup: string
}

interface Translation_Shell {
    readonly hide_header: string
    readonly show_header: string
    readonly hide_nav: string
    readonly show_nav: string
}

interface Translation_Dashboard {
    readonly viewport_expand: string
    readonly viewport_collapse: string
    readonly view_map: string
    readonly view_satellite: string
    readonly grid_lock: string
    readonly grid_unlock: string
}

interface Translation_Setup {
    readonly category_appearance: string
    readonly language: string
    readonly language_desc: string
    readonly dark_mode: string
    readonly dark_mode_desc: string
    readonly accent: string
    readonly accent_desc: string
    readonly accent_red: string
    readonly accent_blue: string
    readonly accent_teal: string
    readonly accent_amber: string
    readonly accent_violet: string
    readonly ui_size: string
    readonly ui_size_desc: string
    readonly size_compact: string
    readonly size_cozy: string
    readonly size_condensed: string
    readonly font_size: string
    readonly font_size_desc: string
    readonly font_default: string
    readonly font_enlarged: string
}

export default Translation
