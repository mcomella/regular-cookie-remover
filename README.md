# Regular Cookie Remover
[Available on addons.mozilla.org][AMO]

## License
The license included with this repository is based on the X11 license, which is similar to the MIT license.

[AMO]: https://addons.mozilla.org/en-US/firefox/addon/regular-cookie-remover/

## What browsing data we delete
This Addon removes your cookie, cache and other trackable browsing data stored in browser's local storage, indexed db as well as web workers.

## How it works
This addon contains a background script which is loaded the same time this addon is enabled/loaded and will run every time the browser starts, untill the addon is disabled.
On start of the browser, the time of deleting is retrieved from local storage if available, otherwise it set deletion time to the date which is after 7 days from the current date.
After which it checks for whether the deletion time is passed, and if yes it removes all the data mentioned above and sets a new deletion time.
Otherwise it calculates the time left for deleting and as soon as that time is passed, it notifys the user that the data will be deleted next time the browser is restarted.
Note:- As soon as browser is closed the background script dosen't work untill the next time browser is opened.

## Permissions Required
1. Browsing Data -: Enables addon to clear the data that is accumulated while the user is browsing.
2. Notifications -: Enables addon to communicate information using the underlying operating system's                               notification service.
3. Storage       -: Enables addon to store and retrieve data, such as deletion time which is set by the addon.