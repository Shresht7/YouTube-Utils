const fs = require('fs')    //  File-System Module
const path = require('path')    //  Path Module
const esbuild = require('esbuild')  //  ESBuild
const chokidar = require('chokidar')    //  Chokidar for file-watch

//  =====================
//  ESBUILD CONFIGURATION
//  =====================

const config = {

    entryPoints: [
        './src/contentScript.js',
        './src/backgroundScript.js',
    ],
    outdir: './extension/',
    bundle: true,
    watch: {
        onRebuild: (error, result) => {
            if (error) { console.error('watch build failed:', error) }
            console.log('watch build succeeded', /* result */)
        },
    }
}

//  =============================================================================================
esbuild.build(config).then(() => console.log('build successful ✅')).catch(() => process.exit(1))
//  =============================================================================================

//  ==============
//  CHOKIDAR WATCH
//  ==============

chokidar.watch('./src').on('all', (event, srcPath, stat) => {

    //  Files to watch
    const trackedFiles = [
        'manifest.json',
        'manifest.js',
        'popup.html',
        'options.html',
        'icons',
    ]

    const baseName = path.basename(srcPath)
    const destPath = path.join(__dirname, 'extension', baseName)

    if (!trackedFiles.includes(baseName)) { return }    //  Short-Circuit if the file is not being tracked

    //  Copy files over  to the extension folder
    if (stat.isFile()) {
        fs.copyFile(srcPath, destPath, (err) => { if (err) { console.error(err) } })
    } else {
        for (x of fs.readdirSync(srcPath)) {
            if (!fs.existsSync(destPath)) { fs.mkdirSync(destPath) }
            fs.copyFile(path.join(srcPath, x), path.join(destPath, x), (err) => { if (err) { console.error(err) } })
        }
    }

    //  Export manifest.js file to manifest.json if it exists
    if (fs.existsSync(path.join(__dirname, 'src', 'manifest.js'))) {
        const manifest = require('./src/manifest')
        fs.writeFile(
            path.join(__dirname, 'extension', 'manifest.json'),
            JSON.stringify(manifest, null, 2),
            { encoding: 'utf-8' },
            (err) => { if (err) { console.log(err) } }
        )
    }

})