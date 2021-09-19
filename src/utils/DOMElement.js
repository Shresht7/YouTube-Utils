    //  ELEMENT CONSTRUCTOR
    //  ===================

    //  Utility Class that Constructs HTML Elements
    export class DOMElement {
        
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