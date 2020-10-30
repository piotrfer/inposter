window.onload = function() {
    console.log("added script correctly")
    document.getElementById("login").addEventListener("input", onLoginInput)
    document.getElementById("firstname").addEventListener("change", onFirstnameChange)
    document.getElementById("lastname").addEventListener("change", onLastnameChange)
    document.getElementById("password").addEventListener("change", onPasswordChange)
    document.getElementById("repassword").addEventListener("change", onRepasswordChange)
}

onLoginInput = function() {
    var loginForm = document.getElementById("login")
    var loginValidMessage = document.getElementById("login-valid-message")
    var minLength = 3
    var maxLength = 12
    
    loginValidMessage.innerText = ""

    if (loginForm.value.length < minLength) {
        loginValidMessage.innerText = "Login must be at least " + minLength + " characters long"
        loginValidMessage.className = "error-message"
    }
    else if (loginForm.value.length > maxLength) {
        loginValidMessage.innerText = "Login must be maximum " + maxLength + " characters long"
        loginValidMessage.className = "error-message"
    }
    else {
        console.log(loginForm.value)
        var xhr = new XMLHttpRequest()
        console.log("sending get request")
        xhr.open("GET", "https://infinite-hamlet-29399.herokuapp.com/check/"+loginForm.value)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.response[loginForm.value] == "available") {
                        loginValidMessage.innerText = "Login is available"
                        loginValidMessage.className = "ok-message"
                    }
                    else {
                        loginValidMessage.innerText = "Login is taken"
                        loginValidMessage.className = "error-message"
                    }
                }
                else {
                    console.log("Something went wrong while checking the login availability")
                }
            }
        }
        xhr.send()
    }
}

onFirstnameChange = function() {
    console.log("This will validate firstname")
}

onLastnameChange = function() {
    console.log("This will validate lastname")
}

onPasswordChange = function() {
    console.log("This will validate password")
}

onRepasswordChange = function() {
    console.log("This will validate repassword")
}