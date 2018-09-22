//If no user logged-in in local storage, display login form
function userCheck() {
  if (!localStorage.getItem('cw-username')) {
      loginForm()
  }
}

//Display login form
function loginForm() {
    //create div with login form
    var loginContainer = document.createElement('div')
    loginContainer.className = 'card rounded-0'
    loginContainer.innerHTML = `
        <div class="card-header">
            <h4>Login</h4>
        </div>
        <div class='card-body'>
            <form>
                <div class="form-group">
                    <label for="uId">Username <span id="userIdErr" class="text-danger"></span></label>
                    <input class="form-control" id="uId" placeholder="User ID..." type="text">
                </div>
                <button class="btn btn-primary" onclick="loginAccount()">Submit</button>
                <button class="btn btn-primary" onclick="createAccountForm()">Create Account</button>
            </form>
        </div>
    `
    //clear page
    document.querySelector('#js-user-page').innerHTML = ''
    //append login form
    document.querySelector('#js-user-page').appendChild(loginContainer)
}

//Display Create-Account Form
function createAccountForm() {
    //create div with create account form
    var createContainer = document.createElement('div')
    createContainer.className = 'card rounded-0'
    createContainer.innerHTML = `
        <div class="card-header">
            <h4>Create New Account</h4>
        </div>
        <div class='card-body'>
            <form>
                <div class="form-group">
                    <label for="uName">Name <span id="userNameErr" class="text-danger"></span></label>
                    <input class="form-control" id="uName" placeholder="User name..." type="text">
                </div>
                <div class="form-group">
                    <label for="uId">Username <span id="userIdErr" class="text-danger"></span></label>
                    <input class="form-control" id="uId" placeholder="User ID..." type="text">
                </div>
                <button class="btn btn-primary" onclick="createAccount()">Submit</button>
            </form>
        </div>
    `
    //clear page
    document.querySelector('#js-user-page').innerHTML = ''
    //append create account form
    document.querySelector('#js-user-page').appendChild(createContainer)
}

//Button Submit Login
function loginAccount() {
    event.preventDefault()
    userIdInput = document.getElementById('uId').value.trim()
    if(!loginAccountError(userIdInput)) {
        //display porfolio
        localStorage.setItem('cw-username', userIdInput)
        userCheck()
    }
}

//Button Submit new account
function createAccount() {
    event.preventDefault()
    userNameInput = document.getElementById('uName').value.trim()
    userIdInput = document.getElementById('uId').value.trim()
    //push user account to firebase
    if (!createAccountInputError(userNameInput, userIdInput)) {
        addUserAccount(userIdInput, userNameInput)
        //set username on local storage
        localStorage.setItem('cw-username', userIdInput)
        userCheck()
    }
}

function loginAccountError(userIdInput) {
    let isErrorFound = false
    //if input is blank, error
    if (userIdInput === '') {
        isErrorFound = true
        document.getElementById('userIdErr').innerHTML = "User ID cannot be blank"
    }
    //if account isn't in database, error
    if (!doesAccountExist(userIdInput)) {
        document.getElementById('userIdErr').innerHTML = 'User not found. Please create Account'
        isErrorFound = true
    }
    return isErrorFound
}

function createAccountInputError(userNameInput, userIdInput) {
    let isErrorFound = false;
    if (userNameInput === '') {
        isErrorFound = true
        document.getElementById('userNameErr').innerHTML = "User Name cannot be blank"
    }
    if (userIdInput === '') {
        isErrorFound = true
        document.getElementById('userIdErr').innerHTML = "User ID cannot be blank"
    }
    if (doesAccountExist(userIdInput)) {
        console.log('user account must have existed')
        isErrorFound = true
        document.getElementById('userIdErr').innerHTML = 'User ID already in use.'
    }
    return isErrorFound
}


//Button Logout
function logout() {
    localStorage.removeItem('cw-username')
    userCheck()
}

//run initial check on page load
userCheck()