const Controller = require('./controller');
const BookModel  = require('../models/bookModel');
const UserModel  = require('../models/userModel');
const BookEntity = require('../entities/bookEntity');

/**
 * Books Controller
 */
class BooksController {
    /**
     * constructor
     */
    constructor() {
        this.controller = new Controller();
        this.bookModel = new BookModel();
        this.userModel = new UserModel();
    }

    /**
     * @param res Response
     */
    findAll(res) {
        this.bookModel.findAll()
            .then(this.controller.findSuccess(res))
            .catch(this.controller.findError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    findById(req, res) {
        const book_id = req.params.book_id;

        this.bookModel.findById(book_id)
            .then(this.controller.findSuccess(res))
            .catch(this.controller.findError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    create(req, res) {
        const book = new BookEntity();
        book.book_id = req.body.book_id;
        book.book_name = req.body.book_name;


        this.bookModel.create(book)
            .then(this.controller.createSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    update(req, res) {
        const book = new BookEntity(req.body.book_id, req.body.book_available, req.body.book_name, req.body.user_id);

        this.bookModel.update(book)
            .then(this.controller.editSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    delete(req, res) {
        const book_id = req.params.book_id;

        this.bookModel.delete(book_id)
            .then(this.controller.editSuccess(res))
            .catch((error) => {
                if(error.errorCode === 21) {
                    // 404, если не было цели удаления
                    return this.controller.deleteError(res)();
                }
                else {
                    return this.controller.editError(res)();
                }
            });
    }

    giveBookAway(req, res) {
        const book_id = req.params.book_id;
        const user_id = req.body.user_id;
        console.log('0');
        return this.bookModel.findById(book_id)
            .then((response) => {
                console.log('1');
                if (response.book_available == 1) {
                    console.log('2');
                    const updatedBook = new BookEntity(Number(book_id), false, response.book_name, user_id);

                    return Promise.all([this.userModel.findById(user_id), this.bookModel.getAllByUserId(user_id)])
                        .then(([user, books]) => {
                            console.log('3');
                            if (user.user_expiry_date > Date.now() && books.length <= 5) {
                                console.log('4');
                                return this.bookModel.update(updatedBook);
                            }
                            return Promise.resolve();
                    })
                        .then(this.controller.editSuccess(res))
                        .catch(this.controller.editError(res));
                }
                return this.controller.editSuccess(res);
            }).catch(this.controller.editError(res));
    }


    returnBook(req, res) {
        const book_id = req.params.book_id;

        return this.bookModel.findById(book_id)
            .then((response) => {
                console.log("here");
                const updatedBook = new BookEntity(Number(book_id), true, response.book_name, 1);
                return this.bookModel.update(updatedBook)
                    .then(this.controller.editSuccess(res));
            })
            .catch(this.controller.editError);
    }
}

module.exports = BooksController;
