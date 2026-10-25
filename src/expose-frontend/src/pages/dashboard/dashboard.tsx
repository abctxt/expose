import Layout from "@comp/layout/layout"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {useTranslation} from "@fwk/i18n"
import {Button, SplitterElement, SplitterLayout} from "@ui5/webcomponents-react"
import {PieChart} from "@ui5/webcomponents-react-charts"
import type {ComponentChildren} from "preact"
import {useLayoutEffect, useRef} from "preact/hooks"
import styl from "./dashboard.module.styl"
import {setViewport, setViewportOpen, toggleGridLock, Viewport} from "./dashboard.redux"

/** Visible slice fills; default UI5 chart tokens are not always defined on the page. */
const kSliceColors = ["#5899da", "#19a979", "#ff8fe4", "#c387ba"]

/** Starter dataset; replace with live data as the dashboard grows. */
const kPlaceholderAllocation = [
    {segment: "Equities", share: 42},
    {segment: "Fixed income", share: 28},
    {segment: "Cash", share: 18},
    {segment: "Alternatives", share: 12},
]

const Panel = ({title, children, className}: {title?: string, children?: ComponentChildren, className?: string}) => (
    <div className={[styl.panel, className ?? ""].filter(Boolean).join(" ")}>
        {title ? <h2 className={styl.heading}>{title}</h2> : null}
        {children}
    </div>
)

type ViewButtonProps = {
    icon: string
    label: string
    pressed?: boolean
    className?: string
    onClick: () => void
}

const ViewButton = ({icon, label, pressed, className, onClick}: ViewButtonProps) => (
    <Button
        design="Transparent"
        className={[styl.viewButton, pressed ? styl.active : "", className ?? ""].filter(Boolean).join(" ")}
        icon={icon}
        tooltip={label}
        accessibleName={label}
        onClick={onClick}/>
)

const views = [
    {id: Viewport.Map, icon: "map", labelKey: "view_map"},
    {id: Viewport.Satellite, icon: "globe", labelKey: "view_satellite"},
] as const

const Dashboard = () => {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const boardRef = useRef<HTMLDivElement>(null)
    const open = useAppSelector(state => state.dashboard.viewportOpen)
    const viewport = useAppSelector(state => state.dashboard.viewport)
    const gridLocked = useAppSelector(state => state.dashboard.gridLocked)
    const uiSize = useAppSelector(state => state.setup.uiSize)
    const viewLabel = views.find(view => view.id === viewport)
    const toggleLabel = open ? t("dashboard", "viewport_collapse") : t("dashboard", "viewport_expand")
    const gridLabel = gridLocked ? t("dashboard", "grid_unlock") : t("dashboard", "grid_lock")
    const splitClass = gridLocked ? `${styl.split} ${styl.locked}` : styl.split

    useLayoutEffect(() => {
        const root = boardRef.current
        if (!root) {
            return
        }
        for (const bar of root.querySelectorAll<HTMLElement>('[role="separator"]')) {
            if (gridLocked) {
                bar.setAttribute("inert", "")
            } else {
                bar.removeAttribute("inert")
            }
        }
    }, [gridLocked])

    return (
        <Layout>
            <div className={styl.board} ref={boardRef} data-page="dashboard">
                <SplitterLayout className={splitClass} style={{width: "100%", height: "100%"}}>
                    <SplitterElement size="32%" minSize={180}>
                        <Panel>
                            <div className={styl.lines}>
                                {kPlaceholderAllocation.map(item => (
                                    <div className={styl.row} key={item.segment}>
                                        <span>{item.segment}</span>
                                        <span>{item.share}</span>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </SplitterElement>
                    <SplitterElement size="68%" minSize={240}>
                        <SplitterLayout vertical className={splitClass} style={{width: "100%", height: "100%"}}>
                            <SplitterElement size="66%" minSize={120}>
                                <Panel title="Sample allocation" className={styl.chartPanel}>
                                    <div className={styl.chartShell}>
                                        <PieChart
                                            className={styl.chart}
                                            style={{height: "100%", width: "100%"}}
                                            dataset={kPlaceholderAllocation}
                                            dimension={{accessor: "segment"}}
                                            measure={{accessor: "share", colors: kSliceColors}}
                                            noAnimation
                                            chartConfig={{
                                                margin: {top: 12, right: 12, bottom: 12, left: 12},
                                            }}
                                        />
                                    </div>
                                </Panel>
                            </SplitterElement>
                            <SplitterElement size="34%" minSize={100}>
                                <Panel title={viewLabel ? t("dashboard", viewLabel.labelKey) : ""}/>
                            </SplitterElement>
                        </SplitterLayout>
                    </SplitterElement>
                </SplitterLayout>
                <div className={`${styl.viewport} ${styl[uiSize]}`}>
                    <ViewButton
                        icon={open ? "slim-arrow-right" : "slim-arrow-left"}
                        label={toggleLabel}
                        className={open ? styl.collapse : undefined}
                        onClick={() => dispatch(setViewportOpen(!open))}/>
                    {open && views.map(view => (
                        <ViewButton
                            key={view.id}
                            icon={view.icon}
                            label={t("dashboard", view.labelKey)}
                            pressed={viewport === view.id}
                            onClick={() => dispatch(setViewport(view.id))}/>
                    ))}
                    {open && (
                        <ViewButton
                            icon="grid"
                            label={gridLabel}
                            pressed={gridLocked}
                            onClick={() => dispatch(toggleGridLock())}/>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
