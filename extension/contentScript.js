(() => {
  // src/contentScript/utils/DOMElement.js
  var DOMElement = class {
    constructor(tagName) {
      this.element = document.createElement(tagName);
    }
    withID(id) {
      this.element.id = id;
      return this;
    }
    withHTML(html) {
      this.element.innerHTML = html;
      return this;
    }
    withText(text) {
      this.element.innerText = text;
      return this;
    }
    withClasses(classes) {
      this.element.classList.add(...classes);
      return this;
    }
    withStyles(styles) {
      for (const property in styles) {
        this.element.style[property] = styles[property];
      }
      return this;
    }
    withAttributes(attrs) {
      for (const attribute in attrs) {
        this.element[attribute] = attrs[attribute];
      }
      return this;
    }
    getElement() {
      return this.element;
    }
  };

  // src/contentScript/lib/loop.js
  var loopONColor = "#ff0033";
  var loopOFFColor = "#ffffff";
  var loopStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    transition: "0.1s"
  };
  var loopSVG = (isON) => {
    const color = isON ? loopONColor : loopOFFColor;
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 48 48"><title>yt-utils-loopIcon</title>
            <g class="nc-icon-wrapper" fill="${color}">
                <path d="M24 8V2l-8 8 8 8v-6c6.63 0 12 5.37 12 12 0 2.03-.51 3.93-1.39 5.61l2.92 2.92C39.08 30.05 40 27.14 40 24c0-8.84-7.16-16-16-16zm0 28c-6.63 0-12-5.37-12-12 0-2.03.51-3.93 1.39-5.61l-2.92-2.92C8.92 17.95 8 20.86 8 24c0 8.84 7.16 16 16 16v6l8-8-8-8v6z"/>
            </g>
        </svg>
    `;
  };
  var setupLoop = (videoElement, youtubeLeftControls) => {
    const loopToggleBtn = new DOMElement("div").withID("yt-utils-loopControl").withHTML(loopSVG(videoElement.loop)).withClasses([".ytp-button"]).withStyles(loopStyles).getElement();
    loopToggleBtn.addEventListener("click", () => {
      videoElement.loop = !videoElement.loop;
    });
    const loopObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "attributes" || mutation.attributeName !== "loop") {
          return;
        }
        loopToggleBtn.innerHTML = loopSVG(videoElement.loop);
      });
    });
    loopObserver.observe(videoElement, { attributes: true });
    youtubeLeftControls.insertBefore(loopToggleBtn, youtubeLeftControls.childNodes[3]);
  };
  var loop_default = setupLoop;

  // src/contentScript/lib/speed.js
  var ADJUST_SPEED = 0.5;
  var MIN_SPEED = 0.5;
  var MAX_SPEED = 4;
  var setChevron = (color) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><title>yt-utils-chevron</title>
        <g class="nc-icon-wrapper" fill=${color || "#ffffff"}>
            <path d="M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z"/>
        </g>
    </svg>
`;
  var setupSpeed = (videoElement, youtubeLeftControls) => {
    let CURRENT_SPEED = videoElement.playbackRate;
    const speedControl = new DOMElement("div").withID("yt-utils-speedControlArea").withStyles({
      display: "flex"
    }).getElement();
    youtubeLeftControls.insertBefore(speedControl, youtubeLeftControls.childNodes[6]);
    const speedLeftChevron = new DOMElement("div").withID("yt-utils-speedLeftChevron").withHTML(setChevron()).withStyles({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      transform: "rotate(180deg)"
    }).getElement();
    speedLeftChevron.addEventListener("click", () => {
      if (videoElement.playbackRate > MIN_SPEED) {
        videoElement.playbackRate -= ADJUST_SPEED;
      }
    });
    speedControl.appendChild(speedLeftChevron);
    const speedDisplay = new DOMElement("p").withID("yt-utils-speedDisplay").withText(videoElement.playbackRate.toFixed(1) + "x").getElement();
    speedControl.appendChild(speedDisplay);
    const speedRightChevron = new DOMElement("div").withID("yt-utils-speedRightChevron").withHTML(setChevron()).withStyles({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0
    }).getElement();
    speedRightChevron.addEventListener("click", () => {
      if (videoElement.playbackRate < MAX_SPEED) {
        videoElement.playbackRate += ADJUST_SPEED;
      }
    });
    speedControl.appendChild(speedRightChevron);
    videoElement.addEventListener("durationchange", (e) => {
      e.target.playbackRate = CURRENT_SPEED;
    });
    let timeout;
    speedControl.addEventListener("mouseover", () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      speedLeftChevron.style.opacity = 1;
      speedRightChevron.style.opacity = 1;
    });
    speedControl.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => {
        speedLeftChevron.style.opacity = 0;
        speedRightChevron.style.opacity = 0;
      }, 3e3);
    });
    videoElement.addEventListener("ratechange", (e) => {
      CURRENT_SPEED = e.target.playbackRate;
      speedDisplay.innerText = e.target.playbackRate.toFixed(1) + "x";
    });
  };
  var speed_default = setupSpeed;

  // src/contentScript/lib/pip.js
  var setPip = () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><title>yt-utils-pip</title>
    <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 13H15C13.8954 13 13 13.8954 13 15V18C13 19.1046 13.8954 20 15 20H20C21.1046 20 22 19.1046 22 18V15C22 13.8954 21.1046 13 20 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    
`;
  var setupPip = (videoElement, youtubeLeftControls) => {
    if (!document.pictureInPictureEnabled) {
      return;
    }
    const pipBtn = new DOMElement("div").withID("yt-utils-pipBtn").withHTML(setPip()).withStyles({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.9,
      transform: "rotateX(180deg)"
    }).getElement();
    youtubeLeftControls.appendChild(pipBtn);
    pipBtn.addEventListener("click", () => {
      videoElement.requestPictureInPicture();
    });
    videoElement.addEventListener("enterpictureinpicture", () => {
      pipBtn.style.opacity = 0;
    });
    videoElement.addEventListener("leavepictureinpicture", () => {
      pipBtn.style.opacity = 0.9;
    });
  };
  var pip_default = setupPip;

  // src/contentScript/utils/YTConstants.js
  var ytNavEvent = "yt-navigate-start";
  var ytLeftControls = "ytp-left-controls";

  // src/contentScript/contentScript.js
  var REGISTERED;
  if (document.getElementsByTagName("video").length > 0) {
    setup();
  } else {
    document.addEventListener(ytNavEvent, () => {
      if (REGISTERED || location.pathname !== "/watch") {
        return;
      }
      setup();
    });
  }
  function setup() {
    if (REGISTERED || location.pathname !== "/watch") {
      return;
    }
    REGISTERED = true;
    const videoElement = document.getElementsByTagName("video")[0];
    const youtubeLeftControls = document.getElementsByClassName(ytLeftControls)[0];
    loop_default(videoElement, youtubeLeftControls);
    speed_default(videoElement, youtubeLeftControls);
    pip_default(videoElement, youtubeLeftControls);
  }
})();
