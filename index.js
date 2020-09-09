var db = "";

$(document).ready(function () {
    botonesImg();

    db = firebase.database().ref("obras");

    traerDatos();
    getdatos();
    comboMovimientos();
});

function getdatos() {

    $("#btnGuardar").click(function () {
        console.log("guardar");

        var ref = db
        var id = ref.push()
        console.log(id.getKey())
        var idRegistro = id.getKey()
        var idMovimiento = $("#comboMovimiento").val();
        db.child(idRegistro).set({
            autor: $("#autor").val(),
            descripcion: $("#descripcion").val(),
            id: idRegistro,
            nombre: $("#nombre").val(),
            url: $("#url").val()

        });

        asignarMovimientoAObra(idRegistro, idMovimiento);
        traerDatos();
    });


}
function asignarMovimientoAObra(idObra, idmovimiento) {
    console.log(idObra + "  " + idmovimiento);
    var ref = firebase.database().ref("movimiento").child(idmovimiento).child("obrasAsignadas").child(idObra).set(true);
    alert("Guardado correctamente")

}
function traerDatos() {

    $("#secciontabla").children("tr").remove()
    db.on("value", function (data) {

        var datos = data.val()
        //console.log(datos)
        $.each(datos, function (nodo, value) {
            //   console.log(value.nombre)
            var tr = "";

            tr += " <div class='card col-md-4   align-items-center' id='carta'>";
            tr += " <div class='card-header'>";
            tr += "    <div>";
            tr += "        <label class='text-center text-white' col-form-label id='tituloTxtLabel'>" + value.nombre + "</label>";

            tr += "    </div>";
            tr += "    <div>";
            tr += "        <label class='col-form-label text-white' id='autorTxtLabel'>" + value.autor + "</label>";

            tr += "    </div>";

            tr += " </div>";

            tr += " <div class='card-body'>";
            tr += "    <div class='row'>";
            tr += "  <div class='col-md-3'></div>";

            tr += "  <div class='col-md-6 ' >";
            tr += "        <img class='align='center' src='" + value.url + "'  width='100%' heigh='100px' alt='card image'>";
            tr+="</div>";
            tr += " <div class='col-md-3'></div>";

            tr += "              </div>";
            tr +="<div style='margin-top:15px;'>"
            tr += "    <div id='Layer1' class='overflow-auto' style='width:100%; height:200px; overflow: scroll;' >";
            tr += "        <p class='p-0 text-white' id='descripciontxtCard' style='margin-top:10px;'>" + value.descripcion + "</p>";
            tr += "    </div>";
            tr+="</div>"
            tr += " </div>";




            tr += " </div>";

            $('#secciontabla').append(tr);

        });
    });
}

function comboMovimientos() {

    var bdMov = firebase.database().ref("movimiento");
    bdMov.on("value", function (datos) {
        console.log(datos.val());

        var data = datos.val();
        $('#comboMovimiento').children("option").remove();

        $.each(data, function (nodo, value) {

            var option = "";

            option += "<option value=" + value.idTema + "> " + value.nombre + "</option>";

            $('#comboMovimiento').append(option);

        });
    });
}

function subirImagen() {
    $("#imgFile").on('change', function () {

        var file;
        if ((file = this.files[0])) {

            fileGlobal = file;

        }
    });
}

function botonesImg() {
    $("#btnSeleccionarUrl").click(function () {
        console.log("desde btn");
        $("#url").attr("disabled", false);
        $("#seccionImgFile").hide();
    });

    $("#btnSeleccionarFile").click(function () {
        console.log("desde btn");
        $("#imgFile").attr("disabled", false);
        $("#seccionImgUrl").hide();
    });
}