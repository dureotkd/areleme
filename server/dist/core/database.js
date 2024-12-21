import mysql from "mysql2";
const database = mysql.createPoolCluster();
database.add("areleme", {
    host: "211.238.133.10",
    user: "root",
    password: "@slsksh33@",
    database: "areleme",
    port: 3306,
});
export default database;
