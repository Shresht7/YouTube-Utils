//  Library
import setupLoop from './lib/loop'

//  Utils
import { DOMElement } from './utils/DOMElement'
import { ytNavEvent, ytLeftControls } from './utils/YTConstants'

//  =======================
//  REGISTER CONTENT SCRIPT
//  =======================

let registered  //  Boolean to check if content-script has already been registered

if (document.getElementsByTagName('video').length > 0) {                //  If the initially loaded page has video elements (i.e watch page)
    contentScript()                                                         //  Then register Content-Script
} else {                                                                //  Else if the first page is not /watch, then register a nav listener
    document.addEventListener(ytNavEvent, () => {
        if (registered || location.pathname !== '/watch') { return }    //  Skip registration if not navigating to /watch or if already registered
        contentScript()                                                 //  Register Content-Script on navigation to /watch
    })
}

//  ==============
//  CONTENT SCRIPT
//  ==============

//  The entire content-script
function contentScript() {
    if (registered || location.pathname !== '/watch') { return }    //  Do nothing if not on /watch or already registered - (redundant check)
    registered = true   //  Set Content-Script Registered Boolean to true

    //  DOM ELEMENTS
    //  ============

    const videoElement = document.getElementsByTagName('video')[0]  //  YouTube Video Player
    const youtubeLeftControls = document.getElementsByClassName(ytLeftControls)[0] //  YouTube Player Controls (left-side)

    //  SETUP LOOP TOGGLE
    //  =================

    setupLoop(videoElement, youtubeLeftControls)

    //  SETUP SPEED CONTROL
    //  ===================

    //  Control parameters
    const ADJUST_SPEED = 0.5
    const MIN_SPEED = 0.5
    const MAX_SPEED = 4.0
    let CURRENT_SPEED = videoElement.playbackRate

    //  Speed Control Container Div
    const speedControl = new DOMElement('div')
        .withID('yt-utils-speedControlArea')
        .withStyles({
            display: 'flex',
        })
        .getElement()

    //  append speedControl area to YouTube LeftControl section after the time element (6th ChlidNode - after being shifted by the previous insertion)
    youtubeLeftControls.insertBefore(speedControl, youtubeLeftControls.childNodes[6])

    //  Returns chevron SVG
    const setChevron = (color) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><title>yt-utils-chevron</title>
            <g class="nc-icon-wrapper" fill=${color || '#ffffff'}>
                <path d="M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z"/>
            </g>
        </svg>
    `


    //      SPEED LEFT CHEVRON
    //      ------------------

    const speedLeftChevron = new DOMElement('div')
        .withID('yt-utils-speedLeftChevron')
        .withHTML(setChevron())
        .withStyles({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            transform: 'rotate(180deg)'
        })
        .getElement()

    //  Left chevron click event listener - Reduces playback rate
    speedLeftChevron.addEventListener('click', () => { if (videoElement.playbackRate > MIN_SPEED) { videoElement.playbackRate -= ADJUST_SPEED } })

    speedControl.appendChild(speedLeftChevron)

    //      SPEED DISPLAY
    //      -------------

    //  Displays the current playback rate
    const speedDisplay = new DOMElement('p')
        .withID('yt-utils-speedDisplay')
        .withText(videoElement.playbackRate.toFixed(1) + 'x')
        .getElement()

    speedControl.appendChild(speedDisplay)


    //      SPEED RIGHT CHEVRON
    //      -------------------

    const speedRightChevron = new DOMElement('div')
        .withID('yt-utils-speedRightChevron')
        .withHTML(setChevron())
        .withStyles({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0
        })
        .getElement()

    //  Right chevron click event listener - Increases playback rate
    speedRightChevron.addEventListener('click', () => { if (videoElement.playbackRate < MAX_SPEED) { videoElement.playbackRate += ADJUST_SPEED } })

    speedControl.appendChild(speedRightChevron)

    //  SPEED CONTROL OBSERVER
    //  ----------------------

    //  If the video duration changes (i.e. Ads), reset playback speed to the set current speed
    videoElement.addEventListener('durationchange', (e) => {
        e.target.playbackRate = CURRENT_SPEED
    })

    //  SPEED CONTROL HOVER INTERACTION
    //  -------------------------------

    let timeout
    speedControl.addEventListener('mouseover', () => {
        if (timeout) { clearTimeout(timeout) }
        speedLeftChevron.style.opacity = 1
        speedRightChevron.style.opacity = 1
    })

    speedControl.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            speedLeftChevron.style.opacity = 0
            speedRightChevron.style.opacity = 0
        }, 3000)
    })

    // Video Element Responder
    videoElement.addEventListener('ratechange', (e) => {
        CURRENT_SPEED = e.target.playbackRate
        speedDisplay.innerText = e.target.playbackRate.toFixed(1) + 'x'
    })
}