<?php

function conectarDB(): mysqli {
    $db = new mysqli(
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        $_ENV['DB_NAME']
    );

    if (!$db) {
        echo 'No fue posible conectarse a la Base de Datos';
        exit;
    }

    return $db;
}
