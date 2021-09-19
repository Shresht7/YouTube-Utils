//  =======================
//  DOM ELEMENT CONSTRUCTOR
//  =======================

/**
 * Utility class that constructs HTML DOM Elements
 */
export class DOMElement {

    /**
     * DOM Element Constructor
     * @param {string} tagName HTML Tag
     */
    constructor(tagName) {
        this.element = document.createElement(tagName)
    }

    /**
     * Sets the element's ID attribute
     * @param {string} id HTML Element's ID attribute
     * @returns DOMElement
     */
    withID(id) {
        this.element.id = id
        return this
    }

    /**
     * Sets the DOM element's innerHTML
     * @param {string} html InnerHTML of the DOM Element
     * @returns DOM Element
     */
    withHTML(html) {
        this.element.innerHTML = html
        return this
    }

    /**
     * Sets the DOM element's innerText
     * @param {string} text InnerText of the DOM Element
     * @returns DOMElement
     */
    withText(text) {
        this.element.innerText = text
        return this
    }

    /**
     * Sets the class attributes of the HTML element
     * @param {string[]} classes Array of classes for the HTML element
     * @returns DOM Element
     */
    withClasses(classes) {
        this.element.classList.add(...classes)
        return this
    }

    /**
     * Sets the HTML elements style attribute
     * @param {{}} styles CSS Styles attribute for the HTML element 
     * @returns DOM Element
     */
    withStyles(styles) {
        for (const property in styles) {
            this.element.style[property] = styles[property]
        }
        return this
    }

    /**
     * Sets the HTML element's miscellaneous attributes
     * @param {{}} attrs HTML attributes
     * @returns DOM Element
     */
    withAttributes(attrs) {
        for (const attribute in attrs) {
            this.element[attribute] = attrs[attribute]
        }
        return this
    }

    /**
     * Get the constructed DOM Element
     * @returns DOM Element
     */
    getElement() {
        return this.element
    }
}