import type {Plugin} from "vite"

/**
 * UI5 Assets.js registers every message bundle, CLDR locale, and theme via
 * dynamic imports. This plugin marks unsupported ones as external so Vite does
 * not emit them into dist.
 *
 * Keep lists follow UI5 asset IDs (underscore locales), not BCP-47 app locales:
 *   en-US → en, en-GB → en_GB, de-DE → de, de-CH → de_CH, cz-CZ → cs
 */
const keepLocales = new Set(["en", "en_GB", "de", "de_CH", "cs"])

/** Light + dark Horizon; drop Fiori 3 / HCB / auto variants. */
const keepThemes = new Set(["sap_horizon", "sap_horizon_dark"])

function shouldSkipUi5Asset(source: string): boolean {
    const messagebundle = source.match(/messagebundle_([A-Za-z0-9_]+)\.json/)
    if (messagebundle) {
        return !keepLocales.has(messagebundle[1])
    }

    const cldr = source.match(/(?:\/|\\)cldr(?:\/|\\)([A-Za-z0-9_]+)\.json/)
    if (cldr) {
        return !keepLocales.has(cldr[1])
    }

    const theme = source.match(/(?:\/|\\)themes(?:\/|\\)(sap_[A-Za-z0-9_]+)(?:\/|\\)parameters-bundle/)
    if (theme) {
        return !keepThemes.has(theme[1])
    }

    return false
}

export function ui5LimitAssets(): Plugin {
    return {
        name: "ui5-limit-assets",
        enforce: "pre",
        resolveDynamicImport(source) {
            if (typeof source === "string" && shouldSkipUi5Asset(source)) {
                // false => treat as external; chunk is omitted from the build
                return false
            }
            return null
        },
    }
}
