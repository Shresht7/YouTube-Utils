let registered  //  Boolean to check if content-script has already been registered
const youTubeNavEvent = 'yt-navigate-start'

//  =======================
//  REGISTER CONTENT SCRIPT
//  =======================

document.addEventListener('yt-navigate-start', () => {
    if (location.pathname !== '/watch' || registered) { return }    //  Skip registration if not /watch or already registered
    contentScript()
})

//  ==============
//  CONTENT SCRIPT
//  ==============

const contentScript = () => {

    registered = true   //  Content-Script registered

    //  DOM ELEMENTS
    //  ============

    const videoElement = document.getElementsByTagName('video')[0]  //  YouTube Video Player
    const youtubeLeftControls = document.getElementsByClassName('ytp-left-controls')[0] //  YouTube Player Controls (left-side)

    //  ELEMENT CONSTRUCTOR
    //  ===================

    //  Constructs HTML Elements
    class DOMElement {
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

        withStyles(styles) {
            for (const property in styles) {
                this.element.style[property] = styles[property]
            }
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

    //  LOOP CONTROL TOGGLE
    //  ===================

    //  Returns loop SVG with given color
    const loopSvg = (color) => (
        `
    <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 48 48"><title>yt-utils-loopIcon</title>
        <g class="nc-icon-wrapper" fill="${color || '#ffffff'}">
            <path d="M24 8V2l-8 8 8 8v-6c6.63 0 12 5.37 12 12 0 2.03-.51 3.93-1.39 5.61l2.92 2.92C39.08 30.05 40 27.14 40 24c0-8.84-7.16-16-16-16zm0 28c-6.63 0-12-5.37-12-12 0-2.03.51-3.93 1.39-5.61l-2.92-2.92C8.92 17.95 8 20.86 8 24c0 8.84 7.16 16 16 16v6l8-8-8-8v6z"/>
        </g>
    </svg>
    `
    )

    //  Returns loops innerHTML
    const setLoopHTML = () => videoElement.loop ? loopSvg('#ff0033') : loopSvg()

    //  Button to toggle loop
    const loopToggleBtn = new DOMElement('div')
        .withID('yt-utils-loopControl')
        .withHTML(setLoopHTML())
        .withClasses(['.ytp-button'])
        .withStyles({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.9,
            transition: '0.1s'
        })
        .getElement()

    //  Button click event listener
    loopToggleBtn.addEventListener('click', () => { videoElement.loop = !videoElement.loop })

    //  Observe video element for loop attribute change and change loop-SVG
    const loopObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type !== 'attributes' || mutation.attributeName !== 'loop') { return }
            loopToggleBtn.innerHTML = setLoopHTML()
        })
    })
    loopObserver.observe(videoElement, { attributes: true })

    //  Position the button in the YouTube LeftControl section before the Volume button (3rd ChildNode)
    youtubeLeftControls.insertBefore(loopToggleBtn, youtubeLeftControls.childNodes[3])

    //  SPEED CONTROL
    //  =============

    //  Speed Control Container Div
    const speedControl = new DOMElement('div')
        .withID('yt-utils-speedControlArea')
        .withStyles({
            display: 'flex',
            marginLeft: '1rem'
        })
        .getElement()

    //  Append speedControl area to YouTube LeftControl section
    youtubeLeftControls.append(speedControl)

    //      SPEED DISPLAY
    //      -------------

    //  Displays the current playback rate
    const speedDisplay = new DOMElement('p')
        .withID('yt-utils-speedDisplay')
        .withText(videoElement.playbackRate.toString() + 'x')
        .withStyles({
            width: '3ch',
            marginRight: '0.5rem'
        })
        .getElement()

    speedControl.append(speedDisplay)

    //      SPEED RANGE
    //      -----------

    //  Range Slider to control speed
    const speedRange = new DOMElement('input')
        .withID('yt-utils-speedControl')
        .withAttributes({
            type: 'range',
            min: 0,
            max: 4,
            step: 0.5,
            value: videoElement.playbackRate || 1.0
        })
        .withStyles({
            display: 'none',
            transition: '0.25s ease-in'
        })
        .getElement()

    //  Slider change event listener
    speedRange.addEventListener('change', (e) => { videoElement.playbackRate = e.target.value || 1 })

    //  Video Element responder
    videoElement.addEventListener('ratechange', (e) => {
        speedDisplay.innerText = e.target.playbackRate.toString() + 'x'
        speedRange.value = e.target.playbackRate
    })

    //  Hover effects
    speedControl.addEventListener('mouseover', () => { speedRange.style.display = 'block' })
    speedControl.addEventListener('mouseleave', () => { speedRange.style.display = 'none' })

    //  Append speedRange to speedControl area
    speedControl.append(speedRange)
}