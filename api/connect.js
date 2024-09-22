import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "mariusbo_root",
    password: "bB571174000",
    database: "social"
});