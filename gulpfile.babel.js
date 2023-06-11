require('dotenv').config();

/* General */
const { src, dest, watch, series } = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const { init: server, stream, reload } = require("browser-sync");
const php = require("gulp-connect-php");

/* SASS */
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const sass = require('gulp-sass')(require('sass'))

/* JavaScript */
const babel = require('gulp-babel')
const terser = require('gulp-terser')

/* Imagenes */
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')

/* Rutas */
const paths = {
    origin: {
        php: "./**/*.php",
        sass: "./src/scss/**/*.scss",
        js: "./src/js/**/*.js",
        img: "./src/img/**/*.{png,jpg,jpeg}",
        svg: "./src/img/**/*.svg",
        gif: "./src/img/**/*.gif",
        video: "./src/video/**/*.{mp4,webm}"
    },
    dest: {
        css: "./public/build/css",
        js: "./public/build/js",
        img: "./public/build/img",
        video: "./public/build/video"
    },
    env: {
        baseUrl: "./public"
    }
}

/* Compilar SASS */
function sass_dev() {
    return src(paths.origin.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(
            postcss([
                autoprefixer()
            ])
        )
        .pipe(sourcemaps.write())
        .pipe(dest(paths.dest.css));
}


function sass_build() {
    return src(paths.origin.sass)
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(
            postcss([
                cssnano(),
                autoprefixer()
            ])
        )
        .pipe(dest(paths.dest.css));
}

/* Compila y Transpila archivos .js Modernos a .js para cualquier navegador */
function js_dev() {
    return src(paths.origin.js)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(terser())
        .pipe(sourcemaps.write())
        .pipe(dest(paths.dest.js))
}

function js_build() {
    return src(paths.origin.js)
        .pipe(babel())
        .pipe(terser())
        .pipe(dest(paths.dest.js))
}

/* Optimizar Imagenes, Gifs y Videos */
function img_min() {
    return src(paths.origin.img)
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 3 })
            ])
        )
        .pipe(dest(paths.dest.img));
}

function img_webp() {
    return src(paths.origin.img)
        .pipe(
            webp({
                quality: 75
            })
        )
        .pipe(dest(paths.dest.img));
}

function img_avif() {
    return src(paths.origin.img)
        .pipe(avif({
            quality: 90
        }))
        .pipe(dest(paths.dest.img))
}

function img_svg() {
    return src(paths.origin.svg)
        .pipe(
            imagemin([
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
                })
            ])
        )
        .pipe(dest(paths.dest.img));
}

function img_gif() {
    return src(paths.origin.gif)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true })
        ]))
        .pipe(dest(paths.dest.img));
}

function video_move() {
    return src(paths.origin.video)
        .pipe(dest(paths.dest.video));
}

/* Lanzar el entorno de desarrollo */
function sync() {
    php.server({
        base: paths.env.baseUrl,
        port: process.env.SERVER_PORT,
        keepalive: true,
        // custom PHP locations
        bin: process.env.PHP_BIN,
        ini: process.env.PHP_INI
    });
    server({
        proxy: process.env.SERVER_PROXY,
        baseDir: paths.env.baseUrl,
        notify: false
    });
}

// Inicia el entorno de desarrollo
function server_dev() {
    sync();
    watch(paths.origin.php).on("change", reload);
    watch(paths.origin.sass, sass_dev).on("change", reload);
    watch(paths.origin.js, js_dev).on("change", reload);
}

/* Crea el proyecto listo para producción */
function build(done) {
    const files = {
        origin: {
            classes: "./classes/**/*.*",
            controllers: "./controllers/**/*.*",
            includes: "./includes/**/*.*",
            models: "./models/**/*.*",
            public: "./public/**/*.*",
            config: "./public/.htaccess",
            vendor: "./vendor/**/*.*",
            views: "./views/**/*.*",
            env: "./includes/.env",
            htaccess: ".htaccess",
            router: "./Router.php"
        },
        dest: {
            classes: "./dest/classes",
            controllers: "./dest/controllers",
            includes: "./dest/includes",
            models: "./dest/models",
            public: "./dest/public",
            vendor: "./dest/vendor",
            views: "./dest/views",
            htaccess: "./dest",
            router: "./dest"
        }
    }

    try {
        src(files.origin.classes).pipe(dest(files.dest.classes))
    } catch (error) {
        console.log(`Se encontro lo siguiente: ${error}`);
    }

    src(files.origin.controllers).pipe(dest(files.dest.controllers))
    src(files.origin.includes).pipe(dest(files.dest.includes))
    src(files.origin.models).pipe(dest(files.dest.models))
    src(files.origin.public).pipe(dest(files.dest.public))
    src(files.origin.config).pipe(dest(files.dest.public))
    src(files.origin.vendor).pipe(dest(files.dest.vendor))
    src(files.origin.views).pipe(dest(files.dest.views))
    src(files.origin.env).pipe(dest(files.dest.includes))
    src(files.origin.htaccess).pipe(dest(files.dest.htaccess))
    src(files.origin.router).pipe(dest(files.dest.router))

    done()
}

/* Comandos de gulp */

// Por defecto se inicia el entorno de desarrollo
exports.default = server_dev

// Para la primera ejecución del entorno de desarollo
exports.first_dev = series(
    img_min,
    img_webp,
    img_avif,
    img_svg,
    img_gif,
    video_move,
    sass_dev,
    js_dev,
    server_dev
);

// Compilación de imagenes, gifs y videos
exports.video_move = video_move;
exports.img_min = img_min;
exports.img_webp = img_webp;
exports.img_avif = img_avif;
exports.img_svg = img_svg;
exports.img_gif = img_gif;
exports.img_compile = series(
    img_min,
    img_webp,
    img_avif,
    img_svg,
    img_gif
);

// Compila js y sass (para desarrollo) sin lanzar un entorno de desarrollo
exports.src_dev = series(sass_dev, js_dev)

// Compila js y sass (para produccion) sin lanzar un entorno de desarrollo
exports.src_build = series(sass_build, js_build)

// Lanza el entorno de desarrollo sin compilar nada pero esperando por cambios
exports.dev = server_dev;

// Crea el proyecto listo para la distribución
exports.build = series(
    img_min,
    img_webp,
    img_avif,
    img_svg,
    img_gif,
    video_move,
    sass_build,
    js_build,
    build
);
