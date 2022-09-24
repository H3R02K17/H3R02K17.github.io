<?php
require('../../conexion/dashboard_report.php');
require('../../modelo/registro_entrega.php');
require('../../modelo/administrar_inventario.php');

$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Registro de ingresos por ingrediente', 
'El reporte muestra los registros del inventario que ha tenido cada ingrediente');
// Se instancia el módelo de Productos para procesar los datos.
$inventario = new Inventario;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataInventario = $inventario->readAllReporte()) {
    // Contador para aumentar por cada fila
    $contador = 0;
    // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
    foreach ($dataInventario as $rowInventario) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        // Se imprime una celda con el nombre del ingrediente.
        $pdf->cell(185, 10, utf8_decode('Ingrediente: ' . $rowInventario['ingrediente']), 1, 1, 'C', 1);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(25, 10, utf8_decode('ID'), 1, 0, 'C', 1);
        $pdf->cell(35, 10, utf8_decode('Cantidad'), 1, 0, 'C', 1);
        $pdf->cell(35, 10, utf8_decode('Fecha del registro'), 1, 0, 'C', 1);
        $pdf->cell(90, 10, utf8_decode('Nombre del usuario'), 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Helvetica', '', 9);
        // Se establece el color de la fuente para los datos de los productos.
        $pdf->SetTextColor(74, 31, 14);
        // Se instancia el módelo Productos para procesar los datos.
        $ingreso = new RegistroInventario;
        // Se establece el ingrediente para obtener sus ingresos, de lo contrario se imprime un mensaje de error.
        if ($ingreso->setIdIngrediente($rowInventario['idingrediente'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataIngresosP = $ingreso->reporteIngresosIngrediente()) {
                // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
                foreach ($dataIngresosP as $rowIngresos) {
                    if ($contador % 2 == 0) {
                        // Se establece un color de relleno para las celdas pares que se imprimen.
                        $pdf->setFillColor(255, 255, 255, 255);
                    } else {
                        // Se establece un color de relleno para las celdas impares que se imprimen.
                        $pdf->setFillColor(249, 236, 208);
                    }
                    // Aumentamos el valor del contador
                    $contador++;
                    $pdf->cell(25, 10, $rowIngresos['idinventario'], 1, 0, 'C', 1);
                    $pdf->cell(35, 10, $rowIngresos['cantidad'], 1, 0, 'C', 1);
                    $pdf->cell(35, 10, $rowIngresos['fecha_entrega'], 0, 0, 'C', 1);
                    $pdf->cell(90, 10, utf8_decode($rowIngresos['usuario_empleado']), 1, 1, 'C', 1);
                }
                // Se agrega un salto de línea para mostrar el contenido principal del documento.
                $pdf->Ln(10);
            } else {
                // Se establece un color de relleno para las celdas pares que se imprimen.
                $pdf->setFillColor(255, 255, 255, 255);
                $pdf->cell(185, 10, utf8_decode('No hay registros para este Ingrediente'), 1, 1, 'C', 1);
                // Se agrega un salto de línea para mostrar el contenido principal del documento.
                $pdf->Ln(10);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('Ingrediente incorrecto o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ingresos registrados'), 1, 1);
}
// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'Ingresos_historial.pdf');;
