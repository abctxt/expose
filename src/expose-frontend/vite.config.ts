import {defineConfig} from "vite"
import preact from "@preact/preset-vite"
import compress from "vite-plugin-compression"
import {load} from "js-toml"
import zlib from "zlib"
import path from "path"
import fs from "fs"

interface DevServer {
    Open: boolean
    Port: number
    Host: string
    Cert: string
    PrivKey: string
}

// Dev config file must be created manually first
const cfgPath = "../../config/frontend.toml"
const tomlCfg = load(fs.readFileSync(cfgPath, "utf-8"))
const devServer: DevServer = tomlCfg["DevServer"]

const cert = fs.readFileSync(devServer.Cert)
const privKey = fs.readFileSync(devServer.PrivKey)


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [ // In sync with tsconfig.json
            {find: "@app", replacement: path.resolve(__dirname, "src/app")},
            {find: "@page", replacement: path.resolve(__dirname, "src/pages")},
            {find: "@comp", replacement: path.resolve(__dirname, "src/components")},
            {find: "@fwk", replacement: path.resolve(__dirname, "src/_framework")},
            {find: "@res", replacement: path.resolve(__dirname, "res")},
        ],
    },
    css: {
        preprocessorOptions: {
            styl: {
                additionalData:
                    `@import "${path.resolve(__dirname, "src/app/colors")}"
                     @import "${path.resolve(__dirname, "src/app/screen")}"
                     @import "${path.resolve(__dirname, "src/_framework/flex")}"
                     @import "${path.resolve(__dirname, "src/_framework/utils")}"`
            },
        },
    },
    build: {
        outDir: "build"
    },
    esbuild: {
        supported: {
            "top-level-await": true
        },
    },
    server: {
        strictPort: true,
        port: devServer.Port,
        open: devServer.Open,
        host: devServer.Host,
        https: {cert, key: privKey}
    },
    plugins: [
        preact(),
        /*compress({
            verbose: false,
            deleteOriginFile: true,
            algorithm: "brotliCompress",
            filter: /\/assets\/.+\.(js|css|svg)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_DEFAULT_QUALITY,
                    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                },
            },
        })*/
    ]
})
