var loadingCC = $('#loader');
var modalOlvidoClave = $('#modalOlvidoClave');

$('#formularioLogin').submit(() => {    
    loadingCC.show();
    var formLogin = $("#formularioLogin");
    var url = formLogin.attr('action');
 
    $.ajax({
        url: url,
        method: 'post',
        data: formLogin.serialize()
    }).done(function (resp) {
        loadingCC.hide();
    });
});

$('#formularioOlvidoClave').submit(function (e) {
    e.preventDefault();
    var formOlvidoClave = $("#formularioOlvidoClave");
    formOlvidoClave.removeClass('was-validated');
    if (formOlvidoClave[0].checkValidity() === false) {
        e.stopPropagation();
    } else {
        loadingCC.show();
        var inputUsuarioModal = $('#inputUsuarioModal').val();
        var url = formOlvidoClave.attr('action');
        var data = { nombreUsuario: inputUsuarioModal };
        $.ajax({
            url: url,
            method: 'post',
            data: data
        }).done(function (resp) {
            loadingCC.hide();
            if (resp.estado) {
                LimpiarFormulario();
                $('#MensajeRespuesta').html(resp.mensaje).css('color', 'green');
            } else {
                $('#MensajeRespuesta').html(resp.mensaje).css('color', 'red');
            }
        }).fail(function (err) {
            loadingCC.hide();
        });
    };
    formOlvidoClave.addClass('was-validated');
});


function LimpiarFormulario() {
    let form = $('#formularioOlvidoClave')[0];
    $(form).removeClass('was-validated');
    form.reset();
}

function cerrarYLimpiarModal() {
    modalOlvidoClave.modal('hide');
    LimpiarFormulario();
    $('#MensajeRespuesta').html('');
}

$(document).on("click", "#btnCerrarModal", function () {
    cerrarYLimpiarModal();
});
$(document).on("click", "#btnCancelar", function () {
    cerrarYLimpiarModal();
});

$("#modalOlvidoClave").on('hidden.bs.modal', function () {
    cerrarYLimpiarModal();
});