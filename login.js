$(document).ready(function () {

    db = firebase.database().ref("obras");
    storageService = firebase.storage();


    credenciales();

});
function credenciales() {
    $("#btnLogin").click(function () {

        var email = $("#email").val();
        var password = $("#password").val();

        login(email, password);
    });
}
function login(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {

            window.localStorage.setItem('emailUser', email);
            window.location = "inicio.html";
        })
        .catch(function (error) {
            alert("Se ha presentado un error...")
        });
}