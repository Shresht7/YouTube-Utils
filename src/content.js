//  Library
import setupLoop from './lib/loop'  //  Setup Loop Toggle Button
import setupSpeed from './lib/speed'    //  Setup Speed Controls
import setupPip from './lib/pip'    //  Setup Picture-in-Picture Mode

//  Utils
import { ytNavEvent, ytLeftControls, ytRightControls } from './utils/YTConstants'

//  ====================
//  SETUP CONTENT SCRIPT
//  ====================

/**
 * Boolean to check if the content-script has already been registered
 * @type {Boolean}
 */
let REGISTERED
if (document.getElementsByTagName('video').length > 0) {                //  If the initially loaded page has video elements (i.e watch page)
    setup()                                                             //  Then run setup
} else {                                                                //  Else, register a nav listener
    document.addEventListener(ytNavEvent, () => {
        if (REGISTERED || location.pathname !== '/watch') { return }    //  Skip registration if not navigating to /watch or if already registered
        setup()                                                         //  Run setup on navigation to /watch
    })
}

//  ==============
//  CONTENT SCRIPT
//  ==============

/**
 * Initializes the extension and runs the setup functions
 */
function setup() {

    //  REGISTRATION CHECK
    if (REGISTERED || location.pathname !== '/watch') { return }    //  Do nothing if not on /watch or already registered - (redundant check)
    REGISTERED = true   //  Set Content-Script Registered Boolean to true

    //  DOM ELEMENTS
    const videoElement = document.getElementsByTagName('video')[0]  //  YouTube Video Player
    const youtubeLeftControls = document.getElementsByClassName(ytLeftControls)[0] //  YouTube Player Controls (left-side)
    const youtubeRightControls = document.getElementsByClassName(ytRightControls)[0] //  YouTube Player Controls (right-side)

    //  SETUP LOOP TOGGLE
    setupLoop(videoElement, youtubeLeftControls)

    //  SETUP SPEED CONTROL
    setupSpeed(videoElement, youtubeLeftControls)

    //  SETUP PIP
    setupPip(videoElement, youtubeRightControls)

}