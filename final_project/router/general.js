const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;

let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 6 - Register a new user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});


// Task 10 - Get all books using Axios and Async/Await
public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get('http://localhost:5000/books');

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books"
        });

    }

});


// Internal route for retrieving books
public_users.get('/books', async function (req, res) {

    return res.status(200).json(books);

});


// Task 11 - Get book details based on ISBN using Axios and Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/books/${isbn}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

});


// Internal route for retrieving a book by ISBN
public_users.get('/books/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});


// Task 3 - Get book details based on author
public_users.get('/author/:author', function (req, res) {

    let author = req.params.author;
    let result = [];

    let keys = Object.keys(books);

    keys.forEach((isbn) => {

        if (books[isbn].author === author) {
            result.push(books[isbn]);
        }

    });

    return res.status(200).json(result);

});


// Task 4 - Get book details based on title
public_users.get('/title/:title', function (req, res) {

    let title = req.params.title;
    let result = [];

    let keys = Object.keys(books);

    keys.forEach((isbn) => {

        if (books[isbn].title === title) {
            result.push(books[isbn]);
        }

    });

    return res.status(200).json(result);

});


// Task 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {

    let isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});


module.exports.general = public_users;