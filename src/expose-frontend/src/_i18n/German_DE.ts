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
    },
    navmenu: {
        menu_dashboard: "Übersicht",
        menu_setup: "Setup",
    }
}

export default German_DE
