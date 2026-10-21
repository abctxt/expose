import Layout from "@comp/layout/layout"
import {useTranslation} from "@fwk/i18n"

const NotFound = () => {
    const {t} = useTranslation()
    return (
        <Layout>
            <h1 style={{margin: "20px"}}>{t("header", "caption_notfound")}</h1>
        </Layout>
    )
}

export default NotFound
