const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('db.sqlite3');

/** DB INIT */
const init = () => {
    /*
    Books db contains 4 fields
    book_id - to distinguish books
    book_available - to monitor if the book is in the library
    book_name - book"s name
    user_id - id in users table to know which user took the book
     */
    db.run("CREATE TABLE IF NOT EXISTS books (\n" +
        "    book_id        INTEGER    PRIMARY KEY AUTOINCREMENT\n" +
        "                              UNIQUE\n" +
        "                              NOT NULL,\n" +
        "    book_available BOOLEAN,\n" +
        "    book_name      TEXT (127),\n" +
        "    user_id        INTEGER    REFERENCES users (user_id) \n" +
        ");");
    /*
    Users db contains 4 fields
    user_id - to distinguish users
    user_expiry_date - milliseconds time when users pass will expire
    user_name - name of user
    super_user - boolean that tells if user can take infinite amount of books
     */
    db.run("CREATE TABLE IF NOT EXISTS users (\n" +
        "    user_id          INTEGER PRIMARY KEY AUTOINCREMENT\n" +
        "                             UNIQUE,\n" +
        "    user_expiry_date INTEGER,\n" +
        "    user_name        TEXT,\n" +
        "    super_user       BOOLEAN\n" +
        ");", function(err) {
        if (err) {
            return console.log(err.message);
        }
    })

    db.run("INSERT OR REPLACE INTO users(user_id, user_expiry_date, user_name, super_user) VALUES(?,?,?,?)", [1, 1893456000000, "Library", true], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("Initialized library super user");
    });
};

module.exports = {
    db: db,
    init: init
};
