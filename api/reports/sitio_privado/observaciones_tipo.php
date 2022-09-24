<?php
if (isset($_GET['tipo']) && isset($_GET['frase'])) {
    //Se crean las variables para que mande el usuario o empleado y el nombre de este para mostrarlo en el reporte
    $idtipo = $_GET['tipo'];
    $tipo = $_GET['frase'];

    require('../../conexion/dashboard_report.php');
    require('../../modelo/observaciones.php');

    $pdf = new Report;
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport(
        'Observaciones de tipo ' . $tipo,
        'El reporte muestra las observaciones que son de tipo "' . $tipo . '".'
    );
    // Se instancia el módelo de Inventario para procesar los datos.
    $observaciones_tipo = new Observaciones;
    //se setean las variables para la consulta
    $observaciones_tipo->setIdTipo($idtipo);
    // Se verifica si existen registros (observaciones) para mostrar, de lo contrario se imprime un mensaje.
    if ($dataObservaciones = $observaciones_tipo->reporteObservacionesTipo()) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(15, 10, utf8_decode('ID'), 1, 0, 'C', 1);
        $pdf->cell(55, 10, utf8_decode('Observación'), 1, 0, 'C', 1);
        $pdf->cell(40, 10, utf8_decode('Fecha'), 1, 0, 'C', 1);
        $pdf->cell(50, 10, utf8_decode('Usuario'), 1, 0, 'C', 1);
        $pdf->cell(25, 10, utf8_decode('Estado'), 1, 1, 'C', 1);
        // Se establece la fuente para los datos de las observaciones.
        $pdf->setFont('Helvetica', '', 9);
        // Se establece el color de la fuente para los datos de las observaciones.
        $pdf->SetTextColor(74, 31, 14);
        // Contador para aumentar por cada fila
        $contador = 0;

        // Se recorren los registros ($dataObservaciones) fila por fila ($rowObservaciones).
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
            $pdf->cell(15, 10, $rowObservaciones['idobservacion'], 1, 0, 'C', 1);
            $pdf->cell(55, 10, utf8_decode(substr($rowObservaciones['observacion'], 0, 30) . '...'), 1, 0, 'C', 1);
            $pdf->cell(40, 10, utf8_decode($rowObservaciones['fecha_observacion']), 1, 0, 'C', 1);
            $pdf->cell(50, 10, utf8_decode($rowObservaciones['usuario_empleado']), 1, 0, 'C', 1);
            $pdf->cell(25, 10, $rowObservaciones['estado_observacion'], 1, 1, 'C', 1);
        }
    } else {
        $pdf->cell(0, 10, utf8_decode('No hay observaciones'), 1, 1);
    }
    // Se envía el documento al navegador y se llama al método footer()
    $pdf->output('I', 'observaciones_tipo.pdf');;
} else {
    header('location: ../../../vistas/privado/reportes.html');
}
