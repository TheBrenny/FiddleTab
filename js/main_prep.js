window.progress = function(msg) {
    console.log(`FTProgress: ${msg}`);
};

window.defaultContent = {
    html: `<div class="center">
    <h1>Welcome to FiddleTab!</h1>
    <p>Play around in the editors to get started!</p>
</div>`,
    css: `.center {
    text-align: center;
}`,
    js: `console.log("Or jump into this JS Console start playing around in a sandboxed JS Environment that's attached to the iframe!");`
};

// POPULATE SELECT BOXES
$(".theme").forEach(el => {
    el.innerHTML = `<optgroup label="Bright"><option value="chrome">Chrome</option><option value="clouds">Clouds</option><option value="crimson_editor">Crimson Editor</option><option value="dawn">Dawn</option><option value="dreamweaver">Dreamweaver</option><option value="eclipse">Eclipse</option><option value="github">GitHub</option><option value="iplastic">IPlastic</option><option value="solarized_light">Solarized Light</option><option value="textmate">TextMate</option><option value="tomorrow">Tomorrow</option><option value="xcode">XCode</option><option value="kuroir">Kuroir</option><option value="katzenmilch">KatzenMilch</option><option value="sqlserver">SQL Server</option></optgroup><optgroup label="Dark"><option value="ambiance">Ambiance</option><option value="chaos">Chaos</option><option value="clouds_midnight">Clouds Midnight</option><option value="cobalt">Cobalt</option><option value="idle_fingers">idle Fingers</option><option value="kr_theme">krTheme</option><option value="merbivore">Merbivore</option><option value="merbivore_soft">Merbivore Soft</option><option value="mono_industrial">Mono Industrial</option><option value="monokai">Monokai</option><option value="pastel_on_dark">Pastel on dark</option><option value="solarized_dark">Solarized Dark</option><option value="terminal">Terminal</option><option value="tomorrow_night">Tomorrow Night</option><option value="tomorrow_night_blue">Tomorrow Night Blue</option><option value="tomorrow_night_bright">Tomorrow Night Bright</option><option value="tomorrow_night_eighties">Tomorrow Night 80s</option><option value="twilight">Twilight</option><option value="vibrant_ink">Vibrant Ink</option></optgroup>`;
});
(() => {
    let opts = {
        html: [{ val: "html", name: "HTML" }, { val: "haml", name: "HAML" }],
        css: [{ val: "css", name: "CSS" }, { val: "less", name: "Less" }, { val: "sass", name: "Sass" }, { val: "scss", name: "SCSS (Sass 3)" }],
        js: [{ val: "javascript", name: "Javascript" }, { val: "coffee", name: "Coffee Script" }]
    };
    for (let lang in opts) {
        let html = "";
        for (let o in lang) {
            html += `<option value="${lang.val}" selected>${lang.name}</option>`;
        }
        $(`[name="${lang}LangSelect"]`).innerHTML = html;
    }
})();