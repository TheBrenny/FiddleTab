// Used to populate the Chrome Storage
(function() {
    let storageVersion = 1;
    ftStore.get({
        storageVersion: -1
    }, (version) => {
        if (version < storageVersion) {
            //update
            ftStore.set({
                storageVersion: storageVersion,
                fiddles: {
                    0: {
                        css: {
                            code: `@keyframes roll{0%{transform:rotate(0deg);}50%{transform:rotate(-180deg);}100%{transform:rotate(-360deg);}}h1{font-size:5em;}.google-blue{color:#0057E7;}.google-red{color:#D62D20;}.google-yellow{color:#FFA700;}.google-green{color:#008744;}.google-e{transform:rotate(-20deg);}.google:hover span{display:inherit;animation:roll 0.3s linear 1;}.google{font-family:futura,roboto-regular,ubuntu,arial,sans-serif;display:inline-block;}`,
                            lang: "css"
                        },
                        js: {
                            code: `function openFiddle(fiddleid){window.parent.postMessage({type:\"openFiddle\",message:fiddleid}, \"*\");}function previousFiddle(data){let ul=document.getElementById(\"prev-fiddle\");let li=document.createElement(\"li\");let a=document.createElement(\"a\");a.innerText=\"Fiddle ID \"+data.fiddleid+\", using \"+data.htmllang+\", \"+data.csslang+\", and \"+data.jslang;a.href=\"javascript:openFiddle(\"+data.fiddleid+\");\";li.appendChild(a);ul.appendChild(li);}window.addEventListener(\"message\",function(event){event.data.type === \"fiddle\"&&previousFiddle(event.data);});`,
                            lang: "javascript"
                        }
                    }
                },
                themes: {
                    html: "chrome",
                    css: "chrome",
                    js: "chrome",
                }
            });
        } else if (version == storageVersion) {
            //we good
        } else if (version > storageVersion) {
            //DEV MODE
        }
    });
})();