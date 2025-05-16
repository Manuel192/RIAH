FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/riah_backend_data.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "app.jar"]