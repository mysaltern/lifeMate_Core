You can add the section about setting `NODE_ENV` before starting the application right after the **Installation** or **Prerequisites** section, where it fits most naturally. Here's an updated version of your README with that section included:

---

# Digital Doll Core (NestJS Project)

This repository serves as the core backend for a **Digital Doll** platform, built using the **NestJS** framework. The project is designed to operate as a **microservice-based architecture**, providing modularity, scalability, and flexibility for future enhancements.

---

## Overview

This project is currently **under development** and forms the backbone of the Digital Doll system. It features a set of **microservices** that handle distinct responsibilities while communicating through **Kafka** as the message broker. The system is fully **containerized with Docker**, ensuring portability, easier deployment, and streamlined scaling.

---

## Features

- **Microservices Architecture**: Enables modular and independent development of core components.
- **Kafka Integration**: Facilitates communication between services using a reliable message broker.
- **Scalability**: Built with scalability in mind to handle increasing user demands.
- **NestJS Framework**: Provides a robust and maintainable foundation for backend services.
- **Dockerized Environment**: Simplifies deployment with pre-configured Docker containers.

---

## Microservices

### 1. **API Service**
- Handles common endpoint management and acts as the entry point for external interactions.
- To run:
  ```bash
  npm run start:dev api
  ```

### 2. **ChatGPT Service**
- Manages AI interactions and communication through GPT-based solutions.
- To run:
  ```bash
  npm run start:dev chatgpt
  ```

### 3. **Auth Service**
- Manages user authentication and authorization using `TypeORM` and PostgreSQL.
- To run:
  ```bash
  npm run start:dev auth
  ```

### 4. **TTS (Text-to-Speech) Service**
- Provides text-to-speech capabilities for the Digital Doll.
- To run:
  ```bash
  npm run start:dev tts
  ```

---

## Prerequisites

- **Node.js** (v16 or later)
- **Nest CLI** (for development convenience)
- **Docker** (for containerization)
- **Kafka** (set up as the message broker)
- **PostgreSQL** (for database management)

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables for each service. Create `.env` files in their respective directories with the necessary configurations.

4. Build the Docker containers:
   ```bash
   docker-compose build
   ```

5. Start all services using Docker:
   ```bash
   docker-compose up -d
   ```

---

## Setting `NODE_ENV`

Before starting your application, ensure `NODE_ENV` is set manually in the terminal based on the environment:

### Linux/Mac:
```bash
export NODE_ENV=development
npm run start
```

### Windows (Command Prompt):
```cmd
set NODE_ENV=development
npm run start
```

### Windows (PowerShell):
```powershell
$env:NODE_ENV="development"
npm run start
```

---

## Dockerized Architecture

The project has been fully Dockerized for seamless setup and operation. Below are the key components defined in the `docker-compose.yml` file:

- **API Service**: Runs on port `3000`.
- **ChatGPT Service**: Runs on port `3001`.
- **Auth Service**: Runs on port `3002`.
- **TTS Service**: Runs on port `3003`.
- **PostgreSQL Database**: Runs on port `5433` and stores application data.

### Example Commands

1. Build a specific service:
   ```bash
   docker-compose build <service-name>
   ```

2. Run a specific service:
   ```bash
   docker-compose up -d <service-name>
   ```

3. Stop all services:
   ```bash
   docker-compose down
   ```

---

## Future Plans

- Add more microservices for enhanced functionality.
- Implement monitoring and logging for better observability.
- Expand Kafka integration for more robust inter-service communication.
- Add advanced CI/CD pipelines for automated deployment.

---

## Contribution

Feel free to contribute to this project by submitting issues, feature requests, or pull requests. All contributions are welcome!

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

### Notes
This README will evolve as the project matures. Stay tuned for updates! 🚀

---

This update provides clear instructions on how to set `NODE_ENV` for different environments and operating systems. It's now ready for developers to follow when starting the application locally!