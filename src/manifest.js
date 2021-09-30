//  ==================
//  EXTENSION MANIFEST
//  ==================

module.exports = {
    "name": "YouTube-Utils",
    "description": "A chrome-extension with utility features for YouTube",
    "version": "0.1.0",
    "manifest_version": 3,
    // "action": {
    //     "default_popup": "popup.html",
    //     "default_icon": {
    //         "16": "/icons/yt-utils.png",
    //         "32": "/icons/yt-utils@2x.png",
    //         "48": "/icons/yt-utils@3x.png",
    //         "128": "/icons/yt-utils@8x.png"
    //     }
    // },
    // "options_page": "options.html",
    "background": {
        "service_worker": "backgroundScript.js"
    },
    "content_scripts": [
        {
            "matches": [
                "https://*.youtube.com/*"
            ],
            "js": [
                "contentScript.js"
            ]
        }
    ],
    "icons": {
        "16": "/icons/yt-utils.png",
        "32": "/icons/yt-utils@2x.png",
        "48": "/icons/yt-utils@3x.png",
        "128": "/icons/yt-utils@8x.png"
    },
    "commands": {
        "Ctrl+Q": {
            "suggested_key": {
                "default": "Ctrl+Q",
                "mac": "Command+Q"
            },
            "description": "Reload Extension"
        }
    }
}