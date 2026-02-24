# 🏎️ F1 Paddock Manager - API REST Full Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

Esta es una aplicación web Full Stack diseñada para gestionar la parrilla de pilotos de Fórmula 1. Este proyecto implementa una API RESTful conectada a una base de datos NoSQL y una interfaz gráfica de una sola página (SPA) fluida y moderna. Entre sus características principales destacan una autenticación segura mediante JSON Web Tokens (JWT) con un sistema de registro e inicio de sesión cifrado, y operaciones CRUD completas que permiten crear, leer, actualizar y eliminar registros de pilotos, incluyendo su nombre, escudería, número, títulos mundiales y estado. Además, cuenta con protección de rutas mediante middleware para bloquear peticiones no autorizadas, un diseño UI/UX estilo *Glassmorphism* que no requiere recargar la página para interactuar con la base de datos, y está completamente configurado para integración y despliegue continuo (CI/CD) en la plataforma Render.

##  Requisitos e Instalación Local

Para instalar y ejecutar este proyecto en tu propia máquina, primero asegúrate de tener instalado Node.js (versión 14 o superior), Git y contar con una cuenta activa en MongoDB Atlas para la gestión de la base de datos. El primer paso es abrir tu terminal y clonar el repositorio usando el comando `git clone https://github.com/Parsival777/Acts-Desarrollo-Full-Stack---Alan-Anduaga-.git`. Una vez descargado, navega al directorio del proyecto ejecutando `cd Acts-Desarrollo-Full-Stack---Alan-Anduaga-/Act4` y procede a instalar todas las dependencias necesarias con el comando `npm install`.

El siguiente paso es fundamental: debes configurar las variables de entorno creando un archivo llamado `.env` en la raíz de la carpeta `Act4`. Dentro de este archivo, deberás definir tres variables clave: `PORT=3000`, tu cadena de conexión `MONGO_URI` (asegurándote de reemplazar los datos con tu usuario, contraseña y cluster de Atlas, además de habilitar tu IP en la configuración de red de MongoDB), y un `JWT_SECRET` con tu clave de encriptación personalizada. 

Con el entorno debidamente configurado, puedes encender el servidor ejecutando el comando `node server.js`. El sistema te indicará en la consola que está corriendo en el puerto 3000 y confirmará la conexión exitosa a MongoDB. Finalmente, solo debes abrir tu navegador web de preferencia e ingresar a la dirección `http://localhost:3000` para comenzar a utilizar la aplicación.

##  Pruebas Automatizadas (Testing)

El proyecto cuenta con una robusta suite de pruebas automatizadas diseñadas con Jest y Supertest para garantizar la estabilidad de los endpoints de autenticación y el correcto manejo de la base de datos. Para ejecutarlas y verificar que la lógica del servidor funcione a la perfección antes de cualquier despliegue, simplemente utiliza el comando `npm test` en tu terminal.

##  Autor

Este proyecto fue desarrollado por **Alan Anduaga Lleverino** como parte de las actividades prácticas integradoras de la materia de Desarrollo Full Stack en la Universidad Tecmilenio.
