/**
 * User Entity
 */
class UserEntity {
    constructor(user_id, user_expiry_date, user_name, super_user) {
        this.user_id = user_id;
        this.user_expiry_date = user_expiry_date;
        this.user_name  = user_name;
        this.super_user = super_user;
    }
}

module.exports = UserEntity;
