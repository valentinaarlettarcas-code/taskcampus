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