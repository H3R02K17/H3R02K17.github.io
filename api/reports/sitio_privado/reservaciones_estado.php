<?php
require('../../conexion/dashboard_report.php');
require('../../modelo/reservaciones.php');
require('../../modelo/estado_reservacion.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reservaciones por Estado', 'El reporte muestra las reservaciones divididas por estados');

// Se instancia el módelo Categorías para obtener los datos.
$estadoReservacion = new Estado_reservacion;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataEstado = $estadoReservacion->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(76, 7, 10);
    // Se establece un color para el texto de los encabezados.
    $pdf->SetTextColor(255, 255, 255);
    // Se establece un color para el borde de las celdas de los encabezados.
    $pdf->SetDrawColor(255, 255, 255);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Helvetica', 'B', 10);
    // Se imprimen las celdas con los encabezados.
    //$pdf->cell(185, 10, utf8_decode('Nombre Estado'), 1, 1, 'C', 1);
    // Se recorren los registros ($dataProducto) fila por fila ($rowProducto).
    foreach ($dataEstado as $rowEstado) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        // Se imprime una celda con el nombre del producto.
        $pdf->cell(185, 10, utf8_decode('Estado: '.$rowEstado['estado_reservacion']), 1, 1, 'C', 1);
        $pdf->cell(90, 10, utf8_decode('Nombre Cliente'), 1, 0, 'C', 1);
        $pdf->cell(50, 10, utf8_decode('Fecha Reservación'), 1, 0, 'C', 1);
        $pdf->cell(45, 10, utf8_decode('Teléfono de contacto'), 1, 1, 'C', 1);
        if ($estadoReservacion->setIdestadoreservacion($rowEstado['idestado_reservacion'])) {
            // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
            if ($dataEstado = $estadoReservacion->reporteReservaciones()) {
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Helvetica', '', 9);
                // Se establece el color de la fuente para los datos de los productos.
                $pdf->SetTextColor(74, 31, 14);
                // Contador para aumentar por cada fila
                $contador = 0;
                // Se recorren los registros ($dataIngrediente) fila por fila ($rowProducto).
                foreach ($dataEstado as $rowEstado) {
                    if ($contador % 2 == 0) {
                        // Se establece un color de relleno para las celdas pares que se imprimen.
                        $pdf->setFillColor(255, 255, 255, 255);
                    } else {
                        // Se establece un color de relleno para las celdas impares que se imprimen.
                        $pdf->setFillColor(249, 236, 208);
                    }
                    // Aumentamos el valor del contador
                    $contador ++;
                    // Se imprimen las celdas con los datos de los productos.
                    $pdf->cell(90, 10, utf8_decode($rowEstado['nombre_cliente'] . " " . $rowEstado['apellido_cliente']), 1, 0, 'C', 1);
                    $pdf->cell(50, 10, utf8_decode($rowEstado['fecha_reservacion']), 1, 0, 'C', 1);
                    $pdf->cell(45, 10, utf8_decode($rowEstado['telefono_cliente']), 1, 1, 'C', 1);
                }
                // Se agrega un salto de línea para mostrar el contenido principal del documento.
                $pdf->Ln(10);
            } else  {
                // Se establece un color de relleno para las celdas pares que se imprimen.
                $pdf->setFillColor(255, 255, 255, 255);
                $pdf->cell(0, 10, utf8_decode('No hay Reservaciones en este estado'), 1, 1, 'C', 1);
                // Se agrega un salto de línea para mostrar el contenido principal del documento.
                $pdf->Ln(10);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('Reservación incorrecto o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay Estados que mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'Reservación_estado.pdf');
