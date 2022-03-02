// Post rendering something makes it double render!
// Need to rewrite to make it more efficient. ie, don't add an element for zero source.

function FiddleTabSandbox() {
    let self = this;
    this.elements = {
        "head": document.getElementsByTagName("head")[0],
        "body": document.getElementsByTagName("body")[0]
    };
    this.headContent = {
        "meta": {
            "charset": "utf-8"
        },
        "title": {
            "innerText": "Sandbox"
        },
        "link": {
            "rel": "stylesheet",
            "type": "text/css",
            "href": "/css/initial.css"
        }
    };

    window.console = (function(ogc) {
        window.originalConsole = ogc;
        return {
            log: function(m) {
                window.originalConsole.log(m);
                self.sendMessage("console.log", m);
            },
            info: function(m) {
                window.originalConsole.info(m);
                self.sendMessage("console.info", m);
            },
            warn: function(m) {
                window.originalConsole.warn(m);
                self.sendMessage("console.warn", m);
            },
            error: function(m) {
                window.originalConsole.error(m);
                self.sendMessage("console.error", m);
            }
        };
    }(window.console));
    window.addEventListener("message", self.incomingSource.bind(this));
    window.addEventListener("click", function() {
        self.sendMessage("click", "");
    });

    this.sendMessage("ready", "");
}

FiddleTabSandbox.prototype.sendMessage = function(t, m) {
    m = typeof m === "object" ? JSON.stringify(m) : m;
    window.parent.postMessage({ type: t, message: m }, "*");
};

FiddleTabSandbox.prototype.incomingSource = function(event) {
    let key, data, elem, savedSource;
    if (event.data.type !== "submitSource") return;
    let extCss = event.data.externals && event.data.externals.css || null;
    let extJs = event.data.externals && event.data.externals.js || null;
    let html = event.data.html;
    let css = event.data.css;
    let js = event.data.js;

    try { new Function(js); } catch (err) {
        console.error("[FiddleTabSandbox]: Incoming Javascript contains a Syntax Error!");
        js = "";
    }

    // HEAD - CSS + EXTERNAL CSS
    this.elements.head.innerHTML = "";
    for (key in this.headContent) {
        elem = document.createElement(key);
        for (data in this.headContent[key]) elem[data] = this.headContent[key][data];
        this.elements.head.appendChild(elem);
    }
    if (extCss) {
        for (data in extCss) {
            elem = document.createElement("link");
            elem.rel = "stylesheet";
            elem.type = "text/css";
            elem.href = extCss[data];
            this.elements.head.appendChild(elem);
        }
    }
    if (css) {
        elem = document.createElement("style");
        elem.innerHTML = "\n" + css + "\n";
        this.elements.head.appendChild(elem);
    }

    // BODY - HTML
    if (html) this.elements.body.innerHTML = html;

    // FOOTER - JS + EXTERNAL JS
    if (js) {
        var scriptItem = document.createElement("script");
        scriptItem.innerHTML = js;
    }
    if (extJs) {
        let scriptCount = extJs.length;
        for (data in extJs) {
            elem = document.createElement("script");
            elem.src = extJs[data];
            elem.onload = function() {
                scriptCount--;
                if (scriptCount <= 0 && js) this.elements.body.appendChild(scriptItem);
            };
            this.elements.body.appendChild(elem);
        }
    }
    if (js && (!extJs || extJs.length <= 0)) this.elements.body.appendChild(scriptItem);
    this.sendMessage("success", "Rendering success!");
};

let sandy = new FiddleTabSandbox();