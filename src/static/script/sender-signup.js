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
    var minLength = 3
    var maxLenght = 12
    
    if (loginForm.value.length < minLength)
        console.log("login too short")
    else if (loginForm.value.length > maxLenght) {
        console.log("login too long")
    }
    else {
        console.log(loginForm.value)
        xhr = new XMLHttpRequest()
        console.log("sending get request")
        xhr.open("GET", "https://infinite-hamlet-29399.herokuapp.com/check/"+loginForm.value)
        xhr.onreadystatechange = chceckLoginAvailability
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

chceckLoginAvailability = function() {
    console.log(xhr)
}