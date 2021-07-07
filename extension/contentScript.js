let registered  //  Boolean to check if content-script has already been registered
const youTubeNavEvent = 'yt-navigate-start' //  YouTube SPA navigation DOM event

//  =======================
//  REGISTER CONTENT SCRIPT
//  =======================

if (document.getElementsByTagName('video').length > 0) {                //  If the first page has video elements (i.e watch page)
    contentScript()                                                     //  Register contentScript
} else {                                                                //  Else if the first page is not /watch then register a nav listener
    document.addEventListener(youTubeNavEvent, () => {
        if (registered || location.pathname !== '/watch') { return }    //  Skip registration if not /watch or already registered
        contentScript()                                                 //  Register contentScript on navigation to /watch
    })
}

//  ==============
//  CONTENT SCRIPT
//  ==============

//  The entire content-script
function contentScript() {
    if (registered || location.pathname !== '/watch') { return }    //  Do nothing if not on /watch or already registered

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

    //  Returns loop's innerHTML
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
            margin: '0 0.5rem'
        })
        .getElement()

    //  Append speedControl area to YouTube LeftControl section before the time element (5th ChlidNode - after being shifted by the previous insertion)
    youtubeLeftControls.insertBefore(speedControl, youtubeLeftControls.childNodes[6])


    //      SPEED LEFT CHEVRON
    //      ------------------

    const speedLeftChevron = new DOMElement('div')
        .withID('yt-utils-speedLeftChevron')
        .withText('-')
        .withStyles({ opacity: 0 })
        .getElement()

    speedLeftChevron.addEventListener('click', () => { if (videoElement.playbackRate > 0.5) { videoElement.playbackRate -= 0.5 } })

    speedControl.append(speedLeftChevron)

    //      SPEED DISPLAY
    //      -------------

    //  Displays the current playback rate
    const speedDisplay = new DOMElement('p')
        .withID('yt-utils-speedDisplay')
        .withText(videoElement.playbackRate.toString() + 'x')
        .withStyles({ margin: '0 0.25rem' })
        .getElement()

    speedControl.append(speedDisplay)


    //      SPEED RIGHT CHEVRON
    //      -------------------

    const speedRightChevron = new DOMElement('div')
        .withID('yt-utils-speedRightChevron')
        .withText('+')
        .withStyles({ opacity: 0 })
        .getElement()

    speedRightChevron.addEventListener('click', () => { if (videoElement.playbackRate < 4.0) { videoElement.playbackRate += 0.5 } })

    speedControl.append(speedRightChevron)

    //  ===============================
    //  SPEED CONTROL HOVER INTERACTION
    //  ===============================

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
        speedDisplay.innerText = e.target.playbackRate.toFixed(1) + 'x'
    })
}