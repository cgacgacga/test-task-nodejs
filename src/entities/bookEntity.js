'use strict'

class BookEntity {
    /**
     *
     * @param book_available
     * @param book_name
     * @param user_id
     */
    constructor(book_available, book_name, user_id) {
        this.book_available = book_available;
        this.book_name = book_name;
        this.user_id = user_id;
    }
}
module.exports = BookEntity