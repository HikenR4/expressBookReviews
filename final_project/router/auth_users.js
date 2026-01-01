const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if username and password match
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization['username'];

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    for (let key in books) {
        if (books[key].isbn === isbn) {
            books[key].reviews[username] = review;
            return res.status(200).json({ 
                message: "Review successfully added/updated",
                reviews: books[key].reviews
            });
        }
    }
    return res.status(404).json({ message: "Book not found" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    for (let key in books) {
        if (books[key].isbn === isbn) {
            if (books[key].reviews[username]) {
                delete books[key].reviews[username];
                return res.status(200).json({ 
                    message: "Review successfully deleted",
                    reviews: books[key].reviews
                });
            } else {
                return res.status(404).json({ message: "Review not found for this user" });
            }
        }
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;