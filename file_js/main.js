function hidetxt(setId) {
    var param = document.getElementById(setId[0]);
    if (param != null) param.style.display = "";
    for (var i = 1; i < setId.length; i += 1) {
        param = document.getElementById(setId[i]);
        if (param != null) param.style.display = "none";
    }
}

function check(idText, idCheck) {
    var text = document.getElementById(idText);
    var check = document.getElementById(idCheck);
    if (check.checked) text.style.display = "";
    else text.style.display = "none";
}
