<?php

namespace MVC;

class Router {
    public $rutasGet = [];
    public $rutasPost = [];

    public function get($url, $funcion) {
        $this->rutasGet[$url] = $funcion;
    }

    public function post($url, $funcion) {
        $this->rutasPost[$url] = $funcion;
    }

    public function comprobarRutas() {
        $urlActual = $_SERVER['REQUEST_URI'] ?? '/';
        $urlActual = explode('?', $urlActual)[0] ?? $urlActual;
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'GET') {
            $funcion = $this->rutasGet[$urlActual] ?? null;
        } else {
            $funcion = $this->rutasPost[$urlActual] ?? null;
        }

        if ($funcion) {
            // La url existe y tiene una funcion asociada
            call_user_func($funcion, $this);
        } else {
            // La url no existe o no tiene una funcion asociada
            header('Location: /404');
            exit;
            echo 'Error 404, Página no encontrada';
        }
    }

    //Muestra una vista
    public function render($view, $datos = [], $layout = 'public') {
        foreach ($datos as $clave => $valor) {
            //Convierte la clave en una variable
            $$clave = $valor;
        }

        ob_start(); // Inicia el buffer de salida
        require __DIR__ . '/views/' . $view . '.php'; // seleccionamos la vista
        $contenido = ob_get_clean(); // obtiene el contenido del buffer y libera memoria

        // Seleccionamos el layout
        require __DIR__ . '/views/layouts/' . $layout . '.php';
    }
}
