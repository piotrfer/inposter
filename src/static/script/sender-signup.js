window.onload = function() {
    document.getElementById("login").addEventListener("input", onLoginInput)
    document.getElementById("firstname").addEventListener("change", onFirstnameChange)
    document.getElementById("lastname").addEventListener("change", onLastnameChange)
    document.getElementById("password").addEventListener("change", onPasswordChange)
    document.getElementById("repassword").addEventListener("change", onRepasswordChange)
    document.getElementById("photo").addEventListener("change", onPhotoChange)
}

onLoginInput = function() {
    var loginForm = document.getElementById("login")
    var loginValidMessage = document.getElementById("login-message")
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
                    if (JSON.parse(xhr.response)[loginForm.value] == "available") {
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
    var criteria = new RegExp("[A-Z{ĄĆĘŁŃÓŚŹŻ}][a-z{ąćęłńóśźż}]+")
    var firstnameForm = document.getElementById("firstname")
    var firstnameMessage = document.getElementById("firstname-message")

    firstnameMessage.innerText = ""

    if (!criteria.test(firstnameForm.value) && firstnameForm.value != "") {
        firstnameMessage.innerText = "The name should start at capital letter and only contains letters"
        firstnameMessage.className = "error-message"
    }
}

onLastnameChange = function() {
    var criteria = new RegExp("[A-Z{ĄĆĘŁŃÓŚŹŻ}][a-z{ąćęłńóśźż}]+")
    var lastnameForm = document.getElementById("lastname")
    var lastnameMessage = document.getElementById("lastname-message")

    lastnameMessage.innerText = ""

    if (!criteria.test(lastnameForm.value) && lastnameForm.value != "") {
        lastnameMessage.innerText = "The last name should start at capital letter and only contains letters"
        lastnameMessage.className = "error-message"
    }

}

onPasswordChange = function() {
    var criteria = new RegExp(".{8,}")
    var passwordForm = document.getElementById("password")
    var passwordMessage = document.getElementById("password-message")

    passwordMessage.innerText = ""

    if (!criteria.test(passwordForm.value) && passwordForm.value != "") {
        passwordMessage.innerText = "Password has to be at least 8 characters long"
        passwordMessage.className = "error-message"
    }

}

onRepasswordChange = function() {
    var passwordForm = document.getElementById("password")
    var repasswordForm = document.getElementById("repassword")
    var repasswordMessage = document.getElementById("repassword-message")

    repasswordMessage.innerText = ""

    if( passwordForm.value != repasswordForm.value ) {
        repasswordMessage.innerText = "The passwords are not identical!"
        repasswordMessage.className = "error-message"
    }
}

onPhotoChange = function() {
    var photoForm = document.getElementById("photo")
    var photoMessage = document.getElementById("photo-message")

    photoMessage.innerText = ""

    if(!/(\.png|\.jpg|\.jpeg)$/i.test(photoForm.value)) {
        photoMessage.innerText = "You can only submit .png, .jpg and .jpeg files"
        photoMessage.className = "error-message"
    }

}