import Translation from "./_i18n"
import German_DE from "./German_DE"

const German_CH: Translation = {
    ...German_DE,
    //
    displayName: "Deutsch (CH)",
    //
    setup: {
        ...German_DE.setup,
        ui_size: "Oberflächengrösse",
        font_size: "Schriftgrösse",
        font_size_desc: "Textgrösse der Oberfläche.",
        font_enlarged: "Vergrössert",
    },
}

export default German_CH
