<?php
require('../../conexion/database.php');
require('../../conexion/validaciones.php');
require('../../libraries/fpdf182/fpdf.php');

/**
 *   Clase para definir las plantillas de los reportes del sitio privado. Para más información http://www.fpdf.org/
 */
class Report extends FPDF
{
    // Propiedad para guardar el título del reporte.
    private $title = null;
    private $subtitle = null;

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *
    *   Parámetros: $title (título del reporte).
    *
    *   Retorno: ninguno.
    */
    public function startReport($title, $subtitle)
    {
        // Se establece la zona horaria a utilizar durante la ejecución del reporte.
        ini_set('date.timezone', 'America/El_Salvador');
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a main.php
        if (isset($_SESSION['idusuario_empleado'])) {
            // Se establece un color de texto para los encabezados.
            $this->SetTextColor(74, 31, 14);
            // Se asigna el título y subtitulo del documento a la propiedad de la clase.
            $this->title = $title;
            $this->subtitle = $subtitle;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('Dashboard - Reporte', true);
            // Se establecen los margenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se establecen los margenes del documento que es el margen inferior:
            $this->SetAutoPageBreak(true, 15);
            // Se añade una nueva página al documento (orientación vertical y formato carta) y se llama al método header()
            $this->addPage('p', 'letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location: ../../../vistas/privado/index.html');
        }
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Se establece el fondo del reporte
        $this->image('../../images/fondo_report2.png', 0, 0, 217);
        $this->Ln(25);
        //Se cambia el formato de letra con negrita
        $this->setFont('Arial', 'B', 15);
        $this->SetDrawColor(74, 31, 14);
        // Se establece un color de texto para los encabezados.
        $this->SetTextColor(74, 31, 14);
        // Se ubica en una celda cuadrada el logo de la empresa
        $this->cell(40, 30, $this->image('../../images/koffisoft_logo.png', 22, 42, 25), 1, 0, 'C');
        //Se cambian los colores de los campos inferiores
        $this->SetFillColor(249, 236, 208);
        // Se ubica el título.
        $this->cell(145, 10, utf8_decode($this->title), 1, 1, 'C', 1);
        //Se cambia el formato de letra sin negrita
        $this->setFont('Arial', '', 10);
        $this->cell(40);
        $this->cell(145, 10,utf8_decode($this->subtitle), 1, 1, 'C', 1);
        $this->cell(40);
        // Se ubica la fecha y hora del servidor junto con el usuario que creo el reporte
        $this->cell(75, 10, 'Reporte creado por: ' . $_SESSION['usuario_empleado'], 1, 0, 'L', 1);
        $this->cell(35, 10,  'Fecha: ' . date('d-m-Y'), 1, 0, 'C', 1);
        $this->cell(35, 10,  'Hora: ' . date('H:i:s'), 1, 0, 'C', 1);
        // Se agrega un salto de línea para mostrar el contenido principal del documento.
        $this->Ln(20);
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        // Se establece el color de la fuente para los datos de los productos.
        $this->SetTextColor(74, 31, 14);
        // Se establece la posición para el número de página (a 15 milimetros del final).
        $this->setY(-15);
        // Se establece la fuente para el número de página.
        $this->setFont('Arial', 'I', 8);
        // Se imprime una celda con el número de página.
        $this->cell(190, 0, utf8_decode('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }
}
