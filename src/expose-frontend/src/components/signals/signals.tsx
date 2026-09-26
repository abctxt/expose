import {HubConnectionBuilder} from "@microsoft/signalr"
import {useEffect} from "preact/hooks"


const SignalHandler = () => {
    const backendUrl = `${window.location.protocol}//${window.location.hostname}:5777`
    //
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${backendUrl}/signals`)
            .withAutomaticReconnect()
            .build();

        (async () => {
            await connection.start()
        })()

        connection.start().then(() => {
            /*connection.on("ReceiveMessage", (user: string, message: string) => {
            })*/
        })

        return async () => {
            await connection.stop()
        }
    })

    return <></>
}

export default SignalHandler
