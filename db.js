const mysql=require('mysql');

let connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"instagram"
})

connection.connect(function(err){
    if(err) throw err
    console.log("db connected");
})

module.exports=connection;