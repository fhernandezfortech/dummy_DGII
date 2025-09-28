/*Colocar aqui solo funcionalidades genericas*/

let spinner = $('#loader');

/*Use esta fución en los casos que desea mentener el flujo MVC normal*/
$('.formSubmit').submit(function (e) {
    spinner.show(); //al recargar la página el div que contiene el spinner volverá a su estado original
});