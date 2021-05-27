const { json } = require('express');
const mysql = require('mysql');
let connection = mysql.createConnection({
    host:'localhost',
    password: '',
    user: 'root',
    database: 'weread'
})

function login_validation({email, password}){
    let Query = `select * from user where Email = '${email}' and Password = '${password}'`;
    console.log(Query);
    return new Promise((resolve, reject)=>{
        connection.query(Query, (err, rows, fields)=>{
            if(err){
                reject(err);
            }
           // console.log(rows);
            if(rows.length > 0){
                resolve(JSON.parse(JSON.stringify(rows[0])));
            }
            else{
                reject('user not found');
            }
        })
    })
}

function get_all_books(){
    let Query = `SELECT Id, Title, Description, Title, Author, dt.Ratting FROM book LEFT JOIN (SELECT SUM(Ratting)/COUNT(RATTING) as Ratting, BookId from review GROUP by BookId) dt ON dt.BookId = book.Id`;
    console.log(Query);
    return new Promise((resolve, reject)=>{
        connection.query(Query, (err, rows, fields)=>{
            if(err){
                reject(err);
            }
            resolve(JSON.parse(JSON.stringify(rows)));
        })
    })
}

function get_reviews({Id}){
    let Query = `SELECT Name, dt.Ratting, dt.Comment from user JOIN (SELECT Comment, Ratting, UserId from review WHERE BookId = ${Id}) dt on user.Id = dt.UserId`
    console.log(Query);
    return new Promise((resolve, reject)=>{
        connection.query(Query, (err, rows, fields)=>{
            if(err){
                reject(err);
            }
            resolve(JSON.parse(JSON.stringify(rows)));
        })
    });
}

function add_review({comment, ratting, book_id}, user_id){
    let Query = `delete from review where BookId=${book_id} and UserId = ${user_id}`;
    console.log(Query);
    return new Promise((resolve, reject)=>{
        connection.query(Query, (err)=>{
            if(err){
                reject(err);
            }
            let Query = `Insert into review (BookId, UserId, Comment, Ratting) values(${book_id}, ${user_id} , '${comment}', ${ratting} )`;
            connection.query(Query, (err, rows, fields)=>{
                if(err){
                    reject(err);
                }
                resolve('Posted Successfully');
            })
        })
    })
}



module.exports.login_validation = login_validation;
module.exports.get_all_books = get_all_books;
module.exports.get_reviews = get_reviews;
module.exports.add_review = add_review;