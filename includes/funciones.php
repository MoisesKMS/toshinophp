<?php

// Ayuda a hacer debug a una variable/arreglo
function debuguear($variable): string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function cleanHTML($html): string {
    $htmlCleaned = htmlspecialchars($html);
    return $htmlCleaned;
}

// Función que revisa que el usuario este autenticado
function isAuth(): bool {
    if ($_SESSION['auth'] === true) return true;
    return false;
}
