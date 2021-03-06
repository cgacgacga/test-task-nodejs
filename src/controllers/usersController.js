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
        user.user_name = req.body.user_name;
        user.user_expiry_date = req.body.user_expiry_date;
        user.super_user = req.body.super_user;

        this.userModel.create(user)
            .then(this.controller.createSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    update(req, res) {
        const user = new UserEntity(req.body.user_id, req.body.user_expiry_date, req.body.user_name, req.body.super_user);

        this.userModel.update(user)
            .then(this.controller.editSuccess(res))
            .catch(this.controller.editError(res));
    }

    /**
     * @param req request
     * @param res response
     */
    delete(req, res) {
        const user_id = req.params.user_id;

        this.userModel.delete(user_id)
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
