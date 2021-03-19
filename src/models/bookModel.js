const Model = require('./model');
const BookEntity = require('../entities/bookEntity');

/**
 * Book Model
 */
class BookModel {
    constructor() {
        this.model = new Model();
    }

    getAllByUserId(user_id) {
        const sql = `
      SELECT
          book_id,
          book_available,
          book_name,
          user_id
      FROM
          books
      WHERE
          user_id = $user_id
    `;
        const params = {
            $user_id: user_id
        };

        return this.model.findAll(sql, params)
            .then((rows) => {
                const books = [];
                for(const row of rows) {
                    books.push(new BookEntity(row.book_id, row.book_available, row.book_name, row.user_id));
                }
                return books;
            });
    }

    findById(book_id) {
        const sql = `
      SELECT
          book_id
          book_available,
          book_name,
          user_id
      FROM
          books
      WHERE
          book_id = $book_id
    `;
        const params = {
            $book_id: book_id
        };

        return this.model.findOne(sql, params)
            .then((row) => {
                return new BookEntity(row.book_id, row.book_available, row.book_name, row.user_id);
            });
    }


    create(book) {
        const sql = `
      INSERT INTO books (
          book_available,
          book_name,
          user_id
      ) VALUES (
          $book_available,
          $book_name,
          $user_id
      )
    `;
        const params = {
            $book_available: book.book_available,
            $book_name: book.book_name,
            $user_id : book.user_id
        };

        return this.model.run(sql, params)
            .then((book_id) => {
                return this.findById(book_id);
            });
    }

    update(book) {
        const sql = `
      REPLACE INTO books (
          book_id,
          book_available,
          book_name,
          user_id
      ) VALUES (
          $book_id,
          $book_available,
          $book_name,
          $user_id
      )
    `;
        const params = {
            $book_id  : book.book_id,
            $book_available: book.book_available,
            $book_name: book.book_name,
            $user_id : book.user_id
        };
        console.log("update");
        return this.model.run(sql, params);
    }


    delete(book_id) {
        const sql = `
      DELETE FROM
          users
      WHERE
          book_id = $book_id
    `;
        const params = {
            $book_id: book_id
        };

        return this.model.run(sql, params);
    }

    giveBookAway(book_id) {
        const sql = `
        
        
    `;
    }
}

module.exports = BookModel;
