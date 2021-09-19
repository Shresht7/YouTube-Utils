//  Utils
import { DOMElement } from "../utils/DOMElement"

//  Loop Button CSS
const loopONColor = '#ff0033'  //  Red color for Loop's ON state
const loopOFFColor = '#ffffff'  //  White color for Loop's OFF state
const loopStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    transition: '0.1s'
}

/**
 * Creates and returns the loop SVG
 * @param {boolean} isON Video Loop Toggle State
 * @returns Loop SVG
 */
const loopSVG = (isON) => {
    const color = isON ? loopONColor : loopOFFColor
    return (`
        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 48 48"><title>yt-utils-loopIcon</title>
            <g class="nc-icon-wrapper" fill="${color}">
                <path d="M24 8V2l-8 8 8 8v-6c6.63 0 12 5.37 12 12 0 2.03-.51 3.93-1.39 5.61l2.92 2.92C39.08 30.05 40 27.14 40 24c0-8.84-7.16-16-16-16zm0 28c-6.63 0-12-5.37-12-12 0-2.03.51-3.93 1.39-5.61l-2.92-2.92C8.92 17.95 8 20.86 8 24c0 8.84 7.16 16 16 16v6l8-8-8-8v6z"/>
            </g>
        </svg>
    `)
}

//  =================
//  SETUP LOOP TOGGLE
//  =================

/**
 * Setup the Loop button in the YouTube video player
 * @param {HTMLVideoElement} videoElement HTML Video Element
 * @param {HTMLElement} youtubeLeftControls YouTube Player Control-Panel (Left-Side)
 */
const setupLoop = (videoElement, youtubeLeftControls) => {

    //  Create button to toggle loop
    const loopToggleBtn = new DOMElement('div')
        .withID('yt-utils-loopControl')
        .withHTML(loopSVG(videoElement.loop))
        .withClasses(['.ytp-button'])
        .withStyles(loopStyles)
        .getElement()


    //  Button click event listener - Toggles video's loop property
    loopToggleBtn.addEventListener('click', () => { videoElement.loop = !videoElement.loop })

    //  Observe video element for loop attribute change and change loop-SVG
    const loopObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type !== 'attributes' || mutation.attributeName !== 'loop') { return }
            loopToggleBtn.innerHTML = loopSVG(videoElement.loop)
        })
    })
    loopObserver.observe(videoElement, { attributes: true })

    //  Position the button in the YouTube LeftControl section before the Volume button (3rd ChildNode)
    youtubeLeftControls.insertBefore(loopToggleBtn, youtubeLeftControls.childNodes[3])
}

//  ====================
export default setupLoop
//  ====================