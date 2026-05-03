import Layout from "@comp/layout/layout"
import {PieChart} from "@ui5/webcomponents-react-charts"
import styl from "./dashboard.module.styl"

/** Visible slice fills; default UI5 chart tokens are not always defined on the page. */
const kSliceColors = ["#5899da", "#19a979", "#ff8fe4", "#c387ba"]

/** Starter dataset; replace with live data as the dashboard grows. */
const kPlaceholderAllocation = [
    {segment: "Equities", share: 42},
    {segment: "Fixed income", share: 28},
    {segment: "Cash", share: 18},
    {segment: "Alternatives", share: 12},
]

const Dashboard = () => (
    <Layout>
        <section className={styl.dashboard} data-page="dashboard">
            <h2 className={styl.heading}>Sample allocation</h2>
            <div className={styl.chartShell}>
                <PieChart
                    className={styl.chart}
                    style={{height: 400, width: "100%", minWidth: 280, maxWidth: 560}}
                    dataset={kPlaceholderAllocation}
                    dimension={{accessor: "segment"}}
                    measure={{accessor: "share", colors: kSliceColors}}
                    noAnimation
                    chartConfig={{
                        margin: {top: 12, right: 12, bottom: 12, left: 12},
                    }}
                />
            </div>
        </section>
    </Layout>
)

export default Dashboard
