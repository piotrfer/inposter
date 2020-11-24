window.onload = function() {
    let labelsDeletes = document.getElementsByClassName("delete-btn")
    for(i=0; i < labelsDeletes.length; i++) {
        console.log(labelsDeletes[i] + "--> ADDED")
        labelsDeletes[i].addEventListener("submit", deleteLabel)
    }
}

deleteLabel = function(e) {
    let id = e.target.id
    e.preventDefault()

    xhr = new XMLHttpRequest()
    xhr.open("DELETE", "/label/" + id)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            window.location.reload()
        }
    }
    xhr.send()
}