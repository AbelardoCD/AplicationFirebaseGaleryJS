$(document).ready(function(){
    if (window.localStorage.getItem('emailUser') == "" || window.localStorage.getItem('emailUser') == null || window.localStorage.getItem('emailUser') == undefined) {
        window.location = "login.html";
    } else {
    

        $("#btnMovimiento").click(function(){
            window.location = "movimiento.html";
        });

        $("#btnObras").click(function(){
            window.location = "index.html";
        });
    }

});