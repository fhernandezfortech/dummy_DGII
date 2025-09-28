// class Representante {

//     constructor(rnc, razonSocial, pasaporte) {
//         this.rncRepresentante = rnc;
//         this.razonSocialRepresentante = razonSocial;
//         this.pasaporte = pasaporte;
//     }
// }

// class Contribuyente {
//     constructor(rnc, nombre, telefono, celular, direccion, provincia, municipio, sector, correo, pasaporte) {
//         this.rnc = rnc;
//         this.nombre = nombre;
//         this.telefono = telefono;
//         this.celular = celular;
//         this.direccion = direccion;
//         this.provincia = provincia;
//         this.sector = sector;
//         this.correo = correo;
//         this.municipio = municipio;
//         this.pasaporte = pasaporte;
//     }
// }

// class RepresentanteService {

//     constructor() {
//         var localUrl = window.location.href;
//         this.baseHref = localUrl.replace(localUrl.split('/').pop(), "")
//     }

//      async loadAll(rnc) {
//         var representantes = new Array();
//         await $.get(`${this.baseHref}Representantes`, { rnc: rnc },
//             (data) => {
//                 if (data != null && data.representantes != null) {
//                     data.representantes.map(r => representantes.push(this.mapRepresentantesData(r)));
//                 }
//             }).promise();
//         return representantes;
//     }

//     mapRepresentantesData(data) {
//         return new Representante(data.rncRepresentante.toString(), data.razonSocialRepresentante, data.pasaporte);
//     }

//     async getDatosContribuyenteRepresentante(rnc) {
//         let contribuyente = null;
//         try {
//             await $.get(`${this.baseHref}GetContribuyente`, { rnc: rnc },
//                 (data) => {
//                     let direcciones = data.direcciones == null ? "" : data.direcciones[0];
//                     let telefono = direcciones.telefono && direcciones.telefono[0] ? direcciones.telefonos[0].telefono : "";
//                     let celular = "";
//                     let direccion =  direcciones == null ? "" :  direcciones.direccion;
//                     let provincia = direcciones.provincia ? direcciones.provincia : "";
//                     let municipio = direcciones.nombreMunicipio ? direcciones.nombreMunicipio : "";
//                     let sector = data.sectorContribuyente;
//                     let correo = data.correoElectronicoContribuyente;
//                     let pasaporte = data.pasaporte ? data.pasaporte : "";

//                     contribuyente = new Contribuyente(data.rncCedula.toString(), data.nombreContribuyente.toString(),
//                         telefono, celular, direccion, provincia, municipio, sector, correo, pasaporte);
//                 }).promise();
//         } catch (e) {
//             contribuyente = null;
//         }
//         return contribuyente;
//     }
// }

// $(function () {

//     var defaultOption = $('<option value = "">- Seleccione alguno de los representantes disponibles -</option>');
//     let representanteService = null;
//     var representantesEncontrados = new Array();
//     var representanteRelacionados = new Array();
//     var spinner = $('#loader');

//     !function init() {

//         representanteService = new RepresentanteService();

//         $('#RepresentanteAsociado').html("");
//         $('#RepresentanteAsociado').append(defaultOption);
//         $('#representantes_section input[type="text"]').val("");

//         var rnc = $('#rncAutenticado').val();

//         ClearRepresentanteFields();

//         representanteService.loadAll(rnc).then(r => r.map(rep => mapRepresentantesData(rep)));
//     }();

//     function mapRepresentantesData(representante) {
//         representantesEncontrados.push(representante.rncRepresentante.toString());
//         representanteRelacionados.push(representante);
//         $('#RepresentanteAsociado').append(getOption(representante));
//     }

//     function getOption(representante) {
//         return $(`<option value = ${representante.rncRepresentante.toString()}>${representante.razonSocialRepresentante}</option>`);
//     }

//     $('#RepresentanteAsociado').on('change', function (e) {
//         let rnc = $(this).val();
//         habilitaralertaRepresentante(true);
//         habilitaralertaSoftware(true);
//         spinner.show();

//         if (!rnc) {
//             $('#representantes_section input[type="text"]').val("");
//             habilitarGeneracionXml(false);
//             ClearRepresentanteFields();
//             spinner.hide();
//         } else {
//             var representanteEncontrado = representantesEncontrados.filter(r => r == rnc);
//             var representanteSeleccionado = representanteRelacionados.filter(c => c.rncRepresentante == rnc);
//             if (representanteEncontrado.length <= 0) {
//                 spinner.hide();
//                 $('#representantes_section input[type="text"]').val("");
//                 habilitarGeneracionXml(false);
//                 ClearRepresentanteFields();
//                 return;
//             }
//             representanteService.getDatosContribuyenteRepresentante(rnc)
//                 .then(r => {

//                     if (r != null) {
//                         r.pasaporte = representanteSeleccionado[0].pasaporte;
//                         fillRepresentanteFields(r);
//                         habilitarGeneracionXml(true);
//                     } else {
//                         $('#representantes_section input[type="text"]').val("");
//                         habilitarGeneracionXml(false);
//                         ClearRepresentanteFields();

//                     }

//                     spinner.hide();
//                 });
//         }

//         e.preventDefault();
//     });

//     function fillRepresentanteFields(representante) {
//         $('input[name="Representante.RNCRepresentante"]').val(representante.rnc);
//         $('input[name="Representante.NombreRepresentante"]').val(representante.nombre);
//         $('input[name="Representante.TelefonoRepresentante"]').val(representante.telefono);
//         $('input[name="Representante.CelularRepresentante"]').val(representante.celular);
//         $('input[name="Representante.DireccionRepresentante"]').val(representante.direccion);
//         $('input[name="Representante.ProvinciaRepresentante"]').val(representante.provincia);
//         $('input[name="Representante.MunicipioRepresentante"]').val(representante.municipio);
//         $('input[name="Representante.SectorRepresentante"]').val(representante.sector);
//         $('input[name="Representante.CorreoElectronicoRepresentante"]').val(representante.correo);
//         $('input[name="Representante.PasaporteRepresentante"]').val(representante.pasaporte);
//     }
//     function ClearRepresentanteFields() {
//         $('input[name="Representante.RNCRepresentante"]').val("");
//         $('input[name="Representante.NombreRepresentante"]').val("");
//         $('input[name="Representante.TelefonoRepresentante"]').val("");
//         $('input[name="Representante.CelularRepresentante"]').val("");
//         $('input[name="Representante.DireccionRepresentante"]').val("");
//         $('input[name="Representante.ProvinciaRepresentante"]').val("");
//         $('input[name="Representante.MunicipioRepresentante"]').val("");
//         $('input[name="Representante.SectorRepresentante"]').val("");
//         $('input[name="Representante.CorreoElectronicoRepresentante"]').val("");
//         $('input[name="Representante.PasaporteRepresentante"]').val("");
//     }

//     function habilitarGeneracionXml(habilitar)
//     {

//         if (habilitar) {
//             $('#btnGenerarArchivoValidaciones').prop('disabled', false);
//             $('#AlertarRepresentante').hide();
//         }
//         else {
//             $('#AlertarRepresentante').show();
//             $('#btnGenerarArchivo').prop('disabled', true);
//         }
//     }
// });
