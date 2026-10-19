# TaskCampus

Aplicación web en React para gestionar tareas académicas. Laboratorio final de Desarrollo de Aplicaciones Web. Carga las diez primeras tareas desde JSONPlaceholder y permite crear, completar, editar, eliminar, filtrar y buscar tareas.

## Requisitos

Versiones con las que se desarrolló y probó el proyecto:

| Integrante | Node.js | npm |
| --- | --- | --- |
| Valentina | v24.22.0 | 11.19.1 |
| Alejandra | v24.19.0 | 11.17.0 |

## Instalación y ejecución

```bash
git clone https://github.com/valentinaarlettarcas-code/taskcampus.git
cd taskcampus
npm install
npm run dev
```

La aplicación queda disponible en http://localhost:5173/.

## Compilación y revisión

```bash
npm run build   # genera la versión de producción en /dist
npm run lint    # revisa el código con ESLint
```

`node_modules` no se incluye en el repositorio: las dependencias se instalan con `npm install`.


## Estructura del proyecto

```
src/
├── App.jsx              Coordina vistas, filtro y búsqueda
├── components/          Componentes de interfaz (completar al juntar las ramas)
├── hooks/
│   └── useTareas.js     Estado de las tareas y sus operaciones
├── services/
│   └── tareasService.js Peticiones HTTP a JSONPlaceholder
└── utils/
    └── validacion.js    Validación de títulos
```

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| Interfaz | components/ | Mostrar datos y recibir eventos del usuario |
| Coordinación | App.jsx | Guardar vista activa, filtro y búsqueda, y calcular lo derivado |
| Lógica de estado | hooks/useTareas.js | Mantener las tareas, la carga y los errores, y ejecutar las operaciones |
| Comunicación HTTP | services/tareasService.js | Hacer las peticiones y comprobar que la respuesta sea correcta |

## Vistas

(Completar al juntar las ramas, con las tres vistas finales.)

| Vista | Contenido |
| --- | --- |
| Resumen | Total, pendientes, completadas y cantidad mostrada con el filtro activo |
| Tareas | Lista, filtros, búsqueda, cambio de estado, edición y eliminación |
| Nueva tarea | Formulario de creación con mensajes de validación y resultado |

El encabezado y la navegación están disponibles en las tres vistas.

## Limitaciones de la API

JSONPlaceholder simula las operaciones de escritura: responde como si hubieran funcionado, pero no guarda nada. Por eso:

- Las tareas se cargan desde la API al iniciar (las diez primeras). Los cambios exitosos viven solo en el estado de la aplicación durante la sesión; al recargar la página vuelven las diez tareas originales.
- Al crear una tarea, la API responde siempre con el mismo identificador (201). Ese valor no se usa como clave: cada tarea tiene un identificador propio de la interfaz y, cuando existe en la API, un identificador remoto aparte.
- Las tareas creadas durante la sesión no existen en la API, así que no se hacen peticiones sobre ellas. Cambiar su estado, editarlas o eliminarlas se aplica solo en la aplicación, y se muestra un aviso.
- Si una petición falla, el estado no se modifica y se informa el error.