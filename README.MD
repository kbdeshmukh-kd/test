# Spring Boot request management application

This project is a Spring Boot 3.2 rewrite of the original Struts 2 sample.
It exposes the same screens for creating new institutions or branches and for
listing stored entries, but now uses Spring MVC controllers, Thymeleaf
templates and JSON endpoints.

## Requirements

* Java 17 or later
* Maven 3.9+

## Running the application

```bash
mvn spring-boot:run
```

The application starts on [http://localhost:8080](http://localhost:8080).

* `http://localhost:8080/request` – form to submit new institutions or branches.
* `http://localhost:8080/listrequest` – table with the stored institutions.

Institution data is persisted in a JSON file located at `./data/requests.json`.
The file is created automatically on first run and can be customised with the
`app.data-file` property in `application.properties`.

To build an executable JAR use:

```bash
mvn clean package
java -jar target/ejemplo1-0.0.1-SNAPSHOT.jar
```
