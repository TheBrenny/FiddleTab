function loadEventListeners() {
    let keyCommands = [];
    let bindCommand = (name, combination, callback) => {
        let command = {
            name: name,
            trigger: combination,
            fn: (e) => {
                e.stopPropagation && e.stopPropagation();
                e.preventDefault();
                callback(e);
            }
        };
        keyCommands.push(command);
    };

    window.addEventListener("message", (e) => {
        //TODO FIX THIS!
        let type = e.data.type;
        let mesg = e.data.message;
        if (type.startsWith("console")) {
            window.fiddleTabSandbox.log(type.substring(type.indexOf(".") + 1), mesg);
        }
        /* else if (type === "ready") {
                    if (renderCount == -1) {
                        initialFilling();
                        ftStore.get({
                            fiddles: {}
                        }, function(items) {
                            console.log(items);
                            let fiddle = {};
                            let obj = {};
                            for (let fid in items.fiddles) {
                                fiddle = items.fiddles[fid];
                                obj = {
                                    type: "fiddle",
                                    fiddleid: fid,
                                    htmllang: fiddle.html.lang,
                                    csslang: fiddle.css.lang,
                                    jslang: fiddle.js.lang
                                };
                                console.log(obj);
                                postData(obj);
                            }
                        });
                    }
                } else if (type === "click") {
                    configDropdowns(null, true);
                } else if (type === "openFiddle") {
                    let fid = mesg;
                    console.log(`Opening a fiddle: [${fid}]!`);
                    ftStore.get({
                        fiddles: {
                            [fid]: {}
                        }
                    }, function(items) {
                        if (items.fiddles[fid]) {
                            createCodeContext(items.fiddles[fid]);
                        }
                    });
                }*/
    });
    window.addEventListener("keydown", (e) => {
        let cmd = "";
        if ((window.navigator.platform.toUpperCase().indexOf("MAC") >= 0 && e.metaKey) || e.ctrlKey) cmd += "ctrl+";
        if (e.altKey) cmd += "alt+";
        if (e.shiftKey) cmd += "shift+";
        if (e.key.length == 1) cmd += e.key.toLowerCase();

        keyCommands.forEach((el) => {
            if (el.trigger === cmd) {
                console.info(`Key Command triggered: ${el.name}`);
                el.fn(e);
            }
        });
    });
    window.addEventListener("click", (e) => {
        // todo: when 
    });

    bindCommand("saveFiddle", "ctrl+s", function(e) {
        window.fiddleTabSandbox.saveFiddle(false);
    });
    bindCommand("saveNewFiddle", "ctrl+shift+s", function(e) {
        window.fiddleTabSandbox.saveFiddle(true);
    });
    bindCommand("openFiddle", "ctrl+o", function(e) {
        window.open("open.html", "_blank");
    });
    bindCommand("focusHTML", "ctrl+j", function(e) {
        // Focus on html editor
    });
    bindCommand("focusCSS", "ctrl+k", function(e) {
        // Focus on css editor
    });
    bindCommand("focusJS", "ctrl+l", function(e) {
        // Focus on js editor
    });
}