# Proyecto de superhéroes - Angular

## 1. Requisitos Técnicos

| Tecnología       | Versión    |
|------------------|------------|
| Angular CLI      | 18.2.15    |
| Node.js          | 20.19.0    |
| npm              | 10.8.2     |
| TypeScript       | 5.5.4      |
| Angular Material | 18.2.14    |
| RxJS             | 7.8.2      |
| json-server      | 0.17.4     |

---

## 2. Instalación y Configuración

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

## 3. Ejecución (Windows)

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

## 4. Endpoints de prueba

- [http://localhost:4200](http://localhost:4200) - Aplicación principal  

- [http://localhost:3000/heroes](http://localhost:3000/heroes) - Listado completo de héroes 

- [http://localhost:3000/heroes/1](http://localhost:3000/heroes/1) - Detalle de un héroe específico 

## 5. Estructura del proyecto

```bash
src/
│   db.json
│   index.html
│   main.ts
│   styles.css
│   styles.css.map
│   styles.scss
│
├── app/
│   │   app.component.css
│   │   app.component.css.map
│   │   app.component.html
│   │   app.component.scss
│   │   app.component.spec.ts
│   │   app.component.ts
│   │   app.config.ts
│   │   app.routes.ts
│   │
│   ├── components/
│   │   ├── crear/
│   │   │   ├── crear.component.html
│   │   │   ├── crear.component.scss
│   │   │   ├── crear.component.spec.ts
│   │   │   ├── crear.component.ts
│   │   │
│   │   ├── editar/
│   │   │   ├── editar.component.html
│   │   │   ├── editar.component.scss
│   │   │   ├── editar.component.spec.ts
│   │   │   ├── editar.component.ts
│   │   │
│   │   ├── eliminar/
│   │   │   ├── eliminar.component.html
│   │   │   ├── eliminar.component.scss
│   │   │   ├── eliminar.component.spec.ts
│   │   │   ├── eliminar.component.ts
│   │   │
│   │   ├── footer/
│   │   │   ├── footer.component.html
│   │   │   ├── footer.component.scss
│   │   │   ├── footer.component.spec.ts
│   │   │   ├── footer.component.ts
│   │   │
│   │   ├── home/
│   │       ├── home.component.html
│   │       ├── home.component.scss
│   │       ├── home.component.spec.ts
│   │       ├── home.component.ts
│   │
│   ├── interfaces/
│   │   ├── heroeinterface.ts
│   │
│   ├── servicios/
│       ├── heroe.service.spec.ts
│       ├── heroe.service.ts
│
├── docs/
│   ├── index.md
