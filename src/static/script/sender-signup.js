window.onload = function () {
    document.getElementById("login").addEventListener("input", onLoginInput)
    document.getElementById("firstname").addEventListener("change", onFirstnameChange)
    document.getElementById("lastname").addEventListener("change", onLastnameChange)
    document.getElementById("password").addEventListener("change", onPasswordChange)
    document.getElementById("repassword").addEventListener("change", onRepasswordChange)
    document.getElementById("photo").addEventListener("change", onPhotoChange)
    document.getElementById("signup-form").addEventListener("submit", onFormSubmit)
}

var valid = {
    "firstname": false,
    "lastname": false,
    "login": false,
    "password": false,
    "repassword": false,
    "photo": false
}

onLoginInput = function () {
    var loginForm = document.getElementById("login")
    var loginValidMessage = document.getElementById("login-message")
    var minLength = 3
    var maxLength = 12

    valid["login"] = false

    loginValidMessage.innerText = ""
    if (loginForm.value != "") {
        if (loginForm.value.length < minLength) {
            loginValidMessage.innerText = "Login must be at least " + minLength + " characters long"
            loginValidMessage.className = "error-message"
        }
        else if (loginForm.value.length > maxLength) {
            loginValidMessage.innerText = "Login must be maximum " + maxLength + " characters long"
            loginValidMessage.className = "error-message"
        }
        else {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", "https://infinite-hamlet-29399.herokuapp.com/check/" + loginForm.value)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        if (JSON.parse(xhr.response)[loginForm.value] == "available") {
                            loginValidMessage.innerText = "Login is available"
                            loginValidMessage.className = "ok-message"
                            valid["login"] = true
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
}

onFirstnameChange = function () {
    var criteria = new RegExp("[A-Z{ĄĆĘŁŃÓŚŹŻ}][a-z{ąćęłńóśźż}]+")
    var firstnameForm = document.getElementById("firstname")
    var firstnameMessage = document.getElementById("firstname-message")

    firstnameMessage.innerText = ""
    valid["firstname"] = false

    if (firstnameForm.value != "") {
        if (!criteria.test(firstnameForm.value)) {
            firstnameMessage.innerText = "The name should start at capital letter and only contains letters"
            firstnameMessage.className = "error-message"
        }
        else {
            valid["firstname"] = true
        }
    }
}

onLastnameChange = function () {
    var criteria = new RegExp("[A-Z{ĄĆĘŁŃÓŚŹŻ}][a-z{ąćęłńóśźż}]+")
    var lastnameForm = document.getElementById("lastname")
    var lastnameMessage = document.getElementById("lastname-message")

    lastnameMessage.innerText = ""
    valid["lastname"] = false

    if (lastnameForm.value != "") {
        if (!criteria.test(lastnameForm.value)) {
            lastnameMessage.innerText = "The last name should start at capital letter and only contains letters"
            lastnameMessage.className = "error-message"
        }
        else {
            valid["lastname"] = true
        }
    }
}

onPasswordChange = function () {
    var criteria = new RegExp(".{8,}")
    var passwordForm = document.getElementById("password")
    var passwordMessage = document.getElementById("password-message")

    passwordMessage.innerText = ""
    valid["password"] = false
    
    if (passwordForm.value != "") {
        if (!criteria.test(passwordForm.value)) {
            passwordMessage.innerText = "Password has to be at least 8 characters long"
            passwordMessage.className = "error-message"
        }
        else {
            valid["password"] = true
        }
    }


}

onRepasswordChange = function () {
    var passwordForm = document.getElementById("password")
    var repasswordForm = document.getElementById("repassword")
    var repasswordMessage = document.getElementById("repassword-message")

    repasswordMessage.innerText = ""
    valid["repassword"] = false

    if (repasswordForm.value != "") {
        if (passwordForm.value != repasswordForm.value) {
            repasswordMessage.innerText = "The passwords are not identical!"
            repasswordMessage.className = "error-message"
        }
        else {
            valid["repassword"] = true
        }
    }


}

onPhotoChange = function () {
    var photoForm = document.getElementById("photo")
    var photoMessage = document.getElementById("photo-message")

    photoMessage.innerText = ""
    valid["photo"] = false

    if (!/(\.png|\.jpg|\.jpeg)$/i.test(photoForm.value) || photoForm.value == "") {
        photoMessage.innerText = "You can only submit .png, .jpg and .jpeg files"  
        photoMessage.className = "error-message"
    }
    else {
        photoMessage.innerText = photoForm.value
        photoMessage.className = "ok-message"
         valid["photo"] = true
    }
}

onFormSubmit = function (e) {
    var formValid = false;
    formValid = valid["firstname"] && valid["lastname"] && valid["login"] && valid["password"] && valid["repassword"] && valid["photo"]
    if (!formValid)
        e.preventDefault()
}