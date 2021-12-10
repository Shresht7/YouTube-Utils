//  Utils
import { DOMElement } from "../utils/DOMElement"
import { ytpButton } from "../utils/YTConstants"

const PIP_BTN_ID = 'yt-utils-pipBtn'

/**
 * Creates and returns picture-in-picture SVG
 * @param {string} color 
 * @returns PiP SVG
 */
const getPIPSVG = (color) => `
    <svg width="36" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><title>yt-utils-pip</title>
    <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 13H15C13.8954 13 13 13.8954 13 15V18C13 19.1046 13.8954 20 15 20H20C21.1046 20 22 19.1046 22 18V15C22 13.8954 21.1046 13 20 13Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>   
`

//  ========================
//  SETUP PICTURE-IN-PICTURE
//  ========================

/**
 * Current state of Picture-in-Picture
 * @type {Boolean}
 */
let PIPMODE = false

/**
 * Setup the Picture-in-Picture functionality
 * @param {HTMLVideoElement} videoElement HTML Video Element
 * @param {HTMLElement} youtubeRightControls YouTube Player Control Panel (Left-Side)
 */
const setupPip = (videoElement, youtubeRightControls) => {

    if (!document.pictureInPictureEnabled) { return }   //  Do not setup picture-in-picture if it is disabled by the user

    PIPMODE = true  //  Picture-in-Picture mode enabled

    //  PIP Control Button
    const pipBtn = new DOMElement('div')
        .withID(PIP_BTN_ID)
        .withHTML(getPIPSVG('white'))
        .withClasses([ytpButton])
        .withStyles({
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transform: 'translateY(-12px) translateX(-2px) rotateX(180deg)'
        })
        .getElement()

    //  Append the pip button
    youtubeRightControls.insertBefore(pipBtn, youtubeRightControls.childNodes[5])

    //  Toggle picture-in-picture mode on click
    pipBtn.addEventListener('click', () => {
        if (!PIPMODE) {
            videoElement.requestPictureInPicture()
        } else {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture()
            }
        }
        PIPMODE = !PIPMODE
    })

    //  Change PIPMode SVG based on current state
    videoElement.addEventListener('enterpictureinpicture', () => { pipBtn.innerHTML = getPIPSVG('red') })
    videoElement.addEventListener('leavepictureinpicture', () => { pipBtn.innerHTML = getPIPSVG('white') })
}

//  ===================
export default setupPip
//  ===================