const express = require("express");
const sqlite3 = require("sqlite3");
const http = require("http");

const app = express();
const server = http.createServer(app);
const db = new sqlite3.Database("C:\\Users\\Артём\\WebstormProjects\\test-task-nodejs\\src\\db\\db.sqlite3");

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
    ");")

db.run("INSERT OR REPLACE INTO users(user_id, user_expiry_date, user_name, super_user) VALUES(?,?,?,?)", [1, 1893456000000, "Library", true], function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log("Initialized library super user");
});


// CREATE BOOK
app.get("/addBook/:book_id/:book_name", function(req,res) {
    db.serialize(()=>{
        console.log(req.params);
        db.run("INSERT INTO books(book_id, book_available, book_name, user_id) VALUES(?,?,?,?)", [req.params.book_id, 1, req.params.book_name, 1], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("New book has been added");
            res.send("New book has been added into the database with ID = "+ req.params.book_id+ " and Name = "+ req.params.book_name);
        });

    });

});


// READ BOOK
app.get("/viewBook/:book_id", function(req,res){
    db.serialize(()=>{
        db.run("SELECT book_id BOOK_ID, book_available BOOK_AVAILABLE, book_name BOOK_NAME, user_id USER_ID" +
            " FROM books WHERE book_id =?", [req.params.book_id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
            if(err){
                res.send("Error encountered while dislaying");
                return console.error(err.message);
            }
            res.send("BOOK_ID:" + row.BOOK_ID + "," +
                            "BOOK_AVAILABLE:" + row.BOOK_AVAILABLE + "," +
                            "BOOK_NAME:" + row.BOOK_NAME + "," +
                            "USER_ID:" + row.USER_ID
            );
            console.log("Entry dislayed successfully");
        });
    });
});


//GIVE BOOK TO USER
app.get("/giveBook/:book_id/:user_id", function(req,res){
    db.serialize(()=>{
        db.run("UPDATE books SET book_available = 0, user_id = ? WHERE book_id = ?",
            [req.params.user_id,req.params.book_id], function(err){
            if(err){
                res.send("Error encountered while giving Book with ID:" + req.params.book_id + " to user " +
                    "with id:" + req.params.user_id);
                return console.error(err.message);
            }
            res.send("Book with ID:" + req.params.book_id + " given successfully to user " +
                "with id:" + req.params.user_id);
            console.log("Book with ID:" + req.params.book_id + " given successfully to user " +
                "with id:" + req.params.user_id);
        });
    });
});


//RETURN BOOK TO LIBRARY
app.get("/returnBook/:book_id", function(req,res){
    db.serialize(()=>{
        db.run("UPDATE books SET book_available = 1, user_id = 1 WHERE book_id = ?",
            [req.params.book_id], function(err){
                if(err){
                    res.send("Error encountered while returning the book with id:" + req.params.book_id);
                    return console.error(err.message);
                }
                res.send("Book with id:" + req.params.book_id + " successfully returned");
                console.log("Book with id:" + req.params.book_id + " successfully returned");
            });
    });
});


// Closing the database connection.
app.get("/close", function(req,res){
    db.close((err) => {
        if (err) {
            res.send("There is some error in closing the database");
            return console.error(err.message);
        }
        console.log("Closing the database connection.");
        res.send("Database connection successfully closed");
    });

});

//157766400000 - 5 years in milliseconds
let five_years_in_milliseconds = 157766400000
// CREATE USER
app.get("/addUser/:user_id/:user_name", function(req,res) {
    db.serialize(()=>{
        console.log(req.params);
        db.run("INSERT INTO users(user_id, user_expiry_date, user_name, super_user) VALUES(?,?,?,?)",
            [req.params.user_id, Date.now() + five_years_in_milliseconds, req.params.user_name, 0],
            function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("New user has been added into the database with ID = "+ req.params.user_id+ " and Name = "+ req.params.user_name);
            res.send("New user has been added into the database with ID = "+ req.params.user_id+ " and Name = "+ req.params.user_name);
        });

    });

});


//UPDATE USER'S NAME
app.get("/editUser/:user_id/:user_name", function(req,res){
    db.serialize(()=>{
        db.run("UPDATE users SET user_name = ? WHERE user_id = ?",
            [req.params.user_name,req.params.user_id], function(err){
                if(err){
                    res.send("Error encountered while updating user's with ID:" + req.params.user_id + " name to" + req.params.user_name);
                    return console.error(err.message);
                }
                res.send("User's with ID:" + req.params.user_id + " name successfully changed to " +
                     req.params.user_name);
                console.log("User's with ID:" + req.params.user_id + " name successfully changed to " +
                    req.params.user_name);
            });
    });
});

//DELETE USER
app.get('/del/:user_id', function(req,res){
    db.serialize(()=>{
        db.run('DELETE FROM users WHERE user_id = ?', req.params.user_id, function(err) {
            if (err) {
                res.send("Error encountered while deleting user with id:" + req.params.user_id);
                return console.error(err.message);
            }
            res.send("deleted user with id:" + req.params.user_id);
            console.log("deleted user with id:" + req.params.user_id);
        });
    });
});

//GET USER INFO
app.get('/viewUserInfo/:user_id', function(req,res){
    db.serialize(()=>{
        db.each('SELECT user_name USER_NAME, user_expiry_date USER_EXPIRY_DATE, super_user SUPER_USER FROM users WHERE user_id =?',
            [req.params.user_id], function(err, row){
            if(err){
                res.send("Error encountered while displaying users info");
                return console.error(err.message);
            }
            res.send("USER:" + req.params.user_id + "," +
                "USER_EXPIRY_DATE:" + row.USER_EXPIRY_DATE + "," +
                "USER_NAME:" + row.USER_NAME + "," +
                "SUPER_USER:" + row.SUPER_USER
            );
            console.log("Entry displayed successfully");
        });
    });
});

//GET USER'S BOOKS
app.get('/viewUserBooks/:user_id', function(req,res){
    db.serialize(()=>{
        let booksData = {};
        booksData["books"] = [];

        db.each('SELECT book_id BOOK_ID, book_name BOOK_NAME FROM books WHERE user_id =?',
            [req.params.user_id], function(err, row){

            if(err){
                res.send("Error encountered while displaying users books");
                return console.error(err.message);
            }
            let singleBookData = {};
            singleBookData.book_id = row.BOOK_ID;
            singleBookData.book_name = row.BOOK_NAME;
            booksData["books"].push(singleBookData);

            console.log("Entry displayed successfully");
        },
            function(){
                res.json(booksData);
            }
        );
    });
});

server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});
