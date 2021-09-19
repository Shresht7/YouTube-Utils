import { DOMElement } from "../utils/DOMElement"

//  Returns chevron SVG
const setChevron = () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><title>yt-utils-pip</title>
    <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 13H15C13.8954 13 13 13.8954 13 15V18C13 19.1046 13.8954 20 15 20H20C21.1046 20 22 19.1046 22 18V15C22 13.8954 21.1046 13 20 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    
`

const setupPip = (videoElement, youtubeLeftControls) => {

    if (!document.pictureInPictureEnabled) { return }

    //  PIP Control
    const pipBtn = new DOMElement('div')
        .withID('yt-utils-pipBtn')
        .withHTML(setChevron())
        .withStyles({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'rotateX(180deg)'
        })
        .getElement()

    //  append pipBtn YouTube LeftControl section after the time element (6th ChlidNode - after being shifted by the previous insertion)
    youtubeLeftControls.insertBefore(pipBtn, youtubeLeftControls.childNodes[7])

    //  Left chevron click event listener - Reduces playback rate
    pipBtn.addEventListener('click', () => {
        videoElement.requestPictureInPicture()
        // pipBtn.style.opacity = "0"   //  Reset on exit picture-in-picture
    })
}

//  ===================
export default setupPip
//  ===================