//  ============
//  DOM ELEMENTS
//  ============

const videoElement = document.getElementsByTagName('video')[0]  //  YouTube Video Player
const youtubeLeftControls = document.getElementsByClassName('ytp-left-controls')[0] //  YouTube Player Controls (left-side)

//  ===================
//  ELEMENT CONSTRUCTOR
//  ===================

//  Constructs HTML Elements
class Element {
    constructor(tagName) {
        this.element = document.createElement(tagName)
    }

    withID(id) {
        this.element.id = id
        return this
    }

    withHTML(html) {
        this.element.innerHTML = html
        return this
    }

    withText(text) {
        this.element.innerText = text
        return this
    }

    withClasses(classes) {
        this.element.classList.add(...classes)
        return this
    }

    withAttributes(attrs) {
        for (const attribute in attrs) {
            this.element[attribute] = attrs[attribute]
        }
        return this
    }

    getElement() {
        return this.element
    }
}

//  ===================
//  LOOP CONTROL TOGGLE
//  ===================

//  Button to toggle loop
const loopToggleBtn = new Element('button')
    .withID('yt-utils-loopControl')
    .withText(videoElement.loop ? 'DLoop' : 'ELoop')
    .getElement()

//  Button click event listener
loopToggleBtn.addEventListener('click', () => {
    console.log('LoopClicked')
    videoElement.loop = !videoElement.loop
    loopToggleBtn.innerText = videoElement.loop ? 'DLoop' : 'ELoop'
})

//  Position the button in the YouTube LeftControl section before the Volume button (3rd ChildNode)
youtubeLeftControls.insertBefore(loopToggleBtn, youtubeLeftControls.childNodes[3])

//  =============
//  SPEED CONTROL
//  =============

//  Range Slider to control speed
const speedRange = new Element('input')
    .withID('yt-utils-speedControl')
    .withAttributes({
        type: 'range',
        min: 0,
        max: 4,
        step: 0.5,
        value: videoElement.playbackRate || 1.0
    })
    .getElement()

//  Slider change event listener
speedRange.addEventListener('change', (e) => {
    console.log('SpeedRange Changed to ' + e.target.value)
    videoElement.playbackRate = e.target.value || 1
})

//  Append slider to YouTube LeftControl section
youtubeLeftControls.append(speedRange)