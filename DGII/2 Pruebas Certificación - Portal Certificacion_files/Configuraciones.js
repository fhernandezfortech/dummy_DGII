var spinner = $('#loader');
var modalCambiarClave = $('#modalCambiarClave');
var modalConfirmNuevaPostulacion = $('#modalConfirm');
var labelErrores = $("#mensajeErrorCambiarClave");
    labelErrores.hidden = true;
 
$('#formularioCambiarClave').submit(function (e) {
    e.preventDefault();
    var form = $(this);
    form.removeClass('was-validated');
    //Se confirma que el formulario sea valido antes de producir el submit
    if (form[0].checkValidity() === false) {
        e.stopPropagation();
    } else {
        spinner.show();
        var url = form.attr('action');
        $.ajax({
            url: url,
            method: 'post',
            data: form.serialize()
        }).done(function (resp) {
            spinner.hide();
            if (resp.success) {
               
                cerrarYLimpiarModal();
                toastr.success(resp.successMessage,
                    toastr.options = {
                        "positionClass": "toast-top-full-width",
                        "fadeIn": 300,
                        "fadeOut": 100,
                        "timeOut": 3000,
                        "extendedTimeOut": 1000
                    });
                    Refresh();

            } else {

                //toastr.error(resp.error, toastr.options = {
                //    "positionClass": "toast-top-full-width",
                //    "fadeIn": 300,
                //    "fadeOut": 100,
                //    "timeOut": 3000,
                //    "extendedTimeOut": 1000
                //});
                //Refresh();
                //Se utiliza el enum de errores de cambio de clave para determinar del lado cliente cuando se producen algunos
                //errores en espesifico para ofrecer una mejor experiencia al usuario
                switch (resp.code) {
                    case 'ClaveIncorrecta':                             
                        $('#clave').val('');
                        $('#claveInvalida').html(resp.error).css('color', 'red');
                        $('#claveInvalida').show();                    
                        break;

                    case 'ClaveIgualAlaAnterior':
                        $('#nuevaClave').val('');
                        $('#repeticionClave').val('');
                        $('#repeticionClaveValida').html('');
                        $('#nuevaClaveInvalida').html(resp.error).css('color', 'red');
                        $('#nuevaClaveInvalida').show();
                        break;

                    default:
                        labelErrores.hidden = false;
                        labelErrores.text(resp.error);
                        break;
                }
                Refresh();
            }
        });
    }
    form.addClass('was-validated');
});

function cerrarYLimpiarModal() {
    document.getElementById("message").style.display = "none";
    modalCambiarClave.modal('hide');
    //var form = $('#formularioCambiarClave')[0];
    $("#formularioCambiarClave").removeClass("was-validated");   
  //  form.reset();
    $("#clave").val('');
    $("#nuevaClave").val('');
    $("#repeticionClave").val('');
    $("#repeticionClaveValida").css("display", "none");
    $("#nuevaClaveValida").css("display", "none");
    $("#repeticionClaveInValida").css("display", "none");
    $("#nuevaClaveInvalida").css("display", "none");
  
    letter.classList.add("invalid");
    capital.classList.add("invalid");
    number.classList.add("invalid");
    length.classList.add("invalid");

    $('.pwds').removeClass('is-invalid');

    labelErrores.text('');
}

 
 

$(document).on("click", "#itemCambiarClave", function () {
    //Se detiene el refresh debido a que hay paginas que usan esta utilidad con el meta 
    window.stop();
    modalCambiarClave.modal('show');
});

$(document).on("click", "#btnCerrarModal", function () {
    cerrarYLimpiarModal();
    Refresh();
});

$(document).on("click", "#btnCancelar", function () {
    cerrarYLimpiarModal();
    Refresh();
});


//Funcion para refrecar la pagina en los casos que exista un meta para refrescar
function Refresh() {
    window.resetId = 0;
    if (document.querySelector('meta[http-equiv="refresh"]') != undefined && document.querySelector('meta[http-equiv="refresh"]').content.length !== 0) {
        var timeoutPeriod = document.querySelector('meta[http-equiv="refresh"]').content;
        window.resetId = setTimeout("location.reload(true);", timeoutPeriod);
    }

}


//Validación para los requerimentos de la clave 
var nuevaClaveInput = document.getElementById("nuevaClave");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// Cuando el usuario haga clic en el campo de contraseña, muestre el cuadro de mensaje
nuevaClaveInput.onfocus = function () {
    document.getElementById("message").style.display = "block";
}

// Cuando el usuario hace clic fuera del campo de contraseña, oculta el cuadro de mensaje
nuevaClaveInput.onblur = function () {
    document.getElementById("message").style.display = "none";
}

// Cuando el usuario comienza a escribir algo dentro del campo de contraseña
nuevaClaveInput.onkeyup = function () {
    // Validar letras minúsculas
    var lowerCaseLetters = /[a-z]/g;
    if (nuevaClaveInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validar letras mayúsculas
    var upperCaseLetters = /[A-Z]/g;
    if (nuevaClaveInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    //Validar números
    var numbers = /[0-9]/g;
    if (nuevaClaveInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validar longitud
    if (nuevaClaveInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

//Validar que la clave y la confirmacion de clave coincidan
$('#nuevaClave, #repeticionClave').on('keyup', function () {
    var passAfterValid = true;
    if ($('#nuevaClave').val() != undefined && $('#nuevaClave').val() != '') {
       
        if (letter.classList.contains('invalid') ||
            capital.classList.contains('invalid') ||
            number.classList.contains('invalid') ||
            length.classList.contains('invalid')) {
            $("#btnSubmitFormularioCambioClave").attr("disabled", true);
            $('#nuevaClaveInvalida').show();
            $('#nuevaClaveInvalida').val('');
            $('#nuevaClaveInvalida').html('La contraseña no cumple con el estándar esperado.').css('color', 'red');
            $('#repeticionClaveInValida').hide();
            $("#nuevaClaveInvalida").css("display", "block");
            $("#nuevaClaveValida").css("display", "none");
            passAfterValid = false;
        }
        else if ($('#nuevaClave').val() == $('#clave').val()) {
            $("#btnSubmitFormularioCambioClave").attr("disabled", true);
            $('#nuevaClaveInvalida').show();
            $('#nuevaClaveInvalida').val('');
            $('#nuevaClaveInvalida').html('La nueva contraseña no puede ser igual a la anterior').css('color', 'red');
            $("#nuevaClaveInvalida").css("display", "block");
            $("#nuevaClaveValida").css("display", "none");
            $('#repeticionClaveInValida').hide();
            passAfterValid = false;
        }
        else {
            $("#nuevaClaveInvalida").css("display", "none");
            $("#nuevaClaveValida").css("display", "block");
            passAfterValid = true;
        }
    }

    if ($('#nuevaClave').val() != undefined && $('#repeticionClave').val() != undefined && $('#nuevaClave').val() != '' && $('#repeticionClave').val() != '') {            

        if ($('#nuevaClave').val() != $('#repeticionClave').val()) {
            $("#btnSubmitFormularioCambioClave").attr("disabled", true);
            $('#repeticionClaveValida').hide();
            $('#nuevaClaveInvalida').hide();
            $('#repeticionClaveInValida').show();
            $('#repeticionClaveInValida').html('La nueva contraseña y su repetición no coinciden, favor reintentarlo.').css('color', 'red');
            $('.pwds').addClass('is-invalid')
        } else if (passAfterValid == true) {
            $("#btnSubmitFormularioCambioClave").attr("disabled", false);
            $('#repeticionClaveValida').show();
            $('#repeticionClaveInValida').hide();
            $('#repeticionClaveValida').html('La nueva contraseña y su repetición coinciden').css('color', 'green');
            $('.pwds').removeClass('is-invalid');
        }
    }
});


$('#formularioConfirm').submit(() => {
    
    spinner.show();
    var url = form.attr('action');

    $.ajax({
        url: url,
        method: 'get',
        data: form.serialize()
    }).done(function (resp) {       
        spinner.hide();        
    }).error(function (err) {    
        spinner.hide();
    });
});

$("#NuevaPostulacionId").on("click", () => {
    $("#alertMessageH").hide();    
});

$(document).ready( function () {
    $("#alertMessageH").show();
    if ($("#MensajeErrorId")[0] == undefined) {
        return;
    }   
    let mensaje = $("#MensajeErrorId")[0].innerText;
   
    verificarMensajeErrorMostrar(mensaje);

    function verificarMensajeErrorMostrar(mensaje) {
        if (mensaje != undefined && mensaje != null && mensaje != "") {          
            modalConfirmNuevaPostulacion.modal('show');
        }
       
    }
        
});

$("#btnCancelarPostulacion").click(() => {
    window.stop();
    $('#MensajeRespuesta').text("")
    
    $("#dropMotivoCancelacion").find("option")[0].removeAttribute('hidden');
    $("#dropMotivoCancelacion").find("option")[0].removeAttribute('disabled');
    $("#dropMotivoCancelacion").find("option")[0].selected = true;
});

$('#btnSalirCancelarPostulacion').click(() => {   
    Refresh();
})

$("#frmCancelarPostulacion").submit((e) => {
    
    let valInicial = $("#dropMotivoCancelacion").find("option")[0].innerText;
    let valSelect = $("#dropMotivoCancelacion").find("option:selected")[0];
    if (valInicial == valSelect.innerText) {
        valSelect = "";
    }
    $('#MensajeRespuesta').text("");
    e.preventDefault();
   
    var valMotivo = valSelect.value;
    if (!ValidarMotivo(valMotivo)) return;
    var frmCancelar = $("#frmCancelarPostulacion");
 
    spinner.show();
    var urlCancelar = frmCancelar.attr('action');
  
    $.ajax({
        url: urlCancelar,
        method: 'post',
        data: { motivo: valMotivo }
    }).done((resp) => {
        
        if (resp.operacionCompletada) {                         
                spinner.hide();
                 RedirectToHome();
           }
           else {
                $('#MensajeRespuesta').text(resp.mensaje)
                spinner.hide();
            }       
    })
    .fail(() => {
        spinner.hide();
    })
    spinner.hide();
});

function RedirectToHome() { 
    let link = $("#linkRedirectHome");
    let url = link.attr('href');
    window.location.href = url
}

function ValidarMotivo(motivo) {
    if (motivo == undefined || motivo == "" || motivo < 1) {
        $("#dropMotivoCancelacion").removeClass("valid")
        $("#dropMotivoCancelacion").addClass("invalid")
        $('#MensajeRespuesta').text("La Justificación es requerida")
        return false;
    }
    
    $("#txtMotivo").removeClass("invalid")
    $("#txtMotivo").addClass("valid")
    return true;
}

$("#btnRetornarPostulacion").click(() => {
    window.stop();
    $("#txtMotivoR").val("");
    $('#MensajeRespuestaR').text("")
    $("#txtMotivoR").removeClass("invalid")
    $("#txtMotivoR").removeClass("valid")
});

$('#btnSalirRetornarPostulacion').click(() => {
    location.reload();
})

$("#frmRetornarPostulacion").submit((e) => {
    $('#MensajeRespuestaR').text("");
    e.preventDefault();

    var valMotivoR = $("#txtMotivoR").val();

    var valEstadoPostulacion = $("#IdEstado").val();
    if (!ValidarMotivoRetorno(valMotivoR)) return;
    var frmRetornar = $("#frmRetornarPostulacion");

    spinner.show();
    var urlRetorno = frmRetornar.attr('action');

    $.ajax({
        url: urlRetorno,
        method: 'post',
        data: { estado: valEstadoPostulacion, motivo: valMotivoR }
    }).done((resp) => {
       
        if (resp.operacionCompletada) {
            spinner.hide();
            Refresh();
            location.reload();        
        }
        else {
            $('#MensajeRespuestaR').text(resp.mensaje)
            spinner.hide();
        }
    })
        .fail(() => {
            spinner.hide();
        })
});
function ValidarMotivoRetorno(motivo) {
   
    if (motivo == undefined || motivo == "") {
        $("#txtMotivoR").removeClass("valid")
        $("#txtMotivoR").addClass("invalid")
        $('#MensajeRespuestaR').text("La Justificación es requerida")
        return false;
    }
    if (motivo.length < 50 | motivo.length > 500) {
        $("#txtMotivoR").removeClass("valid")
        $("#txtMotivoR").addClass("invalid")
        $('#MensajeRespuestaR').text("La Justificación debe de tener de 50 a 500 caracteres")
        return false;
    }
    $("#txtMotivoR").removeClass("invalid")
    $("#txtMotivoR").addClass("valid")
    return true;
}

async function PaginacionLoad(postulacionid, tipoproceso, numeropagina) {

    var localUrl = window.location.href;
    var _url = localUrl.replace(localUrl.split('/').pop(), "CallLogProcesosViewComponent")
  
    await $.ajax({
        type: "GET",
        url: _url,
        data: { postId: postulacionid, tProceso: tipoproceso, numPag: numeropagina },
        success: function (result) {
            
            return $("#tblLogs").html(result);
        },
        fail: function (err) {
        }
    });
    
}

$('#btnConfirmar').click(function (e) {
    e.preventDefault();
    var form = $('#frmConfirmarUrlProduccion');
    $("#alertErrorMensaje").css("display", "none");

    //Se confirma que el formulario sea valido antes de producir el submit
    if (form[0].checkValidity() === false) {
        e.stopPropagation();
    } else {
        spinner.show();
        var url = form.attr('action');
        $.ajax({
            url: url,
            method: 'post',
            data: form.serialize()
        }).done(function (resp) {         
            if (!resp.success) {
                spinner.hide();
                $("#alertErrorMensaje").css("display", "block");                             
                let lblErrorM = document.getElementById("labelErrorMensaje");
                lblErrorM.innerHTML = resp.error == null ? "" : resp.error;
                
            } else {
                spinner.hide();
                location.reload();
                $("#alertErrorMensaje").css("display", "none");               
            }
            spinner.hide();     
        });
    }
});

$('#btnEnviarDeclaracionJurada').click(() => {
    spinner.show();
    var form = $("#frmGuardarDeclaracionJurada");

    $.ajax({
        method: form.attr('method'),
        data: form.serialize()
    }).done(function (resp) {
        spinner.hide();
    }).fail(function (err) {
        spinner.hide();
    });
});

$("#dropMotivoCancelacion").on("click", function () {
    let valInicial = $(this).find("option")[0].innerText;
    let valSelect = $(this).find("option:selected")[0].innerText;
    if (valInicial != valSelect) {
        $(this).find("option")[0].setAttribute('disabled', 'disabled');
        $(this).find("option")[0].setAttribute('hidden', 'true');       
    }
});

$("#frmGuardarFacturaConsumo").submit( async (e) => {
  
        e.preventDefault();
        spinner.show();
        window.stop();

        var localUrl = window.location.href;
        var _url = localUrl.replace(localUrl.split('/').pop(), "GuardarFacturaConsumo")
        var $file = document.getElementById('uploadArchivoFactura');
        $formData = new FormData();

        if ($file.files.length > 0) {
            $formData.append('uploadArchivoFactura', $file.files[0]);
        }

        await $.ajax({
            url: _url,
            method: 'post',
            data: $formData,
            contentType: false,
            processData: false
        })
        .done((resp) => {                  
            spinner.hide();
            Refresh();
            location.reload();
        })
        .fail(() => {        
            spinner.hide();
            Refresh();
            location.reload();
        })
    spinner.hide();
    Refresh();
});

$("#uploadArchivoFactura").change(() => {

    $("#btnEnviarArchivoFactura").prop("disabled", false);
    if ($('#uploadArchivoFactura').get(0).files.length === 0) {
        $("#btnEnviarArchivoFactura").prop("disabled", true);
        Refresh();
    } else { window.stop();}
})

$("#uploadArchivoFactura").click(() => {
    window.stop();  
})

$("#btnDescargarSetComprobantes").click(async (e) => {

    e.preventDefault();
    spinner.show();
    window.stop();

    var localUrl = window.location.href;
    var _url = localUrl.replace(localUrl.split('/').pop(), "DescargarSetDatos")
    
    await $.ajax({
        url: _url,
        method: 'get'
    })
        .done((resp) => {           
            
            spinner.hide();
            window.location.href = _url;
            setInterval(() => { Refresh(); }, 10000);            
        })
        .fail(() => {
            spinner.hide();
           Refresh();
        })
    spinner.hide();
    setInterval(() => { Refresh(); }, 10000);
});

$("#frmGuardarFacturaConsumoSimulacion").submit(async (e) => {

    e.preventDefault();
    spinner.show();
    window.stop();
    debugger
    var localUrl = window.location.href;
    var _url = localUrl.replace(localUrl.split('/').pop(), "GuardarFacturaConsumoSimulacion")
    var $file = document.getElementById('uploadArchivoFacturaSimulacion');
    $formData = new FormData();

    if ($file.files.length > 0) {
        $formData.append('uploadArchivoFacturaSimulacion', $file.files[0]);
    }

    await $.ajax({
        url: _url,
        method: 'post',
        data: $formData,
        contentType: false,
        processData: false
    })
        .done((resp) => {
            debugger
            spinner.hide();
            Refresh();
            location.reload();
        })
        .fail(() => {
            
            spinner.hide();
            Refresh();
            location.reload();
        })
    debugger
    spinner.hide();
    Refresh();
});

$("#uploadArchivoFacturaSimulacion").change(() => {

    $("#btnEnviarArchivoFacturaSimulacion").prop("disabled", false);
    if ($('#uploadArchivoFacturaSimulacion').get(0).files.length === 0) {
        $("#btnEnviarArchivoFacturaSimulacion").prop("disabled", true);
        Refresh();
    } else { window.stop(); }
})

$("#uploadArchivoFacturaSimulacion").click(() => {
    window.stop();
})

$("#btnDescargarSetComprobantesAC").click(async (e) => {

    e.preventDefault();
    spinner.show();
    window.stop();

    var localUrl = window.location.href;
    var _url = localUrl.replace(localUrl.split('/').pop(), "DescargarSetDatosACECF")

    await $.ajax({
        url: _url,
        method: 'get'
    })
        .done((resp) => {

            spinner.hide();
            window.location.href = _url;
            setInterval(() => { Refresh(); }, 10000);
        })
        .fail(() => {
            spinner.hide();
            Refresh();
        })
    spinner.hide();
    setInterval(() => { Refresh(); }, 10000);
});

$("#inputRncProveedor").change(async (e) => {
    e.preventDefault();
    Habilitar_DeshabilitarCamposProveedor(true)
    var rncProveedor = $("#inputRncProveedor").val();
    var rncCopy = $("#inputRncProveedorCopy").val();
    if (rncProveedor == rncCopy) return;

    $("#inputRncProveedorCopy").val(rncProveedor);
    debugger
    if (rncProveedor == null || rncProveedor == "" || rncProveedor.length < 9 || rncProveedor.length > 11) {        
        Habilitar_DeshabilitarCamposProveedor(true);
        return;
    }

    spinner.show();
    var localUrl = window.location.href;
    var _url = localUrl.replace(localUrl.split('/').pop(), "FoundContribuyenteRegistroApim")
 
    if (rncProveedor == null || rncProveedor == "") { spinner.hide(); return; }
   
    await $.ajax({
        url: _url,
        data: { rnc: rncProveedor },
        method: 'get'
    })
        .done((resp) => {
            if (resp.data != null) {
                $("#inputRncProveedorCopy").val(resp.data.rncCedula)
                $("#inputRazonSocialProveedor").val(resp.data.nombreRazonSocial)
                $("#inputNombreComercialProveedor").val(resp.data.nombreComercial)
                Habilitar_DeshabilitarCamposProveedor(false)
            }
            else {                
                Habilitar_DeshabilitarCamposProveedor(true)
                $("#lblRncProveedorSoftware").text("El RNC/Cédula no se encuentra registrado");
            }

            spinner.hide();
        })
        .fail(() => {
            spinner.hide();
        })
    spinner.hide();
    return;
})

function habilitaralertaRepresentante(habilitar) {
    if (habilitar) {
        $("#lblRncRepresentante").attr("hidden", true); $("#AlertarRepresentanteErrores").attr("hidden", true);
        $("#lblnombreRepresentante").attr("hidden", true); $("#AlertarRepresentanteErrores").attr("hidden", true);
        $("#lblCorreoRepresentante").attr("hidden", true); $("#AlertarRepresentanteErrores").attr("hidden", true)
    }
    else {
        $("#lblRncRepresentante").attr("hidden", false); $("#AlertarRepresentanteErrores").attr("hidden", false);
        $("#lblnombreRepresentante").attr("hidden", false); $("#AlertarRepresentanteErrores").attr("hidden", false);
        $("#lblCorreoRepresentante").attr("hidden", false); $("#AlertarRepresentanteErrores").attr("hidden", false)
    }
}

function habilitaralertaSoftware(habilitar) {
    if (habilitar) {

        $("#lblNombreSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblVersionSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblRncProveedorSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblRazonSocialProveedorSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
    }
    else {

        $("#lblNombreSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblVersionSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblRncProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false);
        $("#lblRazonSocialProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false);
    }
}

function Habilitar_DeshabilitarCamposProveedor(isHabilitar) {
    var inputRazonSocial = document.getElementById('inputRazonSocialProveedor');
    var inputNombreComercial = document.getElementById('inputNombreComercialProveedor');
    var inputRncProveedorSoftware = document.getElementById('inputRncProveedor');
    $("#lblRncProveedorSoftware").text("El RNC/Cédula requiere 9 u 11 dígitos");

    if (isHabilitar == false) {
        inputRazonSocial.readOnly = true;
        inputNombreComercial.readOnly = true;
        $("#lblRncProveedorSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
        $("#lblRazonSocialProveedorSoftware").attr("hidden", true); $("#AlertarSoftwareErrores").attr("hidden", true);
        inputRncProveedorSoftware.focus();
    }
    else
    {
        inputRazonSocial.readOnly = false;
        inputNombreComercial.readOnly = false;
        $("#lblRncProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false);
        $("#lblRazonSocialProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false);
        inputRazonSocial.value = "";
        inputNombreComercial.value = "";
        inputRncProveedorSoftware.focus();
    }
}

$('#btnGenerarArchivoValidaciones').click(async function (e) {
    e.preventDefault();
    var valor = $('input[name="EsNuevaPostulacion"]').val();
    var isrequerido = false;
    debugger
    $("#nuevaPostulacion").val(valor);
    habilitaralertaRepresentante(true);
    habilitaralertaSoftware(true);
    
    let rnc = $('input[name="Representante.RNCRepresentante"]').val();
    let nombre = $('input[name="Representante.NombreRepresentante"]').val();

    let seleccionTipoSoftware = $('#ddlTipoDesarrollo').val();
    let nombreSoftware = $('input[name="Software.NombreSoftware"]').val();
    let versionSoftware = $('input[name="Software.VersionSoftware"]').val();

    let softwareRncProveedor = $('#inputRncProveedor').val();
    let softwareRazonSocial = $('#inputRazonSocialProveedor').val();

    if (rnc == null || rnc == "") { $("#lblRncRepresentante").attr("hidden", false); $("#AlertarRepresentanteErrores").attr("hidden", false); isrequerido = true; };
    if (nombre == null || nombre == "") { $("#lblnombreRepresentante").attr("hidden", false); $("#AlertarRepresentanteErrores").attr("hidden", false); isrequerido = true; };

    if (nombreSoftware == null || nombreSoftware == "") { $("#lblNombreSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", true); isrequerido = true; };
    if (versionSoftware == null || versionSoftware == "") { $("#lblVersionSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", true); isrequerido = true; };
    
    if (seleccionTipoSoftware == 0) {
        if (softwareRncProveedor == null || softwareRncProveedor == "" || softwareRncProveedor.length < 9 || softwareRncProveedor.length > 11) { $("#lblRncProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false); isrequerido = true; };
        if (softwareRazonSocial == null || softwareRazonSocial == "") { $("#lblRazonSocialProveedorSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false); isrequerido = true; };
        if (nombreSoftware == null || nombreSoftware == "") { $("#lblNombreSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false); isrequerido = true; };
        if (versionSoftware == null || versionSoftware == "") { $("#lblVersionSoftware").attr("hidden", false); $("#AlertarSoftwareErrores").attr("hidden", false); isrequerido = true; };
    }

    if (isrequerido) return;
    else {
        $('#btnGenerarArchivo').click();
    }
});

