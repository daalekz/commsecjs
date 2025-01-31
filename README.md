# CommSec trading interface for node.js
**Copyright 2016-2018 Adam Nielsen <<malvineous@shikadi.net>>**

This is a node.js interface to the CommSec mobile API.  It was created by
deciphering the calls made by the Android app.

While the older v0.1 of this library used screen-scraping, v0.2 has been
rewritten to use only the mobile API, which is much faster and more reliable.
Unlike v0.1, little attempt has been made to abstract the API into a generic
interface so there is now only a lightweight wrapper around the API calls.

#### What is supported?

* Login: via password or PIN.
* Watchlists: retrieval with prices.
* Live data: arbitrary lists of stocks via polling only (API limitation).  The
  CommSec app polls once a second.
* Holdings: list stocks owned, purchase price, etc.
* Order status and history: See pending, executed and cancelled orders.
* Trading: Orders can be placed and cancelled, but this is not well tested yet.

#### What is not yet supported?

* Market-sensitive announcements.
  * These can be detected through the watchlists already but there's no method
    to get further info yet.

#### What will not be supported?

There are no plans to support these features, however patches are welcome should
anyone wish to add support themselves.

* Portfolio.
* Banking.


Installation
------------


    npm install commsec

Update the `creds_example.json` file with your own commsec login details, and then rename the file to `creds.json`.

Example
-------

See `example.js` in the parent repo for details.

Running
-------
    node main.js
