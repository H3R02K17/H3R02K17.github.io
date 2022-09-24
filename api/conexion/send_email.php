<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require('../libraries/phpmailer651/src/Exception.php');
require('../libraries/phpmailer651/src/PHPMailer.php');
require('../libraries/phpmailer651/src/SMTP.php');
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');

class Mailer extends Validator
{
    //Función para mandar mensaje en caso se siga intentando una contraseña incorrecta
    function sendMail($email)
    {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'koffisoft@gmail.com'; // Tu email
            $mail->Password = 'dsppvpbikaunhkzt'; // Tu gmail app contraseña
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->setFrom('koffisoft@gmail.com'); // Tu email
            $mail->addAddress($email);
            $mail->isHTML(true); // Si lo que se envia tiene formato HTML
            $mail->Subject = "Alerta de seguridad"; // Titulo del mensaje
            $mail->Body = "<!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <!--Informar al navegador que el sitio web está optimizado para dispositivos móviles-->
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            </head>
            <body>
                <div class='contenido_superior' style='background-color: #f3c6a5; text-align: center;'>
                    <img src='https://drive.google.com/uc?export=download&id=1uAmR2ruTF4hwTCt2dqbks3YbaBoBsczU' alt='image_koffi' style='width: 90px; height: 90px; margin-top: 10px; margin-bottom: 10px;'>
                </div>
                <div class='contenido_mensaje' style='font-family: sans-serif; color: #4a1f0e; background-color: #ffffff; text-align: center;'>
                    <h1>Se ha detectado actividad sospechosa</h1>
                    <p>Has usado todos los intentos de recuperación de contraseña y fue baneada por 24 horas, 
                        tendrás más intentos después del plazo de tiempo de espera. Si no fuiste tú el responsable 
                        de esta accción comunicate con un aministrador de KoffiSoft para revisar qué ocurrió...</p>
                </div>
                <div class='contenido_inferior' style='background-color: #4c070a; text-align: center;'>
                    <a href='#'><img src='https://drive.google.com/uc?export=download&id=1qClCJbYRBfx4TEL92ujbOZonHYW4otws'
                            alt='imagen_koffi_blanco' style='width: 90px; height: 90px; margin-top: 10px; margin-bottom: 10px;'></a>
                    <div class='redes' style='display:flex; width: 100% !important; justify-content: center !important; text-align: center;'>
                        <a href='https://www.facebook.com/Ikal-Caf%C3%A9-SV-1092973257539952'><img
                                src='https://drive.google.com/uc?export=download&id=1WkadUFiQ0qI6yM1k9q-zmo6FvajSVMkV'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                        <a href='https://www.instagram.com/ikalcafe_2019/'><img
                                src='https://drive.google.com/uc?export=download&id=1T_Qx-CH7-8hlOjVpgA3lgP-JFoUyE_si'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                        <a href='https://www.tiktok.com/@luluzc_z?is_from_webapp=1&sender_device=pc'><img
                                src='https://drive.google.com/uc?export=download&id=17_B8myczieAlnwraP_xE42cFBfPGa-9S'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                    </div>
                    <div class='terminos'>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Copyright © 2022 Koffi
                            Soft. Todos los derechos reservados</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Teléfono:
                            (503)2222-8888</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Correo electrónico:
                            koffisoft@gmail.com</p>
                        <br>
                    </div>
                </div>
            </body> 
            </html>";
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    //Función para mandar mensaje de recuperación de contraseña
    function codigoRecuperacion($email, $codigo)
    {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP(true);
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'koffisoft@gmail.com'; // Tu email
            $mail->Password = 'dsppvpbikaunhkzt'; // Tu gmail app contraseña
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->setFrom('koffisoft@gmail.com'); // Tu email
            $mail->addAddress($email);
            $mail->isHTML(true); // Si lo que se envia tiene formato HTML
            $mail->CharSet = "utf-8"; // Para que acepte caracteres especiales
            $mail->Subject = "Código de seguridad de la cuenta Koffi-Soft"; // Titulo del mensaje
            $mail->Body = "<!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <!--Informar al navegador que el sitio web está optimizado para dispositivos móviles-->
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            </head>
            
            <body>
                <div class='contenido_superior' style='background-color: #f3c6a5; text-align: center;'>
                    <img src='https://drive.google.com/uc?export=download&id=1uAmR2ruTF4hwTCt2dqbks3YbaBoBsczU' alt='image_koffi'
                        style='width: 90px; height: 90px; margin-top: 10px; margin-bottom: 10px;'>
                </div>
                <div class='contenido_mensaje'
                    style='font-family: sans-serif; color: #4a1f0e; background-color: #ffffff; text-align: center;'>
                    <h1>Código para recuperación de contraseña</h1>
                    <p>Aquí tienes el código de recuperación de tu cuenta Koffi-Soft:<br></p>
                    <h1><b>$codigo</b></h1>
                    <p>Úsalo para verificar que la cuenta te pertenece y poder realizar el cambio de contraseña.<br>Como medida de seguridad, el código caducará en 15 minutos.</p>
                </div>
                <div class='contenido_inferior' style='background-color: #4c070a; text-align: center;'>
                    <a href='#'><img src='https://drive.google.com/uc?export=download&id=1qClCJbYRBfx4TEL92ujbOZonHYW4otws'
                            alt='imagen_koffi_blanco' style='width: 90px; height: 90px; margin-top: 10px; margin-bottom: 10px;'></a>
                    <div class='redes' style='display:flex; width: 100% !important; justify-content: center !important; text-align: center;'>
                        <a href='https://www.facebook.com/Ikal-Caf%C3%A9-SV-1092973257539952'><img
                                src='https://drive.google.com/uc?export=download&id=1WkadUFiQ0qI6yM1k9q-zmo6FvajSVMkV'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                        <a href='https://www.instagram.com/ikalcafe_2019/'><img
                                src='https://drive.google.com/uc?export=download&id=1T_Qx-CH7-8hlOjVpgA3lgP-JFoUyE_si'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                        <a href='https://www.tiktok.com/@luluzc_z?is_from_webapp=1&sender_device=pc'><img
                                src='https://drive.google.com/uc?export=download&id=17_B8myczieAlnwraP_xE42cFBfPGa-9S'
                                alt='image_koffi' style='width: 25px; height: 25px;'></a>
                    </div>
                    <div class='terminos'>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Copyright © 2022 Koffi
                            Soft. Todos los derechos reservados</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Teléfono:
                            (503)2222-8888</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Correo electrónico:
                            koffisoft@gmail.com</p>
                        <br>
                    </div>
                </div>
            </body>
            
            </html>";
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    function comentariosUsuario($email, $nombre, $telefono, $comentario){
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP(true);
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'koffisoft@gmail.com'; // Tu email
            $mail->Password = 'dsppvpbikaunhkzt'; // Tu gmail app contraseña
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->setFrom('koffisoft@gmail.com'); // Tu email
            $mail->addAddress('koffisoft@gmail.com');
            $mail->isHTML(true); // Si lo que se envia tiene formato HTML
            $mail->CharSet = "utf-8"; // Para que acepte caracteres especiales
            $mail->Subject = "Comentario de Usuario"; // Titulo del mensaje
            $mail->Body = "<!DOCTYPE html>
            <html lang='en'>
            
            <head>
                <meta charset='UTF-8'>
                <!--Informar al navegador que el sitio web está optimizado para dispositivos móviles-->
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            </head>
            
            <body>
                <div class='contenido_superior' style='background-color: #f3c6a5; text-align: center; font-family: sans-serif; color:#4a1f0e;'>
                    <h1 style='padding-top: 10px; padding-bottom: 10px;'>Comentarios del Usuario</h1>
                </div>
                <div class='contenido_mensaje' style='font-family: sans-serif; color: #4a1f0e; background-color: #ffffff; text-align: left;'>
                    <p><b>E-Mail de usuario: </b>$email</p>
                    <p><b>Nombre del usuario: </b>$nombre</p>
                    <p><b>Teléfono del usuario: </b>$telefono</p>
                    <p><b>Comentario del usuario: </b>$comentario</p>
                </div>
                <div class='contenido_inferior' style='background-color: #4c070a; text-align: center;'>
                    <a href='#'><img src='https://drive.google.com/uc?export=download&id=1qClCJbYRBfx4TEL92ujbOZonHYW4otws'
                            alt='imagen_koffi_blanco' style='width: 90px; height: 90px; margin-top: 10px; margin-bottom: 10px;'></a>
                    <div class='terminos'>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Copyright © 2022 Koffi
                            Soft. Todos los derechos reservados</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Teléfono:
                            (503)2222-8888</p>
                        <p style='margin: 0px; font-family: sans-serif; color: #ffffff; text-align: center;'>Correo electrónico:
                            koffisoft@gmail.com</p>
                        <br>
                    </div>
                </div>
            </body>
            </html>";
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
