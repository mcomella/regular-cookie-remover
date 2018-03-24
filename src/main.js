console.log('lol, running!');

let EXTENSION_NAME = "Regular Cookie Remover"

/*
- Calculate duration ready for removal
- Get preference for how often to delete
- Notify delete on next startup
- Notify deleted
- docs
*/

function hasDeletionDurationPassed() {
    return true;
}

function removeData() {
    browser.browsingData.remove(/* options */ {}, {
        // cache: true,
        cookies: true,
        // fileSystems: true, // TODO: wtf is this?
        // indexedDB: true,
        // localStorage: true,
        // serverBoundCertificates: true,
        // serviceWorkers: true
    });
}

function notify(msg) {
    browser.notifications.create({
        "type": "basic",
        "title": EXTENSION_NAME,
        "message": msg,
    });
}

function onStartup() {
    if (hasDeletionDurationPassed()) {
        removeData();
        notify("Cookies and other trackable browsing data have been removed.");
    }
}

onStartup();
