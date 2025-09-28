// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
    bsCustomFileInput.init()
    $(".tipoSoftwareSelect").change();
    $(".tipoRegistroSelect").change();
})

//Formulario Postulación
$(".tipoSoftwareSelect").change(function () {
    if (this.value == "1" && !$("#proveedorFields").hasClass("d-none")) {
        $("#proveedorFields").addClass('d-none');
    }
    if (this.value == "0") {
        $("#proveedorFields").removeClass('d-none');
    }

});

$(".tipoRegistroSelect").change(function () {
    if (this.value == "1" && !$("#containerSoftwareVersionComprobantes").hasClass("d-none")) {
        $("#containerSoftwareVersionComprobantes").addClass('d-none');
    }
    if (this.value == "2") {
        $("#containerSoftwareVersionComprobantes").removeClass('d-none');
    }

});

$('#modalLog').on('show.bs.modal', function (e) {
    var postulacion = $(e.relatedTarget).data('postuacion-id');
    var etapa = $(e.relatedTarget).data('etapa-id');
   // $('#exampleModalCenter').modal('hide');
    //Llamada Ajax
    var options = { "backdrop": "static", keyboard: true };
    $.ajax({
        type: "GET",
        url: 'LogsPostulacion',
        contentType: "application/json; charset=utf-8",
        data: { "postulacionId": postulacion, "etapaId": etapa},
        datatype: "json",
        success: function (data) {
            
            $('#contenido').html(data);
            $('#modalLog').modal(options);
            $('#modalLog').modal('show');

        },
        error: function () {
            alert("No fue posible cargar la informacion.");
        }
    });


});


/** ----------Cert Flow Display-------------- **/
$('#cert-flow-btn').click(function () {
    $('.cert-flow').toggle();
});

