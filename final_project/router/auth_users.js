const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const {getBookByIsbn} = require('../functions/booksFunctions')
const regd_users = express.Router();

let users = [
    {
        username: 'user1',
        password: 'pass1',
    },
    {
        username: 'user2',
        password: 'pass2',
    },
    {
        username: 'user3',
        password: 'pass3',
    },
    {
        username: 'ehsan',
        password: 'abc123',
    },
];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
    const user = users.filter(u => u.username == username)
    if (user.length > 0) {
        return false
    }
    return true
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    try {
        const [user] = users.filter(u => u.username == username)
        const isValidPassword = user.password == password
        if (isValidPassword) {
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({ code: 400, message: "username / password empty" })
        }

        if (authenticatedUser(username, password)) {

            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({ code: 200, message: `${username} logged in!` })
        }
        return res.status(401).json({ code: 401, message: 'username and password does not match.' })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { isbn } = req.params
    const { review } = req.query
    const { username } = req.session.authorization
    try {
        if (!isbn) {
            console.error("isbn empty")
            return res.status(400).json({ code: 400, message: 'isbn empty' })
        }
        if (!review) {
            console.error("review empty")
            return res.status(400).json({ code: 400, message: 'review empty' })
        }
        const book = getBookByIsbn({ isbn, books })

        let existingReview = book[isbn].reviews

        const newReview = {
            [username]: review
        }

        books[isbn].reviews = {
            ...existingReview,
            ...newReview
        }

        return res.status(201).json(books[isbn])
    } catch (error) {
        return res.status(error.code || 500).json({ code: error.code || 500, message: error.message })
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
