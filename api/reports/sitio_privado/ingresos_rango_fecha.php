<?php
// Se verifica si existen los parámetros en la url, de lo contrario se direcciona a la página web de origen.
if (isset($_GET['fechaI']) && isset($_GET['fechaF'])) {
    require('../../conexion/dashboard_report.php');
    require('../../modelo/registro_entrega.php');
    //Se crean las variables para recibir las fechas
    $fechaI = $_GET['fechaI'];
    $fechaF = $_GET['fechaF'];
    // Se inica el reporte
    $pdf = new Report;
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Ingresos por rango de fechas', 
    'El reporte muestra los ingresos de ingredientes en un rango de fechas');
    // Se instancia el módelo de Productos para procesar los datos.
    $ingresos = new RegistroInventario;
    //se setean las variables para la consulta
    $ingresos->setFecha_inicio_report($fechaI) && $ingresos->setFecha_fin_report($fechaF);
    // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
    if ($dataIngreso = $ingresos->reporteIngresosHistorialFechas()) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        //Se imprimen las fechas en las que se solicito el reporte
        $pdf->cell(185, 10, utf8_decode('Reporte solicitado entre las fechas'), 1, 1, 'C', 1);
        $pdf->cell(92.5, 10, utf8_decode('Desde: ' . $fechaI), 1, 0, 'C', 1);
        $pdf->cell(92.5, 10, utf8_decode('Hasta: ' . $fechaF), 1, 1, 'C', 1);
        $pdf->Ln(10);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(25, 10, utf8_decode('ID'), 1, 0, 'C', 1);
        $pdf->cell(90, 10, utf8_decode('Nombre del Ingrediente'), 1, 0, 'C', 1);
        $pdf->cell(35, 10, utf8_decode('Cantidad'), 1, 0, 'C', 1);
        $pdf->cell(35, 10, utf8_decode('Fecha del registro'), 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Helvetica', '', 9);
        // Se establece el color de la fuente para los datos de los productos.
        $pdf->SetTextColor(74, 31, 14);
        // Contador para aumentar por cada fila
        $contador = 0;
        // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
        foreach ($dataIngreso as $rowIngresos) {
            if ($contador % 2 == 0) {
                // Se establece un color de relleno para las celdas pares que se imprimen.
                $pdf->setFillColor(255, 255, 255, 255);
            } else {
                // Se establece un color de relleno para las celdas impares que se imprimen.
                $pdf->setFillColor(249, 236, 208);
            }
            // Aumentamos el valor del contador
            $contador ++;
            $pdf->cell(25, 10, $rowIngresos['idinventario'], 1, 0, 'C', 1);
            $pdf->cell(90, 10, utf8_decode($rowIngresos['ingrediente']), 1, 0, 'C', 1);
            $pdf->cell(35, 10, $rowIngresos['cantidad'], 1, 0, 'C', 1);
            $pdf->cell(35, 10, $rowIngresos['fecha_entrega'], 1, 1, 'C', 1);
        }
    } else {
        $pdf->cell(0, 10, utf8_decode('No hay ingresos registrados'), 1, 1);
    }
    // Se envía el documento al navegador y se llama al método footer()
    $pdf->output('I', 'ingresos_historial.pdf');;
} else {
    header('location: ../../../vistas/privado/reportes.html');
}

