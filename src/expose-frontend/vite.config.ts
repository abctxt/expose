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

interface FrontendToml {
    DevServer: DevServer
}

// Dev config file must be created manually first
const cfgPath = "../../config/frontend.toml"
const tomlCfg = load(fs.readFileSync(cfgPath, "utf-8")) as unknown as FrontendToml
const devServer = tomlCfg.DevServer

const https = devServer.Cert && devServer.PrivKey
    ? {
        cert: fs.readFileSync(devServer.Cert),
        key: fs.readFileSync(devServer.PrivKey)
    }
    : undefined


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
        outDir: "build",
        // Vite 8 defaults to lightningcss, which rejects progressive CSS from browserux.css
        // (e.g. ::search-text:current). Keep esbuild until lightningcss catches up.
        cssMinify: "esbuild",
    },
    server: {
        strictPort: true,
        port: devServer.Port,
        open: devServer.Open,
        host: devServer.Host,
        https
    },
    plugins: [
        preact({
            devToolsEnabled: false,
        }),
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
