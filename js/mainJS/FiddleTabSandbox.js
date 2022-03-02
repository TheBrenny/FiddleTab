class FiddleTabSandbox {
    constructor(e, c, iframe, fid) {
        this.console = new FiddleTabJSConsole(c.theme, c.target);
        this.sandbox = iframe;
        this.fiddleID = fid;
        this.paused = {
            sandbox: false,
            js: false,
            output: false
        };
        this.renderID = 0;
        this.shouldRender = true;
        this.currentlyRendering = false;
        this.externals = { css: [], js: [] };
        this.editors = {};

        e.forEach(element => {
            this.editors[element.name] = new FiddleTabEditor(element.name, element.language, element.theme, element.target, this);
            this.editors[element.name].source = window.defaultContent[element.name];
            // element should be
            // {
            //   target: HTMLElement,
            //   name: String,
            //   language: String,
            //   theme: String
            // }
        });

        this.reset();
    }
    postData(data) {
        this.sandbox.contentWindow.postMessage(data, "*");
    }
    log(level, msg) {
        this.console.log(level, msg);
    }

    render() {
        if (this.paused.output || this.currentlyRendering) return false;
        this.currentlyRendering = true;
        let source = this.source;
        this.renderID++;

        for (let s in source) {
            if (!(s in this.editors)) continue;
            source[s] = this.processSource(this.editors[s].language, source[s], this.renderID);
        }

        let message = {
            type: "submitSource",
            late: false,
            rid: this.renderID,
            html: source.html,
            css: source.css,
            js: this.paused.js ? "" : source.js,
            externals: {
                css: this.externals.css,
                js: this.paused.js ? [] : this.externals.js
            }
        };
        this.postData(message);
        this.currentlyRendering = false;
        this.shouldRender = false;
    }
    postRender(type, source, rid) {
        if (this.paused.output) return false;
        let message = {
            type: "submitSource",
            late: true,
            rid: rid
        };
        message[type] = source;
        postData(message);
    }

    saveFiddle(newFiddle) {
        if (!!newFiddle) this.fiddleID++;
        ftStore.set({
            fiddles: {
                [this.fiddleID]: {
                    html: {
                        code: this.source.html,
                        lang: this.languages.html
                    },
                    css: {
                        code: this.source.css,
                        lang: this.languages.css
                    },
                    js: {
                        code: this.source.js,
                        lang: this.languages.js
                    }
                }
            }
        }, () => {
            alert(`Fiddle saved with ID [${this.fiddleID}].`);
        });
    }

    get source() {
        let s = {};
        for (let e in this.editors) {
            s[e] = this.editors[e].source;
        }
        /*
        let extCss = getExternals("css");
        let extJs = getExternals("js");
        s.externals = {
            "css": extCss,
            "js": extJs
        };
        */
        return s;
    }
    get languages() {
        let l = {};
        for (let e in this.editors) {
            l[e] = this.editors[e].language;
        }
        return l;
    }
    processSource(lang, code, rid) {
        switch (lang) {
            case "haml":
                code = Haml.render(code);
                break;
            case "less":
                less.render(code, function(e, o) {
                    if (e) {
                        console.warn("Oh oh. `less.render` threw an error!");
                        console.warn(e);
                    }
                    this.postRender("css", o.css, rid);
                });
                break;
            case "sass":
                Sass.compile(code, function(result) {
                    this.postRender("css", result.text, rid);
                });
                break;
            case "scss":
                Sass.compile(code, function(result) {
                    this.postRender("css", result.text, rid);
                });
                break;
            case "coffee":
                new Promise((res, rej) => {
                    resolve(CoffeeScript.compile(code, { bare: true }));
                }).then((val) => {
                    this.postRender("js", val, rid);
                });
                break;
            default:
                break;
        }
        return code;
    }

    editorChanged(e) {
        this.shouldRender = true;
    }

    reset() {
        let defaultSandbox = {
            "id": "sandbox",
            "sandbox": "allow-forms allow-modals allow-popups allow-pointer-lock allow-same-origin allow-scripts",
            "src": "/html/sandbox.html"
        };
        let current = this.sandbox;
        let newI = document.createElement("iframe");
        for (let k in defaultSandbox) newI[k] = defaultSandbox[k];
        newI.setAttribute("style", current.getAttribute("style"));
        current.parentNode.replaceChild(newI, current);
        this.sandbox = newI;
        this.shouldRender = true;
    }
    openFiddle(site) {
        let url, data;
        let desc = "Ported from a Tabbed Fiddle. #FiddleTab";
        let src = prepareSource({}, {});
        switch (site) {
            case "jsbin":
                url = "http://jsbin.com/api/save";
                data = {
                    summary: desc,
                    html: src.html,
                    css: src.css,
                    js: src.js,
                };
                break;
            case "codep":
                url = "http://codepen.io/pen/define";
                let tmp = {
                    title: "",
                    description: desc,
                    editors: "111",
                    html: src.html,
                    html_pre_processor: "none",
                    html_classes: "",
                    css: src.css,
                    css_pre_processor: "none",
                    css_starter: "neither",
                    css_prefix_free: false,
                    js: src.js,
                    js_pre_processor: "none",
                    js_modernizr: false,
                    js_library: "",
                    css_external: getExternals("css").join(";"),
                    js_external: getExternals("js").join(";")
                };
                data = {
                    data: JSON.stringify(tmp).replace(/"/g, "&quot;").replace(/'/g, "&apos;")
                };
                break;
            default:
            case "jsfiddle":
                url = "http://jsfiddle.net/api/post/library/pure/";
                data = {
                    panel_html: 0,
                    panel_css: 0,
                    panel_js: 0,
                    description: desc,
                    wrap: "d",
                    html: src.html,
                    css: src.css,
                    js: src.js,
                    resources: getExternals("js").join(",") + "," + getExternals("css").join(",")
                };
                break;
        }
        submitPost(url, data);
    }
}