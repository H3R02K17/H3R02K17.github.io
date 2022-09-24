<?php
// Se verifica si existen los parámetros en la url, de lo contrario se direcciona a la página web de origen.
if (isset($_GET['empleado']) && isset($_GET['nombre_empleado'])) {
    //Se crean las variables para que mande el usuario o empleado y el nombre de este para mostrarlo en el reporte
    $empleado = $_GET['empleado'];
    $nombre_empleado = $_GET['nombre_empleado'];

    require('../../conexion/dashboard_report.php');
    require('../../modelo/observaciones.php');

    $pdf = new Report;
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport(
        'Observaciones de empleado',
        'El reporte muestra el reporte de observaciones del empleado ' . $nombre_empleado
    );
    // Se instancia el módelo de Productos para procesar los datos.
    $observaciones = new Observaciones;
    //se setean las variables para la consulta
    $observaciones->setIdempleado($empleado);
    // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
    if ($dataObservaciones = $observaciones->reporteObservacionEmpleado()) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        $pdf->cell(185, 10, utf8_decode('Nombre Empleado: ' . $nombre_empleado), 1, 1, 'C', 1);
        $pdf->cell(185, 10, utf8_decode('Observaciones'), 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Helvetica', '', 9);
        // Se establece el color de la fuente para los datos de los productos.
        $pdf->SetTextColor(74, 31, 14);
        // Contador para aumentar por cada fila
        $contador = 0;
        // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
        foreach ($dataObservaciones as $rowObservaciones) {
            if ($contador % 2 == 0) {
                // Se establece un color de relleno para las celdas pares que se imprimen.
                $pdf->setFillColor(255, 255, 255, 255);
            } else {
                // Se establece un color de relleno para las celdas impares que se imprimen.
                $pdf->setFillColor(249, 236, 208);
            }
            // Aumentamos el valor del contador
            $contador++;

            $pdf->cell(185, 10, utf8_decode($rowObservaciones['observacion_empleado']), 1, 1, 'C', 1);
        }
    } else {
        $pdf->cell(0, 10, utf8_decode('No hay observaciones registradas para este empleado'), 1, 1);
    }
    // Se envía el documento al navegador y se llama al método footer()
    $pdf->output('I', 'Observación_empleado.pdf');;
} else {
    header('location: ../../../vistas/privado/reportes.html');
}