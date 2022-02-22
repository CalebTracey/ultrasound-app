#FROM maven:3.6.3 AS maven
#WORKDIR /usr/src/app
#COPY . /usr/src/app
## Compile and package the application to an executable JAR
#RUN mvn package
#
## For Java 11,
#FROM azul/zulu-openjdk-alpine:11
#
#ARG JAR_FILE=app-0.0.1-SNAPSHOT.jar
#
#WORKDIR /opt/app
#ENV PORT 8080
#EXPOSE 8080
## Copy the spring-boot-api-tutorial.jar from the maven stage to the /opt/app directory of the current stage.
#COPY --from=maven /usr/src/app/target/${JAR_FILE} /opt/app/
#
#ENTRYPOINT ["java","-jar","app-0.0.1-SNAPSHOT.jar"]

#### Stage 1: Build the application
FROM openjdk:16-jdk as build

WORKDIR /app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

# Build all the dependencies in preparation to go offline.
# This is a separate step so the dependencies will be cached unless
# the pom.xml file has changed.
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

#### Stage 2: A minimal docker image with command to run the app
FROM openjdk:16-jdk

ARG DEPENDENCY=/app/target/dependency

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java", "-Dserver.port=8080","-classpath","app:app/lib/*","com.ultrasound.app.AppApplication"]

# docker-compose pull
# docker-compose up --force-recreate --build -d
# heroku container:push web --app employee-dashboard