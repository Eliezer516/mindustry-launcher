# Mindustry Launcher

Launcher especial para ejecutar **Mindustry** descargado de **itch.io**.

## Características

- Banner del juego en la parte superior con rotación automática.
- Icono del juego, título grande y botón **Iniciar** en el panel inferior.
- Descripción del juego en español.
- Selección del ejecutable mediante botón de configuración (⚙).
- Guarda la ruta del ejecutable en `localStorage`.

## Uso

Este launcher está pensado para ejecutar **Mindustry** si lo descargaste de **itch.io**.

1. Abre la aplicación.
2. La primera vez, haz clic en ⚙ para vincular el ejecutable de Mindustry una sola vez.
3. A partir de ahí, solo haz clic en **Iniciar** para lanzar el juego. El launcher recuerda el archivo seleccionado.

## Tecnologías

- HTML + CSS (diseño oscuro, banner estilo Steam)
- JavaScript (tinyjs para diálogo de archivos)
- Almacena la ruta en `localStorage`
