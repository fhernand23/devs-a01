FROM gradle:jdk17 as builder

COPY --chown=gradle:gradle . /home/gradle/src

WORKDIR /home/gradle/src

RUN gradle clean build -x test

FROM openjdk:17.0.2 as finalApp

ENTRYPOINT ["sudo", "mkdir", "/app/"]

WORKDIR app

COPY --from=builder /home/gradle/src/build/libs/api-0.0.1-SNAPSHOT.jar /app

EXPOSE 8091

ENTRYPOINT ["java", "-jar", "/app/api-0.0.1-SNAPSHOT.jar"]