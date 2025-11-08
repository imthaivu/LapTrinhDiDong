// db.js
import * as SQLite from "expo-sqlite";

let db;
export function getDB() {
  if (!db) {
    db = SQLite.openDatabase("todos.db");
  }
  return db;
}

// Tiện ích Promise hóa executeSql cho code gọn gàng
export function execSql(sql, params = []) {
  const database = getDB();
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return true; // báo lỗi để rollback
        }
      );
    });
  });
}
