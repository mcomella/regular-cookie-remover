let EXTENSION_NAME = "Regular Cookie Remover"
let KEY_DELETION_TIME = "deletionTime";

let COOKIES_STR = "Cookies and other trackable browsing data "

function getDeletionTime() {
    return browser.storage.local.get(KEY_DELETION_TIME).then((storage) => storage[KEY_DELETION_TIME]);
}

function getHasDeletionDurationPassed() {
    return getDeletionTime().then((deletionTime) => {
        let now = new Date();
        return now > deletionTime;
    });
}

function setDeletionTimeIfNotSet() {
    return getDeletionTime().then((deletionTime) => {
        if (!deletionTime) {
            return setNewDeletionDuration();
        }
    });
}

function setNewDeletionDuration() {
    let nextDeletion = new Date();
    nextDeletion.setDate(nextDeletion.getDate() + 7); // TODO: user configurable.

    let setArgs = {};
    setArgs[KEY_DELETION_TIME] = nextDeletion;
    return browser.storage.local.set(setArgs);
}

function notifyWhenDeletionReady() {
    getDeletionTime().then((deletionTime) => {
        let now = new Date();
        let timeoutMillis = deletionTime - now;
        setTimeout(() => notify(COOKIES_STR + "will be removed after browser restart."),
                timeoutMillis);
    });
}

function removeData() {
    browser.browsingData.remove(/* options */ {}, {
        cache: true,
        cookies: true,
        indexedDB: true,
        localStorage: true,
        serviceWorkers: true,

        // Not used by Firefox: https://mail.mozilla.org/pipermail/dev-addons/2017-January/002467.html
        // fileSystems: true,
        // serverBoundCertificates
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
    setDeletionTimeIfNotSet().then(getHasDeletionDurationPassed).then((hasDeletionDurationPassed) => {
        if (hasDeletionDurationPassed) {
            removeData();
            notify(COOKIES_STR + "have been removed.");
            setNewDeletionDuration();
        } else {
            notifyWhenDeletionReady();
        }
    });
}

onStartup();
