# Acts-Desarrollo-Full-Stack---Alan-Anduaga-

# Control de Taller Mecanico

Este sistema es una aplicacion web para la gestion de ordenes de servicio automotriz. Incluye un CRUD completo (Crear, Leer, Actualizar, Eliminar) y un sistema de autenticacion seguro.

## Enlaces de Despliegue
- Aplicacion Web (Render): [PEGA AQUI TU LINK DE RENDER]
- Base de Datos: MySQL en TiDB Cloud.

## Tecnologías Utilizadas
- Backend: Node.js, Express.js, MySQL2.
- Frontend: HTML5, CSS3, JavaScript.
- Seguridad: JSON Web Tokens (JWT) y Bcryptjs.
- Infraestructura: Render y TiDB Cloud.

## Estructura del Proyecto
El codigo esta organizado en las siguientes carpetas:

- backend/
  Contiene el archivo server.js que maneja la logica del servidor, la conexion a la base de datos y la seguridad.

- frontend/
  Contiene la interfaz de usuario (HTML), los estilos (CSS) y la logica del cliente (script.js) que consume la API.

- database/
  Contiene los scripts SQL para la creacion de las tablas usuarios y reparaciones.

## Documentacion de la API (Endpoints)

Autenticacion:
- POST /api/registro : Registra un nuevo usuario con contrasena encriptada.
- POST /api/login : Valida credenciales y devuelve un token de acceso.

Gestion de Reparaciones (Requiere Token):
- GET /api/reparaciones : Obtiene la lista de reparaciones del usuario.
- POST /api/reparaciones : Crea una nueva orden de reparacion.
- PUT /api/reparaciones/:id : Actualiza la descripcion de una orden.
- DELETE /api/reparaciones/:id : Elimina una orden del sistema.

## Flujo del Sistema
1. El usuario se registra o inicia sesion desde el frontend.
2. El servidor valida los datos y genera un Token JWT firmado.
3. El navegador guarda este token en el almacenamiento local (localStorage).
4. Para visualizar o modificar datos, el frontend envia el token en cada peticion.
5. El servidor verifica la validez del token antes de permitir cambios en la base de datos.

## Instalacion Local
Para ejecutar el proyecto en un entorno local:

1. Clonar el repositorio.
2. Ejecutar "npm install" en la terminal.
3. Configurar el archivo .env con las credenciales de la base de datos local.
4. Ejecutar el comando "node backend/server.js".
5. Acceder a http://localhost:3000 desde el navegador.
