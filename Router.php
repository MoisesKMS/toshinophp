<?php

namespace MVC;

class Router {
    public $rutasGet = [];
    public $rutasPost = [];

    public function get($url, $funcion) {
        $url = preg_replace('/\{([a-zA-Z]+)\}/', '(?P<\1>[a-zA-Z0-9-]+)', $url);
        $this->rutasGet[$url] = $funcion;
    }

    public function post($url, $funcion) {
        $url = preg_replace('/\{([a-zA-Z]+)\}/', '(?P<\1>[a-zA-Z0-9-]+)', $url);
        $this->rutasPost[$url] = $funcion;
    }

    public function comprobarRutas() {
        $urlActual = $_SERVER['REQUEST_URI'] ?? '/';
        $urlActual = explode('?', $urlActual)[0] ?? $urlActual;
        $metodo = $_SERVER['REQUEST_METHOD'];

        $rutas = ($metodo === 'GET') ? $this->rutasGet : $this->rutasPost;

        foreach ($rutas as $url => $funcion) {
            $pattern = '#^' . $url . '$#';
            if (preg_match($pattern, $urlActual, $matches)) {
                // La URL coincide y tiene una función asociada
                array_shift($matches); // Elimina el primer elemento que contiene la URL completa

                // Agrega el objeto Router como primer argumento en el llamado a la función
                array_unshift($matches, $this);

                // Llama a la función con los parámetros capturados de la URL
                call_user_func_array($funcion, array_values($matches));
                return;
            }
        }

        // La URL no existe o no tiene una función asociada
        header('Location: /404');
        exit;
        echo 'Error 404, Página no encontrada';
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
