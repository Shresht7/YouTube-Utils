//  Library
import setupLoop from './lib/loop'  //  Setup Loop Toggle Button
import setupSpeed from './lib/speed'    //  Setup Speed Controls
import setupPip from './lib/pip'    //  Setup Picture-in-Picture Mode

//  Utils
import { ytNavEvent, ytLeftControls } from './utils/YTConstants'

//  =======================
//  REGISTER CONTENT SCRIPT
//  =======================

let REGISTERED  //  Boolean to check if content-script has already been registered

if (document.getElementsByTagName('video').length > 0) {                //  If the initially loaded page has video elements (i.e watch page)
    setup()                                                             //  Then register Content-Script
} else {                                                                //  Else if the first page is not /watch, then register a nav listener
    document.addEventListener(ytNavEvent, () => {
        if (REGISTERED || location.pathname !== '/watch') { return }    //  Skip registration if not navigating to /watch or if already registered
        setup()                                                         //  Register Content-Script on navigation to /watch
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

    //  SETUP LOOP TOGGLE
    setupLoop(videoElement, youtubeLeftControls)

    //  SETUP SPEED CONTROL
    setupSpeed(videoElement, youtubeLeftControls)

    //  SETUP PIP
    setupPip(videoElement, youtubeLeftControls)

}