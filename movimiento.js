var urlGlobal = "";
var banderaImagenPorUrl = "";
var fileGlobal = "";
$(document).ready(function () {
    if (window.localStorage.getItem('emailUser') == "" || window.localStorage.getItem('emailUser') == null || window.localStorage.getItem('emailUser') == undefined) {
        window.location = "login.html";
    } else {
        $("#user").text(window.localStorage.getItem("emailUser"));
        cerrarSesion();
        botonesImg();
        subirRegistroSeleccion();
        $("#formulario").hide();

        $("#btnNuevoMovimiento").click(function () {
            $("#formulario").show();

        });
        $("#btnCancelar").click(function () {
            $("#seccionUrl").show();
            $("#seccionImgUrl").show();
            $("#imgFile").attr("disabled", true);
            $("#imgUrl").attr("disabled", true);
            $("#formulario").hide();
        });
        $("#btnObras").click(function () {
           window.location = "index.html";
        });
        /** FIREBASE SECCION**/
        db = firebase.database().ref("movimiento");
        storageService = firebase.storage();
        traerDatos();
        capturamosImagen();
    }
});

function subirRegistro() {
    var nombre = $("#nombre").val();
    var descripcion = $("#descripcion").val();
    


    var ref = db;
    var id = ref.push();
    console.log(id.getKey());
    var idRegistro = id.getKey();
    
    db.child(idRegistro).set({
        descripcion: descripcion,
        idTema: idRegistro,
        nombre: nombre,
        url: urlGlobal
    });

    
    $("#secciontabla").children("div").remove();
    $("#formulario").hide();
    traerDatos();
   alert("guardado correctamente");
    
}

function capturamosImagen() {


    $("#imgFile").on('change', function () {

        var file;
        if ((file = this.files[0])) {

            fileGlobal = file;

        }


    });
}
function botonesImg() {
    $("#btnSeccionUrl").click(function () {
        $("#imgUrl").attr("disabled", false);
        $("#seccionImgUrl").hide();
        banderaImagenPorUrl = true;
    });

    $("#btnSeccionFile").click(function () {
        $("#imgFile").attr("disabled", false);

        $("#seccionUrl").hide();
        banderaImagenPorUrl = false;

    });
}
function subirRegistroSeleccion() {

    $("#btnGuardar").click(function () {

        if (banderaImagenPorUrl == true) {
            
            urlGlobal = $("#imgUrl").val();
            subirRegistro();
        } else {
            

            subirArchivo(fileGlobal);
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
            tr += "<label class='btn btn-danger ' id='" + value.idTema + "'  data-url =" + value.url + " onClick='eliminarRegistro(this)')>Eliminar</label>"
            tr += "</div>"
            tr += "   </div>";
            tr += "  </div>";


            $('#secciontabla').append(tr);

        });
    });
}
function eliminarRegistro(idRegistro) {
    var id = idRegistro.id;
  
    var url = $("#" + id).attr("data-url");
    console.log("url elimibnar... id " +id +"   "+ url)

    db.child(id).remove().then(function () {


        
        eliminarImagenDeStorage(url);
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

function eliminarImagenDeStorage(url) {
    console.log("eliminar storage")
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