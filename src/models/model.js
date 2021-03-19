const db = require('../db/db').db;
const ModelError = require('./modelError');

/**
 * Model
 */
class Model {
    /**
     * @param sql SQL text
     * @return
     */
    findAll(sql) {
        return new Promise((resolve, reject) => {
            db.all(sql, (error, rows) => {
                if(error) {
                    reject(new ModelError(20, 'Internal Server Error'));
                }
                /*
                else if(rows === null || rows.length === 0) {
                    reject(new ModelError(21, 'Entity Not Found'));
                }

                 */
                else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * @param sql SQL text
     * @param params parameters
     * @return first element of search, 0 if none found
     */
    findOne(sql, params) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(sql);

            stmt.all(params, (error, rows) => {
                if(error) {
                    reject(new ModelError(11, 'Invalid Arguments'));
                }
                else if(rows === null || rows.length === 0) {
                    reject(new ModelError(21, 'Entity Not Found'));
                }
                else {
                    const row = rows[0];
                    resolve(row);
                }
            });
        });
    }

    /**
     * @param sql SQL text
     * @param params parameters
     * @return 1 on update, 0 if rejected
     */
    run(sql, params) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(sql);

            stmt.run(params, function(error) {
                if(this.changes === 1) {

                    resolve(this.lastID);
                }
                else if(this.changes === 0) {
                    reject(new ModelError(21, 'Entity Not Found'));
                }
                else {
                    reject(new ModelError(11, 'Invalid Arguments'));
                }
            });
        });
    }
}

module.exports = Model;
