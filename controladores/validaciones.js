//Metodo de validacion de no pegar texto en contraseña
function bloquearPegar (valor){
    //Array que almacena el valor del input que tendrá la propiedad de no pegar
    var imput = [];
    imput.push(document.getElementById(valor));
    imput.forEach(element => {
        element.onpaste = function (e) {
            e.preventDefault();
            Swal.fire({
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                title: 'Esta acción está prohibida',
                icon: 'error',
                color: '#ffffff',
                background: '#70393b',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: true,
                stopKeydownPropagation: false
            });
        }
    });
}