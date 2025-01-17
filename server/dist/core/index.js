import db from "./database";
export default class Core {
    /**
     * * MAKE MYSQL INSERT 쿼리문
     */
    getInsertQuery({ table, data }) {
        const column = Object.keys(data);
        const values = Object.values(data);
        if (column.length !== values.length) {
            new Error("Error Object Key Value!");
        }
        const c = column.join(",");
        const v = values.join("','");
        return `INSERT INTO ${table}(${c}) VALUES ('${v}');`;
    }
    /**
     * * MAKE MYSQL UPDATE 쿼리문
     */
    getUpdateQuery({ table, data, where }) {
        let c = "";
        for (const [column, value] of Object.entries(data)) {
            c += `${column}='${value}',`;
        }
        const rc = c.slice(0, -1);
        const rw = where.join(" AND ");
        return `UPDATE ${table} SET ${rc} WHERE ${rw};`;
    }
    getDuplicateQuery({ table, insertData, updateData }) {
        const i_column = Object.keys(insertData);
        const i_values = Object.values(insertData);
        if (i_column.length !== i_values.length) {
            new Error("Error Object Key Value!");
        }
        const c = i_column.join(",");
        const v = i_values.join("','");
        let update = "";
        for (const [column, value] of Object.entries(updateData)) {
            update += `${column}='${value}',`;
        }
        return `INSERT INTO ${table} (${c}) VALUES ('${v}') ON DUPLICATE KEY UPDATE ${update.slice(0, -1)};`;
    }
    /**
     * * MAKE MYSQL DELETE 쿼리문
     */
    getDeleteQuery() {
        console.log(`getDeleteQuery`);
    }
    /**
     * * 쿼리 DB 실행 함수
     * * new Promise 객체로 callback 없이 리턴값 받기
     * * all : 배열 전체 row : 오브젝트
     * ! 생성자에 정의된 타입에 맞춰주세요
     * ? Promise 객체에 대해서 자세히 공부해보기
     * ? Callback 함수에 대해서 자세히 공부해보기
     */
    excute({ database = "areleme", sql, type }) {
        return new Promise(function (resolve, reject) {
            db.getConnection(database, function (err, connection) {
                if (err) {
                    console.log(JSON.stringify(err));
                }
                else {
                    connection.query(sql, function (err, data) {
                        if (err) {
                            console.log("DB 쿼리 오류", err);
                            reject(new Error("query error"));
                        }
                        else {
                            switch (type) {
                                case "all":
                                    resolve(data);
                                    break;
                                case "row":
                                    if (data && data.length > 0) {
                                        resolve(data[0]);
                                    }
                                    else {
                                        reject(new Error("No data found"));
                                    }
                                    break;
                                case "exec":
                                    if (data && data.insertId !== undefined) {
                                        resolve(data.insertId);
                                    }
                                    else {
                                        reject(new Error("Insert ID not available"));
                                    }
                                    break;
                                default:
                                    reject(new Error("type error"));
                                    break;
                            }
                        }
                        // When done with the connection, release it.
                        connection.release();
                    });
                }
            });
        });
    }
}
