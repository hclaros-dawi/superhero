# Superheroes Project - Angular

1. Installation and Setup

### - ** Cloning the repository** 
Run the following command in the terminal to clone the project:
```sh
git clone https://github.com/hclaros-dawi/superhero.git
```

### - **Installing dependencies** 
Navigate to the project directory and install all necessary dependencies:
```sh
cd superhero
npm install
```

2. Running (Windows)

### Angular Development Server
Run the following command and access the application in your browser (http://localhost:4200):
```sh
ng serve
```

### Mock Server (json-server)
To start the mock JSON server (http://localhost:3000), run it in another terminal:
```sh
npx json-server --watch db.json --port 3000
```

3. Test Endpoints

- [http://localhost:4200](http://localhost:4200) - Main application  

- [http://localhost:3000/heroes](http://localhost:3000/heroes) - Complete list of heroes 

- [http://localhost:3000/heroes/1](http://localhost:3000/heroes/1) - Details of a specific hero 
