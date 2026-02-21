import {HubConnectionBuilder} from "@microsoft/signalr"
import {useEffect} from "preact/hooks"


const SignalHandler = () => {
    //
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5777/signals")
            .withAutomaticReconnect()
            .build();

        (async () => {
            await connection.start()
        })()

        /*connection.start().then(() => {
            console.log("Connection started")

            connection.on("ReceiveMessage", (user: string, message: string) => {
                console.log(`${user} : ${message}`)
            })
        })*/

        return async () => {
            console.log("Connection stopped")
            await connection.stop()
        }
    })

    return <></>
}

export default SignalHandler
