window.ftReadyEvent = new Event('fiddleTabCreate');

window.$ = (selector) => {
    if (selector instanceof HTMLElement) return selector;
    if (typeof(selector) === "string") return document.querySelectorAll(selector);
    return selector;
};
window.$0 = (selector) => {
    return $(selector)[0];
};
window.$ajax = (opts) => {
    let r = new XMLHttpRequest();
    r.open(opts.method, opts.url, true);
    if (opts.load) r.onload = function() {
        if (r.status >= 200 && r.status < 400) {
            opts.load();
        } else {
            opts.error();
        }
    };
    if (opts.error) r.onerror = opts.error;
    if (opts.always) r.onloadend = opts.always;
    r.send();
};
window.checkValidUrl = (link, success, failure, always) => {
    let valid = /(https?|s?ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(link);
    if (!success) success = { func: undefined, args: undefined };
    if (!failure) failure = { func: undefined, args: undefined };
    if (!success.func) success.func = (args) => { return true; };
    if (!failure.func) failure.func = (args) => { return false; };
    if (!valid) return failure.func(failure.args);
    $ajax({
        url: link,
        method: "GET",
        dataType: "text",
        done: () => {
            if (valid) success.func(success.args);
        },
        fail: (xhr, s, e) => {
            if (valid) {
                failure.func(failure.args);
                console.warn("Error: " + e.toString());
            }
        },
        always: () => {
            if (success.args.type) {
                $("#add" + success.args.type)[0].disabled = false;
                $("#add" + success.args.type)[0].innerText = "Add";
            }
        }
    });
};
window.submitPOST = (url, data) => {
    let form = document.createElement("form");
    form.style.display = "none";
    form.setAttribute("target", "_blank");
    form.setAttribute("method", "POST");
    form.setAttribute("action", url);
    document.body.appendChild(form);
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let value = $('<input type="hidden" />').setAttribute(key, data[key]).appendTo(form);
        }
    }
    form.submit().remove();
};
window.ftStore = {
    get: (data, callback) => {
        chrome.storage.local.get(data, callback);
    },
    set: (data, callback) => {
        chrome.storage.local.set(data, callback);
    }
};