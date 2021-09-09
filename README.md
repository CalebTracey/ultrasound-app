# react-spring-jwt

### Web application template. Created with React JS + Spring Boot + Spring Security + MongoDB

## Usage
1. Fork this repo

2. Download [Docker Desktop App](https://www.docker.com/products/docker-desktop)

3. Run the [Docker Compose](https://github.com/CalebTracey/react-spring-jwt/blob/main/docker-compose.yaml) file found in the base directory to start the data base.

4. Access the Mongo Express UI at: [localhost:8081](http://localhost:8081/)

5. Create "db_database" in Mongo Express. Then two collections, "roles" and "users".

6. In the "roles" collection, add "ROLE_USER" and you'll be all set to register.

## Available Scripts
for the server, from the project directory you can run:
<br />
<br />
`mvn spring-boot:run`
<br />
<br />
for the client, navigate to "react-client" and run:
<br />
<br />
`yarn start`
<br />
<br />
Then use the app locally on [localhost:3000](http://localhost:3000/)
<br />
<br />
To create an executable .jar file, in the project directory run:
<br />
<br />
`mvn package`
<br />
<br />
and
<br />
<br />
`java -jar target/app-0.0.1-SNAPSHOT.jar.original`
<br />
<br />
Then you're up and running on [localhost:8080](http://localhost:8080/)
