# FrontEnd Funcionalidad - Proyecto de Reservas de Canchas

Este proyecto forma parte de un sistema de reservas de canchas deportivas. La funcionalidad principal implementada en esta entrega es la **interfaz de la organización deportiva** y la opción para **agregar nuevas canchas al sistema**.

## 🌐 Interfaz Principal (Organización Deportiva)

- Archivo: `organizacion_deportiva.html`
- Ubicación: raíz del proyecto
- Descripción:
  - Muestra las canchas registradas en un mapa simulado (imagen o mapa interactivo).
  - Permite consultar la información detallada de cada cancha.
  - Contiene botones de navegación:
    - Ver canchas
    - Agregar cancha → redirige a la interfaz de agregar
    - Ver encargados
    - Agregar encargado
  - También incluye:
    - Sección de avisos
    - Usuario y menú de configuración (ajustes, cambiar info, cerrar sesión)

## ➕ Interfaz Secundaria (Agregar Cancha)

- Archivo: `AgregarCancha/agregar_cancha.html`
- Estructura modular:
  - `AgregarCancha/script_agregar_cancha.js`
  - `AgregarCancha/styles_agregar_cancha.css`
- Funcionalidad:
  - Formulario dividido en secciones:
    - Información básica (nombre, tipo, superficie, dimensiones, costo)
    - Información opcional (iluminación, cubierta)
    - Ubicación geográfica (con selección por mapa y autoasignación de departamento y municipio)
    - Subida de imagen de la cancha
  - Visualización de horarios disponibles por día de la semana
    - Permite marcar días como "cerrado"
    - Validaciones de lógica horaria (apertura < cierre)
  - Validaciones en campos como dimensiones (positivos, realistas)
  - Al hacer clic en “Cancelar” se regresa a la interfaz principal


## ✏️ Tecnologías Usadas

- HTML5
- CSS3
- JavaScript
- LeafletJS (para mapa interactivo)
- OpenStreetMap + Nominatim (geocodificación inversa)

## 👥 Autores

- [SGV13](https://github.com/SGV13)
- [CamiloUrrea](https://github.com/CamiloUrrea)
- [TomasCGH](https://github.com/TomasCGH)