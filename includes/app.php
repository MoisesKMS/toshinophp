<?php

require __DIR__ . '/../vendor/autoload.php'; // cargamos el autoload

// cargamos las variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

require 'funciones.php'; // Funciones disponibles en todo el proyecto

/* Configuración de la Base de Datos */
// require 'config/database.php';
// $db = conectarDB(); // Conexión a la base de datos
// use Models\ActiveRecord; // Llamamos al modelo principal de ActiveRecord
// ActiveRecord::setDB($db); // Setteamos la base de datos
