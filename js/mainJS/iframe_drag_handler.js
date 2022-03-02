function loadDragHandler() {
    let minWidth = 108;
    let minHeight = 30;
    $(".verti-drag").forEach((el, i) => {
        el.addEventListener("mousedown", function(mdEvent) {
            let me = $(this);
            let draggable = me.parent();
            let prevSibling = draggable.prev();
            let dragHeight = draggable.height();
            let docHeight = $(document).height();
            let startY = mdEvent.pageY;

            $(".iframe-cover").classList.remove("mouseworks");
            $(".iframe-cover").classList.add("mousenotwork");
            $(document).on("mousemove", function(mmEvent) {
                mmEvent.preventDefault();
                let diffY = startY - mmEvent.pageY;
                let newHeight = ((diffY / docHeight) + (dragHeight / docHeight)) * 100;
                newHeight = Math.min(((docHeight - minHeight) / docHeight) * 100, Math.max((minHeight / docHeight) * 100, newHeight));

                draggable.css({
                    height: newHeight + "%"
                });
                prevSibling.css({
                    height: 100 - newHeight + "%"
                });
            });
            $(document).on("mouseup", function(muEvent) {
                $(document).off("mouseup").off("mousemove");
                $(".iframe-cover").classList.remove("mouseworks")
                $(".iframe-cover").classList.add("mousenotwork");
                editors.html.object.resize(true);
                editors.css.object.resize(true);
            });
        });
    });
    $(".iframe-dragzone").forEach(function(el, i) {
        el.addEventListener("mousedown", function(mdEvent) {
            let draggables = $("#sandbox, .iframe-cover");
            let startHeight = draggables.height();
            let siblings = $("#output .code_box");
            let docHeight = $(document).height();
            let startY = mdEvent.pageY;

            $(".iframe-cover").classList.add("mouseworks");
            $(".iframe-cover").classList.remove("mousenotwork");
            $(document).on("mousemove", function(mmEvent) {
                mmEvent.preventDefault();
                let diffY = startY - mmEvent.pageY;
                let newHeight = ((diffY / docHeight) + (startHeight / docHeight)) * 100;
                newHeight = Math.min(((docHeight - minHeight) / docHeight) * 100, Math.max((minHeight / docHeight) * 100, newHeight));

                draggables.css({
                    height: newHeight + "%",
                    top: 100 - newHeight + "%"
                });
                siblings.css({
                    height: 100 - newHeight + "%"
                });
            });
            $(document).on("mouseup", function(muEvent) {
                $(document).off("mouseup").off("mousemove");
                $(".iframe-cover").classList.remove("mouseworks")
                $(".iframe-cover").classList.add("mousenotwork");
                editors.html.object.resize(true);
                editors.css.object.resize(true);
                editors.js.object.resize(true);
            });
        });
    });
    $("#js").forEach(function(el, i) {
        el.addEventListener("mousedown", function(mdEvent) {
            let me = $(this);
            let draggable = me.parent();
            let dragWidth = draggable.width();
            let clickPos = mdEvent.pageX - me.offset().left;
            let prevSibling = draggable.prev();
            let boundarySize = jsEditor.renderer.gutterWidth;
            let maxWidth = $(document).width();
            let startX = mdEvent.pageX;

            if (0 < clickPos && clickPos < boundarySize) {
                $(".iframe-cover").classList.add("mouseworks")
                $(".iframe-cover").classList.remove("mousenotwork");
                $(document).on("mousemove", function(mmEvent) {
                    mmEvent.preventDefault();
                    let diffX = startX - mmEvent.pageX;
                    let newWidth = ((diffX / maxWidth) + (dragWidth / maxWidth)) * 100;
                    newWidth = Math.min(((maxWidth - minWidth) / maxWidth) * 100, Math.max(((2 * minWidth) / maxWidth) * 100, newWidth));
                    draggable.css({
                        width: newWidth + "%",
                        left: 100 - newWidth + "%"
                    });
                    prevSibling.css({
                        width: 100 - newWidth + "%"
                    });
                });
                $(document).on("mouseup", function(muEvent) {
                    $(document).off("mouseup").off("mousemove");
                    $(".iframe-cover").classList.remove("mouseworks")
                    $(".iframe-cover").classList.add("mousenotwork");
                    editors.html.object.resize(true);
                    editors.css.object.resize(true);
                    editors.js.object.resize(true);
                });
            }
        });
    });
}