# Ecommerce Store with MERN Stack

Welcome to the Ecommerce Store project! This is a full-stack ecommerce application built using the MERN (MongoDB, Express, React, Node.js) stack, designed to help you master your development skills. The project utilizes Tailwind CSS for styling and offers a seamless shopping experience for users.
## Demo

Check out the live demo of the project: [Demo URL](https://pridestore.vercel.app/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: Download and install Node.js from the official website (https://nodejs.org/).

### Cloning the Repository

Clone the repository to your local machine using the following command:

```
git clone https://github.com/ZiaSandhu/ecommerce_MERN.git
```

### Installation

Navigate to the project root directory and install the required dependencies for both the server and the client:

```bash
cd ecommerce-store
npm install
```

### Configuration

In order to set up the project correctly, you'll need to configure the backend and frontend URLs.

#### Backend Configuration

Navigate to the `server` directory and open the `config.js` file. Replace `[YOUR_BACKEND_URL]` with the URL where your backend server will be running. This is important for establishing the connection between the frontend and the backend.
Secodnly, open `server/index.js` and change your frontend Url.
Or you can create a .env file and paste following code
```javascript
// server/.env
PORT = 5000
URI= your mongo db uri
BASE_URL = http://localhost:5000
REFRESH_TOKEN = somesuperhardstring
ACCESS_TOKEN = somesuperhardstring
```

#### Frontend Configuration

Navigate to the `client/src/api/internal` directory and open the `index.js` file. Replace `[your backend url]` with the URL where your backend application will be accessible.


### Starting the Project

To start the project, simply run the following command from the root directory:

```bash
npm start
```

This will concurrently start both the backend and frontend servers. Your application will be accessible at `[YOUR_FRONTEND_URL]`.

## Features

- Browse through a wide range of products.
- Add products to your cart for future purchase.
- Secure user authentication and registration.
- Checkout process with various payment options.
- Order history to track your past purchases.

## Built With

- MongoDB - Database for storing product and user information.
- Express - Backend framework for handling server-side logic.
- React - Frontend library for building user interfaces.
- Node.js - Runtime environment for server-side scripting.
- Tailwind CSS - Utility-first CSS framework for styling.

## Acknowledgments

This project was developed as part of improving MERN stack development skills. Special thanks to the creators of the tools and libraries used in this project.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize and enhance the project according to your needs. Happy coding! 🚀