// Might need to generate a "Render ID", so when a postRender sends data through, it's not styling when it shouldn't.

progress("Creating methods");

let addExternal = function(opts) {
    let type = opts.type;
    let link = opts.link;
    if (type == "js" || type == "css") {
        let domlist = $("#external" + type + "list")[0];
        let elements = {
            "li": {},
            "a": {
                "href": "#",
                "class": "closebtn",
                "onclick": removeExternal
            },
            "img": {
                "src": "/img/cross.png",
            },
            "span": {
                "class": "list-draggable",
                "value": link,
                "draggable": "true",
                "eventlisteners": {
                    "dragstart": function(e) {
                        let t = $(e.target);
                        t.classList.add("dragElem");
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text", t.innerText);
                        e.dataTransfer.setData("value", t.value);
                    },
                    "dragenter": function(e) { // THIS MAY CHANGE TO THE LI - DEPENDS ON THE VISUALS
                        $(e.target).classList.add("hovover");
                    },
                    "dragover": function(e) {
                        e.preventDefault && e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        return false;
                    },
                    "dragleave": function(e) {
                        $(e.target).classList.remove("hovover");
                    },
                    "dragend": function(e) {
                        $(".hovover").classList.remove("hovover");
                    },
                    "drop": function(e) {
                        e.stopPropagation && e.stopPropagation();
                        if (!$(".dragElem").is($(e.target))) {
                            $(".dragElem").eq(0).text($(this).text());
                            $(".dragElem").eq(0).prop("value", $(this).prop("value"));
                            $(this).eq(0).text(e.dataTransfer.getData("text"));
                            $(this).eq(0).prop("value", e.dataTransfer.getData("value"));
                            $(".dragElem").classList.remove("dragElem");
                        }
                        return false;
                    },
                    "dblclick": function(e) {
                        $(e.target).prop("contentEditable", true);
                        $(e.target).focus();
                    },
                    "keydown": function(e) {
                        if (e.keyCode == 13) $(e.target).prop("contentEditable", false);
                    }
                },
                "innerText": link.substring(link.lastIndexOf("/") + 1)
            }
        };
        let elem, data, l;
        for (k in elements) {
            elem = document.createElement(k);
            for (data in elements[k]) {
                if (data == "eventlisteners") continue;
                elem[data] = elements[k][data];
            }
            if (elements[k]["eventlisteners"]) {
                for (l in elements[k]["eventlisteners"]) elem.addEventListener(l, elements[k]["eventlisteners"][l]);
                ///for(l in elements[k]["eventlisteners"]) $(elem).on(l, elements[k]["eventlisteners"][l]);
            }
            elements[k]["element"] = elem;
        }
        elements.a.element.appendChild(elements.img.element);
        elements.li.element.appendChild(elements.a.element);
        elements.li.element.appendChild(elements.span.element);
        domlist.appendChild(elements.li.element);
        /*
        Tipped.create(elements.li.element, function(e) {
          return $(e).children("span").prop("value");
        }, {
          position: "leftmiddle",
          behavior: "hide",
          cache: false
        });
        */
        $(elements.li.element).tooltip({
            content: "You won't get libraries or stylesheets if you export to JSBin!<br>(<i>Don't worry, it's on the TODO list!</i>)"
        });
        $("#ext" + type).first().val("");
    } else {
        console.warn("Tried to load an unknown type [" + type + "] from link [" + link + "]");
    }
};
let getExternals = function(type) {
    let data, retVals = [];
    if (type == "js" || type == "css") {
        let allSpans = $("#external" + type + "list li span");
        //for(data = 0; data < allSpans.length; data++) retVals.push(allSpans[data].value);
        $("#external" + type + "list li span").forEach(function(element, index) {
            retVals.push(element.value);
        });
    } else {
        console.warn("Tried to grab unknown externals of type [" + type + "]");
    }
    return retVals;
};
let removeExternal = function(event) {
    $(event.target).parents("li").remove();
    event.stopPropagation();
};
let logData = function(type, message) {
    message = String(message);
    console[type](message);
};
let openFiddle = function(site) {
    let url, data;
    let src = prepareSource({}, {});
    switch (site) {
        case "jsbin":
            url = "http://jsbin.com/api/save";
            data = {
                summary: "Ported from a Tabbed Fiddle. #FiddleTab",
                html: src.html,
                css: src.css,
                js: src.js,
            };
            break;
        case "codep":
            url = "http://codepen.io/pen/define";
            let tmp = {
                title: "",
                description: "Ported from a Tabbed Fiddle. #FiddleTab",
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
                description: "Ported from a Tabbed Fiddle. #FiddleTab",
                wrap: "d",
                html: src.html,
                css: src.css,
                js: src.js,
                resources: getExternals("js").join(",") + "," + getExternals("css").join(",")
            };
            break;
    }
    submitPost(url, data);
};
let ftError = function(msg, type, showToUser) {
    if (["boolean", "undefined"].includes(typeof(type))) showToUser = type;
    if (["undefined"].includes(typeof(showToUser))) showToUser = false;
    type = ["log", "warn", "error", "info"].includes(type) ? type : "error";
    if (showToUser) logData(type, msg);
    else console[type](msg);
};
// Don't like the Async of this, so we need to define the callback... It's good, I guess...
// Maybe we can do an infinite loop?
let getNextFID = function(callback) {
    ftStore.get({
        fiddles: {}
    }, (items) => {
        callback && callback(Math.max(...Object.keys(items).map(i => parseInt(i))));
    });
};
let setNextFID = function(fid, callback) {
    ftStore.set({
        lastFiddleID: fid
    }, () => { callback && callback(); }); // Determine whether we need to callback.
};

// hook into event_listeners.js
progress("Adding event listeners");
loadEventListeners();

progress("Creating click handlers");
let addExternally = function(e) {
    let type = $(e.target).attr("id").substring(3);
    let link = $("#ext" + type).first().val();
    $("#add" + type).prop("disabled", true).val("Hang a sec...");
    checkValidUrl(link, {
        func: addExternal,
        args: {
            "type": type,
            "link": link
        }
    }, {
        func: function(m) { alert(m); },
        args: "Oh oh... Couldn't reach the requested source [" + link + "], for type [" + type + "]..."
    });
};

progress("Adding drag handler");
loadDragHandler();


// NEW FIDDLETAB
progress("Making FiddleTab Objects");
let editors = [{
        name: "html",
        language: "html",
        theme: "chrome",
        target: $0("#htmleditor")
    },
    {
        name: "css",
        language: "css",
        theme: "chrome",
        target: $0("#csseditor")
    },
    {
        name: "js",
        language: "javascript",
        theme: "chrome",
        target: $0("#jseditor")
    }
];
let jsconsole = {
    theme: "chrome",
    target: $0("#jsconsole")
};

window.fiddleTabSandbox = new FiddleTabSandbox(editors, jsconsole, $0("#sandbox"), 0);

progress("Creating render interval");
window.renderInterval = setInterval(function() {
    if (window.fiddleTabSandbox.shouldRender) window.fiddleTabSandbox.render();
}, 300);

progress("Done!", true);