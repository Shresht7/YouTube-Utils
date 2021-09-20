const esbuild = require('esbuild')  //  ESBUILD

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