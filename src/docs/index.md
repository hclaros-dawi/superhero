# Proyecto de superhéroes - Angular

1. Instalación y Configuración

### - **Clonación del repositorio** 
Ejecuta el siguiente comando en la terminal para clonar el proyecto:  
```sh
git clone https://github.com/hclaros-dawi/superhero.git
```

### - **Instalación de dependencias** 
Navega al directorio del proyecto e instala todas las dependencias necesarias
```sh
cd superhero
npm install
```

2. Ejecución (Windows)

### Servidor de desarrollo Angular
Ejecuta el siguiente comando y accede a la aplicación en el navegador (http://localhost:4200):
```sh
ng serve
```

### Servidor Mock (json-server)
Para levantar el servidor JSON de pruebas (http://localhost:3000), ejecuta en otra terminal:
```sh
npx json-server --watch db.json --port 3000
```

3. Endpoints de prueba

- [http://localhost:4200](http://localhost:4200) - Aplicación principal  

- [http://localhost:3000/heroes](http://localhost:3000/heroes) - Listado completo de héroes 

- [http://localhost:3000/heroes/1](http://localhost:3000/heroes/1) - Detalle de un héroe específico 
