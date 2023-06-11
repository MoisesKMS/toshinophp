<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="/build/img/favicon.png" type="image/png">
    <title>ToshinoPHP</title>
    <script src="/build/js/img_support.js?t=202306100722"></script>
    <link rel="stylesheet" href="/build/css/app.css?t=202306100722">
</head>

<body>

    <?php echo $contenido; ?>

    <script src="/build/js/main.js?t=202306100722"></script>

    <?php
    if (isset($scripts)) {
        foreach ($scripts as $script) {
            echo '<script src="/build/js/' . $script . '.js?t=202306100722"></script>';
        }
    }
    ?>

</body>

</html>
