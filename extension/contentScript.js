(() => {
  // src/utils/DOMElement.js
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

  // src/utils/YTConstants.js
  var ytNavEvent = "yt-navigate-start";
  var ytButton = ".ytp-button";
  var ytLeftControls = ".ytp-left-controls";

  // src/lib/loop.js
  var loopID = "yt-utils-loopControl";
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
    const loopToggleBtn = new DOMElement("div").withID(loopID).withHTML(loopSVG(videoElement.loop)).withClasses([ytButton]).withStyles(loopStyles).getElement();
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

  // src/contentScript.js
  var registered;
  if (document.getElementsByTagName("video").length > 0) {
    contentScript();
  } else {
    document.addEventListener(ytNavEvent, () => {
      if (registered || location.pathname !== "/watch") {
        return;
      }
      contentScript();
    });
  }
  function contentScript() {
    if (registered || location.pathname !== "/watch") {
      return;
    }
    registered = true;
    const videoElement = document.getElementsByTagName("video")[0];
    const youtubeLeftControls = document.getElementsByClassName(ytLeftControls)[0];
    loop_default(videoElement, youtubeLeftControls);
    const ADJUST_SPEED = 0.5;
    const MIN_SPEED = 0.5;
    const MAX_SPEED = 4;
    let CURRENT_SPEED = videoElement.playbackRate;
    const speedControl = new DOMElement("div").withID("yt-utils-speedControlArea").withStyles({
      display: "flex"
    }).getElement();
    youtubeLeftControls.insertBefore(speedControl, youtubeLeftControls.childNodes[6]);
    const setChevron = (color) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><title>yt-utils-chevron</title>
            <g class="nc-icon-wrapper" fill=${color || "#ffffff"}>
                <path d="M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z"/>
            </g>
        </svg>
    `;
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
  }
})();
