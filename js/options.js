var defaults = {
    theme: "chrome",
    langs: {
        js: "javascript",
        css: "css",
        html: "html"
    },
    indent: "  "
}
var options = {
    themes: {
        html: defaults.theme,
        css: defaults.theme,
        js: defaults.theme,
        console: defaults.theme
    },
    langs: {
        css: defaults.langs.css,
        js: defaults.langs.js
    },
    indent: defaults.indent
};

var loadOptions = function() {
    chrome.storage.sync.get(options, function(opts) {
        options = opts;
        console.log("Options loaded!")
    });
};
var saveOptions = function() {
    chrome.storage.sync.set(options, function() {
        console.log("Themes saved!");
    });
};

(function() {
    $(".box > top").forEach(function(el, i) {
        el.addEventListener("click", function() {
            var me = $(this).parentNode;
            var mustOpen = me.classList.contains("b0");
            var opened = $(".box:not(.b0)");
            var level = 0;
            if (mustOpen) {
                $.merge(opened, [me.get(0)]);
                opened.forEach(function(el, i) {
                    el.classList.remove("b0 b1 b2 b3 b4");
                });
                level = 5 - opened.size();
                opened.forEach(function(el, i) {
                    el.addClass("b" + level);
                });
            } else {
                if (opened.size() <= 1) return;
                opened.removeClass("b0 b1 b2 b3 b4");
                opened = opened.not(me);
                me.addClass("b0");
                level = 5 - opened.size();
                opened.addClass("b" + level);
            }
        });
    });
})();
$(".inner-box top").forEach(function(el, i) {
    el.addEventListener("click", function() {
        var me = $(this).parent("*").parent(".inner-box");
        me.toggleClass("collapsed");
    });
});