<?php

namespace Controllers;

use MVC\Router;

class PagesController {
    public static function index(Router $router) {
        $router->render('public/index', []);
    }

    public static function page404(Router $router) {
        $router->render('public/page404', []);
    }
}
