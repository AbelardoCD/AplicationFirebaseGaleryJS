var db = "";
var fileGlobal = "";
var storageService = "";
var banderaImagenPorUrl = false;
/* se coloca como global ya que cambiara dependiendo si la url es directa o es obtenida despues de subir una imagen */
var urlGlobal = ""
$(document).ready(function () {

    if (window.localStorage.getItem('emailUser') == "" || window.localStorage.getItem('emailUser') == null || window.localStorage.getItem('emailUser') == undefined) {
        window.location = "login.html";
    } else {
        $("#formulario").hide();
        botonesImg();
        cerrarSesion();
        $("#btnNuevaObra").click(function () {

            $("#formulario").show();


        });
        $("#btnCancelar").click(function () {

            $("#formulario").hide();


        });
        $("#btnMovimientos").click(function () {

            window.location ="movimiento.html";


        });
        var user = window.localStorage.getItem('emailUser');

        $("#user").text(user)
        db = firebase.database().ref("obras");
        storageService = firebase.storage();
        capturamosImagen();
        traerDatos();

        comboMovimientos();
        subirRegistroSeleccion();


        eliminarImagenDeStorage();




    }
});

function subirRegistroSeleccion() {

    $("#btnGuardar").click(function () {

        if (banderaImagenPorUrl == true) {
            console.log("directo subir registro");
            urlGlobal = $("#url").val();
            subirRegistro();
        } else {
            console.log("se dispara subir archivo");

            subirArchivo(fileGlobal);
        }

    });

}
function asignarMovimientoAObra(idObra, idmovimiento) {
    console.log(idObra + "  " + idmovimiento);
    var ref = firebase.database().ref("movimiento").child(idmovimiento).child("obrasAsignadas").child(idObra).set(true);
    alert("Guardado correctamente")

}
function traerDatos() {


    db.on("value", function (data) {

        var datos = data.val()
        //console.log(datos)
        $.each(datos, function (nodo, value) {
            //   console.log(value.nombre)
            var tr = "";

            tr += " <div class='row mt-1'id='carta'>";
            tr += "  <div class='col-md-4 mt-2 mb-2'>";
            tr += "     <img width='70%' src='" + value.url + "' >";
            tr += "   </div>";
            tr += "  <div class='col-md-8 mt-3'>";
            tr += "      <label class='col-form-label font-italic text-white text-xl-center'>" + value.nombre + "</label>";
            tr += "<div id='Layer1' class='overflow-auto' style='width:100%; height:200px; overflow: scroll;' >";
            tr += "      <p class='text-justify text-white p-2'>" + value.descripcion + "</p>";
            tr += "</div>";
            tr += "<div  class='row' style='margin-top:10px;'>";
            tr += "<label class='btn btn-danger ' id='" + value.id + "' data-movimiento='" + value.idMovimiento + "' data-url =" + value.url + " onClick='eliminarRegistro(this)')>Eliminar</label>"
            tr += "</div>"
            tr += "   </div>";
            tr += "  </div>";


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



function botonesImg() {
    $("#btnSeleccionarUrl").click(function () {

        $("#url").attr("disabled", false);
        $("#seccionImgFile").hide();
        banderaImagenPorUrl = true;

    });

    $("#btnSeleccionarFile").click(function () {

        $("#imgFile").attr("disabled", false);
        $("#seccionImgUrl").hide();
        banderaImagenPorUrl = false;

    });
}



function capturamosImagen() {


    $("#imgFile").on('change', function () {

        var file;
        if ((file = this.files[0])) {

            fileGlobal = file;

        }


    });
}
function subirArchivo(archivo) {
    console.log("archivo desde subir  " + archivo);
    // creo una referencia al lugar donde guardaremos el archivo
    var refStorage = storageService.ref('imagesObras').child(archivo.name);
    // Comienzo la tarea de upload
    var uploadTask = refStorage.put(archivo);

    // defino un evento para saber qué pasa con ese upload iniciado
    uploadTask.on('state_changed', null,
        function (error) {
            console.log('Error al subir el archivo', error);
        },
        function () {
            console.log('img subida completada');

            var url = uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                urlGlobal = url;

                subirRegistro()



            });

        }
    );
}

function subirRegistro() {
    var nombre = $("#nombre").val();
    var autor = $("#autor").val();
    var descripcion = $("#descripcion").val();
    var idMovimiento = $("#comboMovimiento").val();


    var ref = db
    var id = ref.push()
    console.log(id.getKey())
    var idRegistro = id.getKey()
    db.child(idRegistro).set({
        autor: autor,
        descripcion: descripcion,
        id: idRegistro,
        nombre: nombre,
        url: urlGlobal,
        idMovimiento: idMovimiento
    });

    asignarMovimientoAObra(idRegistro, idMovimiento);

    $("#secciontabla").children("div").remove();
    traerDatos();
    $("#formulario").hide();
}

function eliminarRegistro(idRegistro) {
    var id = idRegistro.id;
    var idMov = $("#" + id).attr("data-movimiento");
    var url = $("#" + id).attr("data-url");
    console.log("url elimibnar... " + url)

    db.child(id).remove().then(function () {


        eliminarRelacionColeccionMovimiento(idMov, id, url);
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

function eliminarRelacionColeccionMovimiento(idMov, idObra, url) {
    var ref = firebase.database().ref("movimiento").child(idMov).child("obrasAsignadas").child(idObra).remove().then(function () {

        eliminarImagenDeStorage(url);
    }).catch(function (error) {
        console.error("Error removing document: " + error);
    });
}


function eliminarImagenDeStorage(url) {
    var img = url;
    var refStorage = storageService.refFromURL(img);

    refStorage.delete().then(function () {
        $("#secciontabla").children("div").remove();
        traerDatos();
        alert("Registro eliminado");


    }).catch(function (error) {
        $("#secciontabla").children("div").remove();
        traerDatos();
        alert("error" + error);

    });


}

function cerrarSesion() {

    $("#btnCerrarSesion").click(function () {

        console.log("remove sesion");

        window.localStorage.removeItem('emailUser');

        window.location = "login.html";


    });
}