console.log('lol, running!');

function hasDurationPassed() {
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

function main() {
    if (hasDurationPassed()) {
        removeData();
        // TODO: notify deleted.
    }
}

main();
