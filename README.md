# Express Book Reviews API

Final project for IBM Back-End Development with Node.js and Express course on Coursera.

## Description
A RESTful API for managing book reviews with user authentication.

## Features
- Get list of books
- Search books by ISBN, author, or title
- User registration and login
- Add/modify/delete book reviews (authenticated users only)
- Async/await implementation

## Technologies Used
- Node.js
- Express.js
- JWT Authentication
- Session Management

## Installation

1. Clone the repository
```bash
git clone https://github.com/HikenR4/expressBookReviews.git
```

2. Install dependencies
```bash
npm install
```

3. Run the server
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Public Routes
- `GET /` - Get all books
- `GET /isbn/:isbn` - Get book by ISBN
- `GET /author/:author` - Get books by author
- `GET /title/:title` - Get books by title
- `GET /review/:isbn` - Get book reviews
- `POST /register` - Register new user

### Authenticated Routes
- `POST /customer/login` - User login
- `PUT /customer/auth/review/:isbn` - Add/modify review
- `DELETE /customer/auth/review/:isbn` - Delete review

## Author
Your Name - Coursera Final Project