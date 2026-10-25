import Translation from "./_i18n"
import English_US from "./English_US"

const English_GB: Translation = {
    ...English_US,
    //
    displayName: "English (GB)",
    //
    setup: {
        ...English_US.setup,
        category_behavior: "Behaviour",
    },
}

export default English_GB
