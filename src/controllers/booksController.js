const Controller = require('./controller');
const BookModel  = require('../models/bookModel');
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
        this.userModel = new BookModel();
    }

    /**
     * @param res Response
     */
    findAll(res) {
        this.userModel.findAll()
            .then(this.controller.findSuccess(res))
            .catch(this.controller.findError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    findById(req, res) {
        const book_id = req.params.book_id;

        this.userModel.findById(book_id)
            .then(this.controller.findSuccess(res))
            .catch(this.controller.findError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    create(req, res) {
        const book = new BookEntity();
        // user.id = req.body.id;
        book.book_name = req.body.book_name;
        book.book_available = req.body.book_available;


        this.userModel.create(book)
            .then(this.controller.createSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    update(req, res) {
        const user = new BookEntity(req.body.book_available, req.body.name, req.body.age);

        this.userModel.update(user)
            .then(this.controller.editSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    delete(req, res) {
        const id = req.params.id;

        this.userModel.delete(id)
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
}

module.exports = BooksController;
