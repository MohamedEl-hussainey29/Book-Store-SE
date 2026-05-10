# ══════════════════════════════════════════════════════════
# STAGE 1 — BUILD
# Use Maven + Java 17 to compile and package the app
# ══════════════════════════════════════════════════════════
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first (so Maven downloads dependencies only when pom changes)
COPY pom.xml .

# Download all dependencies (cached layer — speeds up future builds)
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Build the project and skip tests (tests run separately)
RUN mvn clean package -DskipTests

# ══════════════════════════════════════════════════════════
# STAGE 2 — RUN
# Use only Java 17 (no Maven needed) — smaller final image
# ══════════════════════════════════════════════════════════
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]