let EXTENSION_NAME = "Regular Cookie Remover"
let KEY_DELETION_TIME = "deletionTime";
let KEY_DELETION_DURATION = "deletionDuration";

let COOKIES_STR = "Cookies and other trackable browsing data "

function getTimeDuration(){
    return browser.storage.local.get(KEY_DELETION_DURATION).then((storage) => storage[KEY_DELETION_DURATION]);
}
function setNewTimeDuration(days = 7) {
    let setArgs = {};
    setArgs[KEY_DELETION_DURATION] = days;
    return browser.storage.local.set(setArgs);
}

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
    return getTimeDuration().then((duration) => {
        if(!duration){
            duration = 7;
        }
        nextDeletion.setDate(nextDeletion.getDate() + duration);
        let setArgs = {};
        setArgs[KEY_DELETION_TIME] = nextDeletion;
        return browser.storage.local.set(setArgs);
    })
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
            getTimeDuration().then((duration) => {
                if(!duration){
                    duration = 7;
                }
                removeData();
                notify(COOKIES_STR + "have been removed.");
                setNewTimeDuration(duration).then(
                    setNewDeletionDuration()
                )
            })
        } else {
            notifyWhenDeletionReady();
        }
    });
}

onStartup();

browser.runtime.onMessage.addListener(setCustomTime);

function setCustomTime(message){
    days = Number(message.value)
    //Check for integer, positive value and setting a max limit.
    if(((days%1) === 0) && (days > 0) && (days <=365)){
        setNewTimeDuration(days).then(
            setNewDeletionDuration()
        )
    }
}
