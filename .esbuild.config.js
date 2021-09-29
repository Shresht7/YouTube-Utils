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

    const trackedFiles = [
        'manifest.json',
        'popup.html',
        'options.html',
        'icons',
    ]

    const baseName = path.basename(srcPath)
    const destPath = path.join(__dirname, 'extension', baseName)

    if (!trackedFiles.includes(baseName)) { return }

    if (stat.isFile()) {
        fs.copyFile(srcPath, destPath, (err) => { if (err) { console.error(err) } })
    } else {
        for (x of fs.readdirSync(srcPath)) {
            if (!fs.existsSync(destPath)) { fs.mkdirSync(destPath) }
            fs.copyFile(path.join(srcPath, x), path.join(destPath, x), (err) => { if (err) { console.error(err) } })
        }
    }


})