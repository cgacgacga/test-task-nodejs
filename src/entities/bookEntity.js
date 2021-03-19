'use strict'

class BookEntity {

    constructor(book_id, book_available, book_name, user_id) {
        this.book_id = book_id;
        this.book_available = book_available;
        this.book_name = book_name;
        this.user_id = user_id;
    }
}
module.exports = BookEntity