// CommSec mobile API NodeJS interface example.
// Copyright 2016-2018 Adam Nielsen <malvineous@shikadi.net>

// You'd normally use this line of course.
//const Commsec = require('commsec');

// But we have to do things differently because this example is inside the
// commsec package.
const Commsec = require('./index.js');
const creds = require('./creds.json')

// Everything is wrapped inside an async function so we can 'await'.
async function run()
{
	let commsec = new Commsec();

	// The device ID is allocated upon a successful login.  You should store it
	// somewhere and supply it on subsequent logins.  It's possible that not doing
	// so will cause older device IDs to get deleted, breaking the login on the
	// real app.
	let deviceId = null;

	// Attempt the login.  If this fails while you're testing, remember to log in
	// via the web site or app after two failed attempts, to avoid your account
	// getting locked for three failed logins in a row.  If it does get locked,
	// it's an easy phone call to get it unlocked again though, so no big deal.
	let loginResponse;
	try {
		loginResponse = await commsec.login(creds);
	} catch (e) {
		console.log('Unable to log in:', e.message);
		return;
	}

	if (loginResponse.deviceId) {
		// If you get a new device ID, you should save it and use it for future
		// logins.  It doesn't seem to time out so you can just add it to your
		// credential store along with your password.
		console.log('Received a new device ID:', loginResponse.deviceId);
	}

	try {
		let myRawHoldings = await commsec.getHoldings();
		var holdingsForQuery = {};
		var holdingsForDisplay = {};
		myRawHoldings.entities.forEach(entity => {
			console.log('Entity', entity.entityName);
			entity.accounts.forEach(account => {
				account.holdings.forEach(holding => {
					// the library expects this weird "an object with many kv properties but NOT a list"
					// so hence the format: holdings = {code1: null, code2: null}
					// the null is used for hashes which the endpoint returns (check the original example),
					// kinda a hacky caching thing? 
					holdingsForQuery[holding.code] = null; 
					holdingsForDisplay[holding.code + 'buyPrice'] = holding.purchasePrice;
					holdingsForDisplay[holding.code + 'availableUnits'] = holding.availableUnits;
				});
			});
		});

		console.log("Code, Quantity, BuyPrice, CurrentPrice")
		let stockInfosResponse = await commsec.pollStocks(holdingsForQuery);
		stockInfosResponse.stockInfos.forEach(stock => {
			console.log(`${stock.code}, ${holdingsForDisplay[stock.code + 'availableUnits']}, ${holdingsForDisplay[stock.code + 'buyPrice']}, \$${stock.lastPrice}`);
		});
	} catch (e) {
		console.log('Error getting current prices of personal hodlings', e.message);
	}
}

run();
