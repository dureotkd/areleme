import { PoolConnection, QueryError, RowDataPacket } from 'mysql2';

import db from './database';
import { Service } from 'typedi';
import { empty } from '../../utils/valid';

type InsertParams = {
  table: string;
  data: {};
};

type UpdateParams = {
  table: string;
  data: {};
  where: string[];
};

type DuplicateParams = {
  table: string;
  insertData: {};
  updateData: {};
};

type executeParams = {
  database?: string;
  sql: string;
  type: 'all' | 'row' | 'one' | 'exec';
  debug?: boolean;
};

@Service()
export default class ModelService {
  /**
   * * MAKE MYSQL INSERT 쿼리문
   */
  getInsertQuery({ table, data }: InsertParams) {
    const column = Object.keys(data);
    const values = Object.values(data);

    if (column.length !== values.length) {
      new Error('Error Object Key Value!');
    }

    const c = '`' + column.join('`,`') + '`';
    const v = values.join("','");

    return `INSERT INTO ${table}(${c}) VALUES ('${v}');`;
  }

  /**
   * * MAKE MYSQL UPDATE 쿼리문
   */
  getUpdateQuery({ table, data, where }: UpdateParams) {
    let c = '';

    for (const [column, value] of Object.entries(data)) {
      c += `${column}='${value}',`;
    }

    const rc = c.slice(0, -1);
    const rw = where.join(' AND ');

    return `UPDATE ${table} SET ${rc} WHERE ${rw};`;
  }

  getDuplicateQuery({ table, insertData, updateData }: DuplicateParams) {
    const i_column = Object.keys(insertData);
    const i_values = Object.values(insertData);

    if (i_column.length !== i_values.length) {
      new Error('Error Object Key Value!');
    }

    const c = i_column.join(',');
    const v = i_values.join("','");

    let update = '';

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
  execute({ database = 'areleme', sql, type, debug = false }: executeParams): Promise<any> {
    return new Promise(function (resolve, reject) {
      db.getConnection(database, function (err: NodeJS.ErrnoException | null, connection: PoolConnection) {
        if (debug === true) {
          console.log('zz');
          console.log(sql);
          resolve(true);
          connection.release();
          return;
        }

        if (err) {
          console.log(err);
          reject(err);
        } else {
          connection.query(sql, function (err: QueryError | null, data: RowDataPacket) {
            if (err) {
              console.log('DB 쿼리 오류', err);
              // reject(new Error('query error'));
              reject(null);
            } else {
              switch (type) {
                case 'all':
                  resolve(data);
                  break;
                case 'row':
                  if (data && data.length > 0) {
                    resolve(data[0]);
                  } else {
                    resolve([]);
                  }

                  break;

                case 'one':
                  resolve(!empty(data[0]['cnt']) ? data[0]['cnt'] : 0);
                  break;

                case 'exec':
                  if (data && data.insertId !== undefined) {
                    resolve(data.insertId);
                  } else {
                    reject(null);
                  }

                  break;

                default:
                  reject(new Error('execute type error'));

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
