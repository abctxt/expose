//
// Flexbox components
//
import {FC} from "react"

interface FlexSpacerProps {
    grow?: number
}

const FlexSpacer: FC<FlexSpacerProps> = ({grow = 1}) => (
    <div style={{flexGrow: grow}}/>
)

export default FlexSpacer
