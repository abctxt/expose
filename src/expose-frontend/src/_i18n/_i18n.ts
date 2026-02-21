//
// Common interface for all translations
//
interface Translation {
    readonly displayName: string;
    readonly header: Translation_Header
    readonly navmenu: Translation_NavMenu
}

interface Translation_Header {
    readonly caption_dashboard: string
    readonly caption_setup: string
    readonly caption_network: string
    readonly caption_about: string
}

interface Translation_NavMenu {
    readonly menu_dashboard: string
    readonly menu_setup: string
}

export default Translation
