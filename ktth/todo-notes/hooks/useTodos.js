// hooks/useTodos.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { execSql } from "../db";

// Q9: API mẫu: import 1 lần
const API_URL = "https://67e3d4fb2ae442db76d1c9ae.mockapi.io/todos";

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);     // Q9: state loading khi import
  const [refreshing, setRefreshing] = useState(false); // Q10: pull-to-refresh
  const [search, setSearch] = useState("");          // Q8: từ khoá lọc

  // Q2: Tạo bảng + seed nhẹ nếu trống
  const ensureTable = useCallback(async () => {
    await execSql(`CREATE TABLE IF NOT EXISTS todos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
done INTEGER DEFAULT 0,
created_at INTEGER
);`);

    const countRes = await execSql("SELECT COUNT(*) as c FROM todos");
    const c = countRes.rows.item(0).c;
    if (c === 0) {
      const now = Date.now();
      await execSql(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Welcome to Todo Notes", 0, now]
      );
      await execSql(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Tap to toggle done, long-press to edit", 0, now]
      );
    }
  }, []);

  // Q3/Q8: Load danh sách (có filter search — SQL LIKE để tối ưu)
  const loadTodos = useCallback(async (q = "") => {
    try {
      const like = `%${q.trim()}%`;
      const res = await execSql(
        q.trim()
          ? "SELECT * FROM todos WHERE title LIKE ? ORDER BY id DESC"
          : "SELECT * FROM todos ORDER BY id DESC",
        q.trim() ? [like] : []
      );
      const rows = [];
      for (let i = 0; i < res.rows.length; i++) {
        const item = res.rows.item(i);
        rows.push({
          ...item,
          done: item.done === 1 || item.done === true ? 1 : 0, // Q5: done chuẩn 0/1
        });
      }
      setTodos(rows);
    } catch (error) {
      console.error("Error loading todos:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách công việc");
    }
  }, []);

  // Q1/Q2: Khởi tạo DB rồi load dữ liệu
  useEffect(() => {
    const init = async () => {
      try {
        await ensureTable();
        await loadTodos();
      } catch (error) {
        console.error("Error initializing:", error);
        Alert.alert("Lỗi", "Không thể khởi tạo ứng dụng: " + error.message);
      }
    };
    init();
  }, [ensureTable, loadTodos]);

  // Q8: Reload khi search thay đổi (lọc real-time)
  useEffect(() => {
    loadTodos(search);
  }, [search, loadTodos]);

  // Q10: Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTodos(search);
    setRefreshing(false);
  }, [search, loadTodos]);

  // Q4: Thêm todo mới (INSERT + auto refresh)
  const addTodo = useCallback(
    async (title) => {
      if (!title.trim()) return false; // validate rỗng
      try {
        await execSql(
          "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
          [title.trim(), 0, Date.now()]
        );
        await loadTodos(search);
        return true;
      } catch (error) {
        console.error("Error adding todo:", error);
        Alert.alert("Lỗi", "Không thể thêm công việc: " + error.message);
        return false;
      }
    },
    [search, loadTodos]
  );



  

  // Q5: Toggle done 0↔1 (UPDATE + refresh)
  const toggleDone = useCallback(
    async (id, currentDone) => {
      try {
        const doneValue = currentDone === 1 || currentDone === true ? 1 : 0;
        const newDoneValue = doneValue === 1 ? 0 : 1;
        await execSql("UPDATE todos SET done = ? WHERE id = ?", [
          newDoneValue,
          id,
        ]);
        await loadTodos(search);
      } catch (error) {
        console.error("Error toggling done:", error);
        Alert.alert("Lỗi", "Không thể cập nhật trạng thái: " + error.message);
      }
    },
    [search, loadTodos]
  );
 
  // Q6: Sửa tiêu đề (UPDATE + refresh)
  const updateTitle = useCallback(
    async (id, title) => {
      if (!title.trim()) return false;
      try {
        await execSql("UPDATE todos SET title = ? WHERE id = ?", [
          title.trim(),
          id,
        ]);
        await loadTodos(search);
        return true;
      } catch (error) {
        console.error("Error updating title:", error);
        Alert.alert("Lỗi", "Không thể cập nhật công việc: " + error.message);
        return false;
      }
    },
    [search, loadTodos]
  );

  // Q7: Xoá (DELETE + refresh)
  const deleteTodo = useCallback(
    async (id) => {
      try {
        await execSql("DELETE FROM todos WHERE id = ?", [id]);
        await loadTodos(search);
      } catch (error) {
        console.error("Error deleting todo:", error);
        Alert.alert("Lỗi", "Không thể xóa công việc: " + error.message);
      }
    },
    [search, loadTodos]
  );

  // Q9: Import từ API (GET → merge, tránh title trùng, map completed→done, loading/error state)
  const importFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const items = data.slice(0, 20); // lấy 20 mục đầu
        let imported = 0;
        let skipped = 0;

        // Lấy danh sách title hiện có để chống trùng
        const existingRes = await execSql("SELECT title FROM todos");
        const existingTitles = new Set();
        for (let i = 0; i < existingRes.rows.length; i++) {
          existingTitles.add(
            existingRes.rows.item(i).title.trim().toLowerCase()
          );
        }

        for (const item of items) {
          const title = (item.title || item.name || "Untitled").trim();
          const titleLower = title.toLowerCase();

          if (existingTitles.has(titleLower)) {
            skipped++;
            continue;
          }

          // Map completed→done (boolean → 0/1)
          let done = 0;
          if (item.completed === true) done = 1;
          else if (item.completed === false) done = 0;
          else if (item.done === true) done = 1; // fallback

          await execSql(
            "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
            [title, done, Date.now()]
          );
          existingTitles.add(titleLower);
          imported++;
        }

        await loadTodos(search);
        Alert.alert(
          "Thành công",
          `Đã import ${imported} công việc${skipped > 0 ? `, bỏ qua ${skipped} mục trùng` : ""}`
        );
      } else {
        Alert.alert("Thông báo", "API không trả về dữ liệu");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đồng bộ từ API: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [search, loadTodos]);

  // Q8/Q10: Đếm số mục hiển thị sau filter (dùng useMemo)
  const filteredCount = useMemo(() => todos.length, [todos]);

  return {
    todos,
    loading,
    refreshing,
    search,
    setSearch,
    onRefresh,     // Q10
    addTodo,       // Q4
    toggleDone,    // Q5
    updateTitle,   // Q6
    deleteTodo,    // Q7
    importFromApi, // Q9
    filteredCount, // Q8/Q10
  };
}
