const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors");
const config = require("../app_config.json");

//Connect to a database
const connectDB = (database) => {
    var dbCred = {
        host: config.SQL_HOST,
        user: config.SQL_USER,
        password: config.SQL_PASSWORD,
        database: database
    }

    var con = mysql.createConnection(dbCred);
    con.connect((err) => { if(err) throw err; });
    return con;
}

//Execute query on a database and returns a structured response;
const execQuery = async (db, query) => {
    var response = {
        database:  db.config.database,
        status: "success",
        payload: []
    };

    var response = await new Promise( (resolve) => {
        db.query(query, (err, results) => {
            if(err) {
                response.status = "error";
                response.payload = err.sqlMessage;
            }else{
                response.payload = results;
            }
            resolve(response);
        })
    })
    
    return response;
}

//----- MAKE DB CONNECTIONS -----
const db1 = connectDB(config.DB1);
const db2 = connectDB(config.DB2);

//----- EXPRESS MIDDLEWARES -----
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); // allow CORS for testing locally with different server endpoints

//----- EXPRESS ROUTING -----
app.get("/", (_, res) => res.send("Welcome to SQL Comp API! But it seems you are at the wrong end point, please send a 'POST' SQL query to /api/executeQuery."));

app.post("/api/executeQuery", async (req, res) => {
    var query = req.body.query;
    res.json([await execQuery(db1, query), await execQuery(db2, query)]);
})

app.listen(config.API_PORT, () => console.log("SQL COMP APP LISTENING ON PORT 8000"))
