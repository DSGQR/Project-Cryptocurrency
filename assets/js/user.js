// Firebase POC for adding user accounts
// Configuration Firebase
var config = {
    apiKey: "AIzaSyBdpZcMPZIDwRNM5RcekAkrwuzxa74FgzM",
    authDomain: "cryptocurrecny-f7eb7.firebaseapp.com",
    databaseURL: "https://cryptocurrecny-f7eb7.firebaseio.com",
    projectId: "cryptocurrecny-f7eb7",
    storageBucket: "cryptocurrecny-f7eb7.appspot.com",
    messagingSenderId: "917854135892"
  };
// Initialize Firebase
firebase.initializeApp(config);
// create a variable named database to store your db connection
const db = firebase.database();
// Create a reference to user folders
let userAcctRef = db.ref('cryptoAccounts'); // do not use keyword 'userAccount'
let userPortfRef = db.ref('cryptoPortfolio');

// Functions .......................................................
function addUserAccount(userId, userName) {

    // prepare user account object
    let userAccount = {
        userId: userId,
        userName: userName
    }
    // Add user account
    userAcctRef.push(userAccount);
}

function doesAccountExist(userId) {
    console.log('in doesaccountexist function')
    let isRecordAvailable = false;
    // Look for the trains that match the name
    userAcctRef.orderByChild('userId').equalTo(userId).on('value', data => {
        data.forEach(elementNode => {
            // If one record exist with the name, is enough
            isRecordAvailable = true;
        });
    })
    console.log(isRecordAvailable)
    return isRecordAvailable;
}

// A FIRST access is need to tthe tables in order for function to work
function refreshUserAccounts() {
    // process all records in database
    userAcctRef.on('value', data => {
        //loop over all nodes
        data.forEach(elementNode => {
            // get node key and data
            var recKey = elementNode.key;
            var userAcct = elementNode.val();
        });
    })
}

// EVENTS ...............................................
function SubmitUserAccount() {

    // Control default behavior for "submit" button
    event.preventDefault();

    // reset possible errors
    document.getElementById("userIdErr").innerHTML = '';
    document.getElementById("userNameErr").innerHTML = '';
    document.getElementById("userPwdErr").innerHTML = '';

    // retreive data from screen
    let userId = document.getElementById("uId").value.trim();
    let userName = document.getElementById("uName").value.trim();
    let userPwd = document.getElementById("uPwd").value.trim();

    console.log("userId: " + userId);
    console.log("userName: " + userName);
    console.log("userPwd: " + userPwd);

    addUserAccount(userId, userName, userPwd);

    document.getElementById('userAccts').innerHTML = '';
    refreshUserAccounts();
}

function DeleteUserAccount() {

    // Control default behavior for "submit" button
    event.preventDefault();

    // reset possible errors
    document.getElementById("userIdErr").innerHTML = '';

    // retreive data from screen
    let userId = document.getElementById("uId").value.trim();

    // Look for the record that match the id
    userAcctRef.orderByChild('userId').equalTo(userId).on('value', data => {
        data.forEach(elementNode => {
            // get key info
            let recKey = elementNode.key;
            let usrAcct = elementNode.val();

            console.log("recKey: " + recKey);
            console.log("userId: " + usrAcct.userId);

            // For the record with matching keys, delete it
            if (usrAcct.userId === userId) {
                // Delete object
                userAcctRef.child(recKey).remove();
                document.getElementById('userAccts').innerHTML = '';
                refreshUserAccounts();
            }
        });
    })
}


function addCoinToList(userId, coinName, coinSymbol, coinHold) {

    userId = userId.trim();
    coinName = coinName.trim();
    coinHold = coinHold.trim();
    coinSymbol = coinSymbol.trim()

    let errorFound = false;

    // does account already exist?
    let isUserAcountExist = doesAccountExist(userId);

    if (!isUserAcountExist) {
        document.getElementById("userIdErr").innerHTML = 'Use account does not exist';
        errorFound = true;
    }

    if (!errorFound && isUserAcountExist) {

        // Get current watch list
        let usrPortfolio = getUserPortfolio(userId);
        let recKey = null;
        let curWatchList = [];
        let pos = -1;

        if (usrPortfolio != null) {
            recKey = usrPortfolio.key;
            curWatchList = usrPortfolio.val().watchList;

            // Get current coint position in protafolio 
            for (let i = 0; i < curWatchList.length; i++) {
                let element = curWatchList[i];
                if (element.coinName === coinName) {
                    pos = i;
                    break
                }
            }
        }

        // prepare portfolio object
        let userPortfolio = {
            userId: userId,
            watchList: []
        }
        // prepare coin
        let coin = {
            coinName: coinName,
            coinSymbol: coinSymbol,
            hold: coinHold
        }

        if (pos === -1) {
            // if coin not in list, add it
            userPortfolio.watchList = curWatchList;
            userPortfolio.watchList.push(coin);
        } else {
            // replace from the list first
            curWatchList.splice(pos, 1);
            userPortfolio.watchList = curWatchList;
            userPortfolio.watchList.push(coin);
        }

        // remove portfolio and, 
        if (recKey != null) {
            userPortfRef.child(recKey).remove();
        }

        // add to database 
        userPortfRef.push(userPortfolio);
    }
}

function deleteCoin(userId, coinSymbol) {
    userId = userId.trim();
    coinSymbol = coinSymbol.trim();
    let errorFound = false;
    // does account already exist?
    let isUserAcountExist = doesAccountExist(userId);
    if (!isUserAcountExist) {
        document.getElementById("userIdErr").innerHTML = 'Use account does not exist';
        errorFound = true;
    }

    if (!errorFound && isUserAcountExist) {
        // Get current watch list
        let usrPortfolio = getUserPortfolio(userId);
        let recKey = null;
        let curWatchList = [];
        let pos = -1;
        if (usrPortfolio != null) {
            recKey = usrPortfolio.key;
            curWatchList = usrPortfolio.val().watchList;

            // Get current coint position in protafolio 
            for (let i = 0; i < curWatchList.length; i++) {
                let element = curWatchList[i];
                if (element.coinSymbol === coinSymbol) {
                    pos = i;
                    break
                }
            }
        }
        // prepare portfolio object
        let userPortfolio = {
            userId: userId,
            watchList: []
        }

        if (pos > -1) {
            // replace from the list first
            curWatchList.splice(pos, 1);
            userPortfolio.watchList = curWatchList;

            // remove portfolio and, 
            if (recKey != null) {
                userPortfRef.child(recKey).remove();
            }

            // add to database 
            userPortfRef.push(userPortfolio);
        }
    }
}

function getUserPortfolio(userId) {

    let usrPortfolio = null;

    // Look for the trains that match the name
    userPortfRef.orderByChild('userId').equalTo(userId).on('value', data => {
        data.forEach(portfolio => {
            // use val() to retrieve the objects
            usrPortfolio = portfolio;
        })
    })

    return usrPortfolio;
}

// A FIRST access is need to tthe tables in order for function to work
function refreshUserAccounts() {
    // process all records in database
    userAcctRef.on('value', data => {
        //loop over all nodes
        data.forEach(elementNode => {
            // get node key and data
            var recKey = elementNode.key;
            var userAcct = elementNode.val();

            // just to make app aware uf user accounts
        });
    })
}

function refreshUserPortflio() {
    // process all records in database
    userPortfRef.on('value', data => {
        //loop over all nodes
        data.forEach(elementNode => {
            // get node key and data
            var recKey = elementNode.key;
            var userPortf = elementNode.val();
            if (userPortf != null) {
                // displayUserPortfolio(recKey, userPortf) //figure this out
            }
        });
    })
}

function SubmitCoin() {
    // Control default behavior for "submit" button
    event.preventDefault();

    // retreive data from screen
    let userId = document.getElementById("uId").value.trim();
    let coinName = document.getElementById("cName").value.trim();
    let coinHold = document.getElementById("cHold").value.trim();
    let isFav = document.getElementById("cFav").checked;

    console.log("to Add/Update");
    console.log(userId);
    console.log(coinName);
    console.log(coinHold);
    console.log(isFav);

    addCoinToList(userId, coinName, coinHold, isFav);

    document.getElementById('usrPportfolio').innerHTML = '';
    refreshUserPortflio();
}

function SubmitDeleteCoin() {
    // Control default behavior for "submit" button
    event.preventDefault();
    // retreive data from screen
    let userId = document.getElementById("uId").value.trim();
    let coinName = document.getElementById("cName").value.trim();

    console.log("to Delete");
    console.log(userId);
    console.log(coinName);

    deleteCoin(userId, coinName);
    document.getElementById('usrPportfolio').innerHTML = '';
    refreshUserPortflio();
}

refreshUserAccounts();
refreshUserPortflio();