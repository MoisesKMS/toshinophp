<?php

require_once __DIR__ . '/../includes/app.php';

use Controllers\PagesController;
use MVC\Router;

$router = new Router();

/* Public */
$router->get('/', [PagesController::class, 'index']);
$router->get('/404', [PagesController::class, 'page404']);

/* Router */
$router->comprobarRutas();
