(function (window, apiHost) {  // modified from https://beampipe.io/js/tracker.js (2021-07-03)
    if (window.beampipe) {
        return;
    }
    var location = window.location;
    var document = window.document;
    var history = window.history;
    var isLocal = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\:)*?:?0*1$/.test(location.hostname) || location.protocol === "file:";
    var ele = document.querySelector("[data-beampipe-domain]")
        || document.querySelector("[data-alysis-domain]");
    var domain = ele.getAttribute("data-beampipe-domain") ||
        ele.getAttribute("data-alysis-domain") ||
        (isLocal ? "localhost" : location.host);
    var track = function (event) {
        var _a;
        if (isLocal) {
            console.warn("Ignoring in local mode");
            return;
        }
        var payload = {
            type: event,
            url: location.protocol +
                "//" +
                location.hostname +
                location.pathname +
                location.search,
            domain: domain,
            referrer: document.referrer,
            userAgent: window.navigator.userAgent,
            source: (_a = location.search.match(/[?&](ref|source|utm_source)=([^?&]+)/)) === null || _a === void 0 ? void 0 : _a[2],
            screenWidth: window.innerWidth
        };
        var request = new XMLHttpRequest();
        request.open("POST", apiHost, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(payload));
    };
    var log = function () { return track("page_view"); };
    window.beampipe = track;
    // if (history.pushState) {
    //     var pushState_1 = history["pushState"];
    //     history.pushState = function () {
    //         pushState_1.apply(this, arguments);
    //         log();
    //     };
    //     window.addEventListener("popstate", log);
    // }
    log();
})(window, "https://beampipe.io/event");
