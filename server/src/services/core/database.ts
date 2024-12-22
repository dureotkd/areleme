import mysql, { PoolCluster } from "mysql2";

import config from "../../config";

const database: PoolCluster = mysql.createPoolCluster();

database.add("areleme", {
  host: config.db.host,
  user: config.db.id,
  password: config.db.pw,
  database: config.db.name,
  port: 3306,
});

export default database;
