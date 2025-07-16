# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY . .

# Grant execute permission for gradlew
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Copy the JAR file to the container
COPY build/libs/BE-0.0.1-SNAPSHOT.jar app.jar

# Run the Spring Boot application
CMD ["java", "-Xmx256m", "-Xms128m", "-jar", "app.jar"] 