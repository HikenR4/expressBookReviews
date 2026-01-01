const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    for (let key in books) {
        if (books[key].isbn === isbn) {
            return res.send(books[key]);
        }
    }
    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = [];
    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }
    if (result.length > 0) {
        return res.send(result);
    } else {
        return res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = [];
    for (let key in books) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }
    if (result.length > 0) {
        return res.send(result);
    } else {
        return res.status(404).json({ message: "Book with this title not found" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    for (let key in books) {
        if (books[key].isbn === isbn) {
            return res.send(books[key].reviews);
        }
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async-await with Axios
function getAllBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/async/books', async function (req, res) {
    try {
        const bookList = await getAllBooks();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book by ISBN using Promises
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        for (let key in books) {
            if (books[key].isbn === isbn) {
                resolve(books[key]);
                return;
            }
        }
        reject({ message: "Book not found" });
    });
}

public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then(book => res.send(book))
        .catch(error => res.status(404).json(error));
});

// Get books by author using async-await
async function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        let result = [];
        for (let key in books) {
            if (books[key].author === author) {
                result.push(books[key]);
            }
        }
        if (result.length > 0) {
            resolve(result);
        } else {
            reject({ message: "Books by this author not found" });
        }
    });
}

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const bookList = await getBooksByAuthor(author);
        res.send(bookList);
    } catch (error) {
        res.status(404).json(error);
    }
});

// Get books by title using async-await
async function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        let result = [];
        for (let key in books) {
            if (books[key].title === title) {
                result.push(books[key]);
            }
        }
        if (result.length > 0) {
            resolve(result);
        } else {
            reject({ message: "Book with this title not found" });
        }
    });
}

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const bookList = await getBooksByTitle(title);
        res.send(bookList);
    } catch (error) {
        res.status(404).json(error);
    }
});

module.exports.general = public_users;