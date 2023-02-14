const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const { getBookByIsbn, getBookByAuthor, getBookByTitle } = require('../functions/booksFunctions')
const public_users = express.Router();
const axios = require('axios')
const http = require('http')

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registered successfully. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params
  try {
    const book = getBookByIsbn({ isbn, books })
    return res.status(200).json(book);
  } catch (error) {
    return res.status(error.code).json(error)
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const { author } = req.params
  try {
    const book = getBookByAuthor({ author, books })
    return res.status(200).json(book);
  } catch (error) {
    return res.status(error.code).json(error)
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const { title } = req.params
  try {
    const book = getBookByTitle({ title, books })
    return res.status(200).json(book);
  } catch (error) {
    return res.status(error.code).json(error)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params
  try {
    const book = getBookByIsbn({ isbn, books })
    if (!book[isbn].reviews) {
      return res.status(404).json({ message: `Book with this Isbn ${isbn} dont have any reviews` })
    }
    return res.status(200).json(book[isbn].reviews);
  } catch (error) {
    return res.status(error.code || 500).json(error)
  }
});

const axiosAction = {
  // fetching the list of books available in the shop using callback
  fetchAllBooks: async () => {

    http.get('http://localhost:5000/', res => {
      let data = ''
      res.on('error', e => {
        console.error(err.response ? err.response.data : err.message)
      })
      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        console.log(JSON.parse(data))
      })
    })
  },


  // fetching the list of book by isbn using promise
  fetchBookByIsbn: (isbn) => {
    axios.get('http://localhost:5000/isbn/' + isbn).then(res => {
      console.log(res.data)
    }).catch(err => { console.error(err.response ? err.response.data : err.message) })
  },

  // fetching the list of book by author
  fetchBookByAuthor: async (author) => {
    try {
      const { data } = await axios.get('http://localhost:5000/author/' + author)
      console.log(data)
    } catch (error) {
      console.error(error.response ? error.response.data : error.message)
    }
  },

  // fetching the list of book by title
  fetchBookByTitle: async (title) => {
    try {
      const { data } = await axios.get('http://localhost:5000/title/' + title)
      console.log(data)
    } catch (error) {
      console.error(error.response ? error.response.data : error.message)
    }
  },
}

axiosAction.fetchAllBooks()
axiosAction.fetchBookByIsbn(1)
axiosAction.fetchBookByAuthor('Dante Alighieri')
axiosAction.fetchBookByTitle('Pride and Prejudice')

module.exports.general = public_users;
