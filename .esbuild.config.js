//@ts-check

//  Library
const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')
const chokidar = require('chokidar')

//  =====================
//  ESBUILD CONFIGURATION
//  =====================

const OUT_DIR = 'extension'
const SRC_DIR = 'src'

const BACKGROUND_SCRIPT = path.join(SRC_DIR, 'backgroundScript.js')
const CONTENT_SCRIPT = path.join(SRC_DIR, 'contentScript.js')

// const POPUP_SCRIPT = path.join(SRC_DIR, 'popup', 'script.js')
// const OPTIONS_SCRIPT = path.join(SRC_DIR, 'options', 'script.js')

const MANIFEST = 'manifest.js'

const STATIC_FILES = [
    'index.html',
    'style.css',
    'icons'
]

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD

/**
 * ESBuild Configuration
 * @type esbuild.BuildOptions
 */
const config = {
    entryPoints: [
        BACKGROUND_SCRIPT,
        CONTENT_SCRIPT,
        // POPUP_SCRIPT,
        // OPTIONS_SCRIPT,
    ],
    outdir: OUT_DIR,
    bundle: true,
    minify: IS_PROD,
    sourcemap: IS_DEV,
    // target: ['chrome58', 'firefox57'],
    watch: {
        onRebuild: (error, result) => {
            if (error) { console.error('watch build failed:', error) }
            console.log('watch build succeeded', /* result */)
        },
    }
}

//  =============================================================================================
esbuild.build(config).then(() => console.log('Build successful ✅')).catch(() => process.exit(1))
//  =============================================================================================

//  ==============
//  CHOKIDAR WATCH
//  ==============

//  Watch the src folder and synchronize changes
chokidar.watch(SRC_DIR).on('all', (event, srcPath, stat) => {

    const baseName = path.basename(srcPath)
    const destPath = path.join(__dirname, OUT_DIR, srcPath.substring(SRC_DIR.length))

    if (!STATIC_FILES.includes(baseName)) { return }    //  Short-Circuit if the file is not being tracked

    //  Copy files over  to the extension folder
    if (stat.isFile()) {
        fs.copyFile(srcPath, destPath, (err) => { if (err) { console.error(err) } })
    } else {
        for (const x of fs.readdirSync(srcPath)) {
            if (!fs.existsSync(destPath)) { fs.mkdirSync(destPath) }
            fs.copyFile(path.join(srcPath, x), path.join(destPath, x), (err) => { if (err) { console.error(err) } })
        }
    }

    //  Export manifest.js file to manifest.json if it exists
    if (fs.existsSync(path.join(__dirname, SRC_DIR, MANIFEST))) {
        const manifest = require(`./${SRC_DIR}/${MANIFEST}`)
        fs.writeFile(
            path.join(__dirname, OUT_DIR, 'manifest.json'),
            JSON.stringify(manifest, null, 2),
            { encoding: 'utf-8' },
            (err) => { if (err) { console.log(err) } }
        )
    }

})