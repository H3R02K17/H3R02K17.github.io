<?php
require_once('../libraries/phpqrcode/qrlib.php');
require_once('../conexion/validaciones.php');

class GeneratorQR extends Validator
{
    public static $filename = null;
    //La función recibe 2 valores, el usuario y el codigo
    function generadorQR($usuario, $codigo){
        //Usamos Try catch para capturar cualquier error en el momento de generar QR
        try {
            //Variable con la localiación donde se guardará el QR
            $dir = '../images/qr/';
            //Validamos si existe la ubicación, sino se creará
            if (!file_exists($dir)) {
                mkdir($dir);
            }
            //Obtenemos del usuario los valores antes del "@"
            $user = explode("@", $usuario);
            //Creamos un archivo con la dirección donde se guardará, el nombre del archivo y el tipo de extensión
            $filename = $dir . $user[0] . '.png';
            //Si un usuario generá un QR, solo se almacenará un QR por usuario
            if (file_exists($filename)){
                //Si existia la imagen se elimina
                unlink($filename);
            }
            //Si no existe se crea el QR con el nombre del usuario
            if (!file_exists($filename)) {
                //QRCODE recibe los siguientes valores(valor a imprimir, nombre de la imagen, calidad de QR, tamaño, borde del QR)
                QRcode::png($codigo, $filename, QR_ECLEVEL_Q, 10, 1);
            };
            //Guardamos en la variable Session el nombre del QR, se utiliza al momento de generarlo
            $_SESSION['filename'] = $user[0] . '.png';
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>




