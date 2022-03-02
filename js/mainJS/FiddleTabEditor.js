class FiddleTabEditor {
    constructor(name, language, theme, element, sandbox) {
        this.object = ace.edit(element);
        this.object.$blockScrolling = Infinity;
        this.object.on("change", sandbox.editorChanged.bind(sandbox));
        //this.object.getSession().setMode("ace/mode/" + language);
        this.object.setTheme("ace/theme/" + theme);
        this.editorName = name;
        this.language = language;
        this.theme = theme;
    }

    get source() {
        return this.object.getValue();
    }
    set source(source) {
        this.object.selectAll();
        this.object.clearSelection();
        this.object.setValue(source, 0);
    }
    get language() {
        return this.lang;
    }
    set language(lang) {
        this.object.getSession().setMode("ace/mode/" + lang);
        this.lang = lang;
    }
}