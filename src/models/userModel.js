const Model = require('./model');
const UserEntity = require('../entities/userEntity');

/**
 * User Model
 */
class UserModel {
  constructor() {
    this.model = new Model();
  }

  findAll() {
    const sql = `
      SELECT
          user_id,
          user_expiry_date,
          user_name,
          super_user
      FROM
          users
    `;
    
    return this.model.findAll(sql)
      .then((rows) => {
        const users = [];
        
        for(const row of rows) {
          users.push(new UserEntity(row.user_id, row.user_expiry_date, row.user_name, row.super_user));
        }
        
        return users;
      });
  }
  

  findById(user_id) {
    const sql = `
      SELECT
          user_id,
          user_expiry_date,
          user_name,
          super_user
      FROM
          users
      WHERE
          user_id = $user_id
    `;
    const params = {
      $user_id: user_id
    };
    
    return this.model.findOne(sql, params)
      .then((row) => {
        return new UserEntity(row.user_id, row.user_expiry_date, row.user_name, row.super_user);
      });
  }
  

  create(user) {
    const sql = `
      INSERT INTO users (
          user_expiry_date,
          user_name,
          super_user
      ) VALUES (
          $user_expiry_date,
          $user_name,
          $super_user
      )
    `;
    const params = {
      $user_expiry_date: user.$user_expiry_date,
      $user_name: user.user_name,
      $super_user : user.super_user
    };
    
    return this.model.run(sql, params)
      .then((user_id) => {
        return this.findById(user_id);
      });
  }
  
  update(user) {
    const sql = `
      REPLACE INTO users (
          user_expiry_date,
          user_name,
          super_user
      ) VALUES (
          $user_expiry_date,
          $user_name,
          $super_user
      )
    `;
    const params = {
      $user_expiry_date: user.user_expiry_date,
      $user_name: user.user_name,
      $super_user : user.super_user
    };
    
    return this.model.run(sql, params);
  }
  

  delete(user_id) {
    const sql = `
      DELETE FROM
          users
      WHERE
          user_id = $user_id
    `;
    const params = {
      $user_id: user_id
    };
    
    return this.model.run(sql, params);
  }
}

module.exports = UserModel;
