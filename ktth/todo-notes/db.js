// db.js
import * as SQLite from "expo-sqlite";

let db;
export function getDB() {
  if (!db) {
    // Sử dụng openDatabaseSync cho expo-sqlite phiên bản mới
    db = SQLite.openDatabaseSync("todos.db");
  }
  return db;
}

// Tiện ích Promise hóa executeSql cho code gọn gàng
// Sử dụng API mới: getAllSync cho SELECT, runSync cho INSERT/UPDATE/DELETE
export function execSql(sql, params = []) {
  const database = getDB();
  return new Promise((resolve, reject) => {
    try {
      const sqlUpper = sql.trim().toUpperCase();
      const isSelect = sqlUpper.startsWith("SELECT");
      
      if (isSelect) {
        // SELECT query - dùng getAllSync
        const rows = database.getAllSync(sql, params);
        // Tạo object tương thích với API cũ
        resolve({
          rows: {
            length: rows.length,
            item: (index) => rows[index] || {},
            _array: rows
          },
          insertId: undefined,
          rowsAffected: rows.length
        });
      } else {
        // INSERT, UPDATE, DELETE - dùng runSync
        const result = database.runSync(sql, params);
        resolve({
          rows: {
            length: 0,
            item: () => ({}),
            _array: []
          },
          insertId: result.lastInsertRowId,
          rowsAffected: result.changes || 0
        });
      }
    } catch (error) {
      console.error("SQL Error:", error, "SQL:", sql, "Params:", params);
      reject(error);
    }
  });
}
