# Simple Chat App

Simple Chat is a real-time messaging application that allows users to send and receive messages from various electronic devices. This documentation provides an overview of the technologies used in both the frontend and backend of the application.

[![Demo](https://img.shields.io/badge/Click-Me)](https://youtu.be/N8a33GPYxbU) VIDEO (Deployed stopped because GCloud provider high costs 😭)

<a href="https://youtu.be/N8a33GPYxbU" target="_blank">
    <img src="https://static.vecteezy.com/system/resources/previews/003/431/826/original/neon-chat-icon-vector.jpg" alt="drawing" width="200"/>
</a>

## Key Features

- Real-time message sending.
- Intuitive and user-friendly interface.
- Compatibility with multiple devices.

## Technologies Used

### Frontend

The frontend of Simple Chat is primarily built with ReactJS, a widely used JavaScript library for building user interfaces. Additionally, other technologies and libraries have been used, including:

- React Router: For application routing.
- Axios: For server communication.
- (Other relevant technologies and libraries).

### Backend

The backend of the application is a simple Node.js application, utilizing the NestJS framework. NestJS facilitates the creation of RESTful APIs and, in this case, the integration of WebSockets for real-time messaging. The backend handles business logic, user authentication, and message management. Relevant technologies include:

- WebSockets for real-time communication.
- PostgreSQL database deployed on Render for data persistence.
- TypeORM for data modeling.

### Google Cloud

The Simple Chat backend is deployed on Google Cloud Platform (GCP) using Google App Engine Flex. This cloud platform provides scalability and high availability for the application. Google App Engine Flex allows running custom Docker containers, making deployment and management of the application easier.

### Future Implementations

To enhance scalability and response speed, there are plans to implement a caching layer using Redis. Redis is an in-memory database commonly used as a cache to accelerate retrieval of frequently requested data. The implementation of Redis Cache will improve message delivery speed and user experience.