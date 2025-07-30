# RIAH
Repositorio central para el desarrollo iterativo e incremental de la herramienta Rehab-Immersive Analysis Hub (RIAH).

## CONTENIDO
### FRONTEND
Desarrollado en React. Se encuentra en la carpeta riah-frontend. Para utilizarlo, es importante cargarlo en su editor, disponer de Node.JS e introducir los siguientes comandos:

* npm install
* npm start

También debe de establecer un conjunto de variables de entorno:

* REACT_APP_GENERAL_URL: dirección web para el acceso al Backend estructurado.
* REACT_APP_SESSIONS_URL: dirección web para el acceso al Backend de datos.

### BACKEND ESTRUCTURADO
Desarrollado en Java Spring. Aquí se administra la funcionalidad y compatibilidad de los componentes. Únicamente de necesita disponer del proyecto en un entorno de programación y elaborar el siguiente conjunto de variables de entorno:

* CLIENT_SECRET_PATH: ruta del fichero con el secreto del token de acceso al correo electrónico que emite los códigos de autenticación.
* DB_USERNAME: nombre del rol en la base de datos de MySQL.
* DB_PASSWORD: contraseña del rol en la base de datos de MySQL.
* ENCRYPTION_CODE: código utilizado para la encriptación AES-256 de los datos más sensibles.
* DB_URL: URL de la base de datos.

### BACKEND DE DATOS
Desarrollado en Java Spring. Aquí se administra la funcionalidad y compatibilidad de los datos en bruto y estructuras más flexibles del sistema. Se emplean las siguientes variables de entorno:

* ENCRYPTION_CODE: código utilizado para la encriptación AES-256 de los datos más sensibles.
* AUTH_URL: ruta a la verificación de tokens del Backend anterior. Por defecto, introduzca "http://localhost:8081/token/checkToken?token=".

## ALMACENAMIENTO DE DATOS
### MYSQL
Para los datos estructurados se utiliza MySQL. Únicamente necesita crear una BBDD con dicho sistema de gestión de bases de datos e introducir las credenciales tal y como se ha detallado anteriormente. La creación de tablas se realizará de manera automática tras la ejecución del Backend Estructurado.

### MONGODB
Deberá crear su base de datos MongoDB y crear la estructura manualmente, además de introducir las respectivas credenciales. Para mayor referencia de la estructura, simplemente debe crear el siguiente conjunto de colecciones:
<img width="180" height="200" alt="image" src="https://github.com/user-attachments/assets/1b2ec95f-e872-498f-9ff6-b96f41f43bf9" />

### AVISO: ESTE PROYECTO SIGUE EN DESARROLLO. LA INFORMACIÓN ACTUAL PUEDE VARIAR, EMITA UN ISSUE PARA RESOLVER CUALQUIER CUESTIÓN.
