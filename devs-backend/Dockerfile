FROM gradle:jdk17 as builder

WORKDIR /home/gradle/src

COPY --chown=gradle:gradle . .

RUN gradle clean build -x test

FROM openjdk:17.0.2 as finalApp

WORKDIR /app

COPY --from=0 /home/gradle/src/build/libs/api-0.0.1-SNAPSHOT.jar .

EXPOSE 8091

ENTRYPOINT ["java", "-jar", "/app/api-0.0.1-SNAPSHOT.jar"]