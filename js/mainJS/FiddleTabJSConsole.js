class FiddleTabJSConsole {
    constructor(theme, element) {
        this.object = ace.edit(element);
        this.object.$blockScrolling = Infinity;
        //this.object.on("change", sandbox.editorChanged.bind(sandbox));
        this.object.getSession().setMode("ace/mode/plain_text");
        this.object.setTheme("ace/theme/" + theme);
        this.editorName = "console";
        this.language = "plain_text";
        this.theme = theme;
        this.object.readOnly = true;
    }

    log(level, msg) {
        this.object.navigateFileEnd();
        this.object.insert(`${level}:\t${msg}`);
    }
}