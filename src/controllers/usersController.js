const Controller = require('./controller');
const UserModel  = require('../models/userModel');
const UserEntity = require('../entities/userEntity');

/**
 * Users Controller
 */
class UsersController {
    /**
     * constructor
     */
    constructor() {
        this.controller = new Controller();
        this.userModel = new UserModel();
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
        const id = req.params.id;

        this.userModel.findById(id)
            .then(this.controller.findSuccess(res))
            .catch(this.controller.findError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    create(req, res) {
        const user = new UserEntity();
        // user.id = req.body.id;
        user.name = req.body.name;
        user.age = req.body.age;

        this.userModel.create(user)
            .then(this.controller.createSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    update(req, res) {
        const user = new UserEntity(req.body.id, req.body.name, req.body.age);

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

module.exports = UsersController;
