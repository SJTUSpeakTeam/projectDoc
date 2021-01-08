FROM openjdk:15-jdk-alpine
WORKDIR /app
COPY target/*.jar /app
ENTRYPOINT ["java", "-jar", "spillyourheart-0.0.1.jar"]
EXPOSE 30392
