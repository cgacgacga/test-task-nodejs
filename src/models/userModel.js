const Model = require('./model');
const UserEntity = require('../entities/userEntity');

/**
 * User Model
 */
class UserModel {
  constructor() {
    this.model = new Model();
  }
  
  /**
   *
   * @return Entity の配列を Resolve する
   */
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
          users.push(new UserEntity(row.id, row.name, row.age));
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
        return new UserEntity(row.id, row.name, row.age);
      });
  }
  

  create(user) {
    // ID は自動採番させる
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
      .then((id) => {
        return this.findById(id);
      });
  }
  
  update(user) {
    const sql = `
      REPLACE INTO users (
          user_id,
          user_expiry_date,
          user_name,
          super_user
      ) VALUES (
          $user_id,
          $user_expiry_date,
          $user_name,
          $super_user
      )
    `;
    const params = {
      $user_id  : user.user_id,
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
          id = $id
    `;
    const params = {
      $user_id: user_id
    };
    
    return this.model.run(sql, params);
  }
}

module.exports = UserModel;
