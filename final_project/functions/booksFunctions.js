class ErrorsHandling {
    constructor({ code, message }) {
        this.code = code
        this.message = message
    }
}

function getBookByIsbn({ isbn, books }) {
    try {
        const book = Object.fromEntries(Object.entries(books).filter(([isbnNumber, book]) => isbnNumber == isbn))
        if (Object.keys(book).length == 0) {
            throw new ErrorsHandling({ code: 404, message: `Book with this Isbn : ${isbn} does not found` })
        }
        return book
    } catch (error) {
        throw error
    }

}
function getBookByAuthor({ author, books }) {
    try {
        const book = Object.fromEntries(Object.entries(books).filter(([isbnNumber, book]) => book.author == author))
        if (Object.keys(book).length == 0) {
            throw new ErrorsHandling({ code: 404, message: `Book with this Author : ${author} does not found` })
        }
        return book
    } catch (error) {
        throw error
    }

}
function getBookByTitle({ title, books }) {
    try {
        const book = Object.fromEntries(Object.entries(books).filter(([isbnNumber, book]) => book.title == title))
        if (Object.keys(book).length == 0) {
            throw new ErrorsHandling({ code: 404, message: `Book with this Title ${title} does not found` })
        }
        return book
    } catch (error) {
        throw error
    }

}

module.exports = { getBookByIsbn, getBookByAuthor, getBookByTitle }