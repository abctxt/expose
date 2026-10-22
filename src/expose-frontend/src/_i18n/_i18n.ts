//
// Common interface for all translations
//
interface Translation {
    readonly displayName: string;
    readonly header: Translation_Header
    readonly navmenu: Translation_NavMenu
    readonly shell: Translation_Shell
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

export default Translation
