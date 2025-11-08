// App.js
// Q3: Màn hình danh sách (UI + Hooks)
// Q4: Thêm mới (Modal/Form)
// Q5: Toggle hoàn thành (UPDATE)
// Q6: Sửa tiêu đề (EDIT)
// Q7: Xoá (DELETE) có xác nhận
// Q8: Tìm kiếm/Filter real-time (Hooks)
// Q9: Import từ API (Đồng bộ 1 lần) - nút "Đồng bộ API"
// Q10: Hoàn thiện UI/UX (pull-to-refresh, disabled state,...)

import React, { useMemo, useState } from 'react';
import {
  Alert, FlatList, Modal, Pressable, RefreshControl,
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import useTodos from './hooks/useTodos';

export default function App() {
  // Q10: Tách custom hook quản lý toàn bộ logic CRUD + search + import
  const {
    todos, loading, refreshing,
    search, setSearch,
    onRefresh,
    addTodo, toggleDone, updateTitle, deleteTodo,
    importFromApi,
    filteredCount,
  } = useTodos();












  

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, {id, title}
  const [title, setTitle] = useState('');

  // Q4: Nút "＋" mở modal thêm mới
  const openAdd = () => { setEditing(null); setTitle(''); setModalVisible(true); };
  // Q6: Long-press/ nút "Sửa" mở modal edit
  const openEdit = (item) => { setEditing(item); setTitle(item.title); setModalVisible(true); };

  // Q4/Q6: Submit: thêm mới hoặc cập nhật title
  const submit = async () => {
    if (editing) {
      const ok = await updateTitle(editing.id, title); // Q6: UPDATE title
      if (ok) setModalVisible(false);
    } else {
      const ok = await addTodo(title); // Q4: INSERT
      if (ok) setModalVisible(false);
    }
  };
















  // Q7: Xoá có Alert confirm
  const confirmDelete = (id) => {
    Alert.alert('Xóa công việc?', 'Bạn có chắc muốn xóa mục này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteTodo(id) }
    ]);
  };

  // Q5/Q6/Q7: Item hiển thị trạng thái, toggle done, mở sửa, xoá
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.done ? styles.itemDone : null]}
      onPress={() => toggleDone(item.id, item.done)}     // Q5: Toggle 0↔1
      onLongPress={() => openEdit(item)}                 // Q6: Long press để sửa
    >
      <Text style={[styles.title, item.done ? styles.titleDone : null]}>{item.title}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.badge} onPress={() => openEdit(item)}>
          <Text style={styles.badgeText}>Sửa</Text>      {/* Q6 */}
        </Pressable>
        <Pressable style={[styles.badge, styles.badgeDanger]} onPress={() => confirmDelete(item.id)}>
          <Text style={styles.badgeText}>Xóa</Text>      {/* Q7 */}
        </Pressable>
      </View>
    </TouchableOpacity>
  );

  // Q3/Q10: Empty state đẹp + useMemo để tránh rerender thừa
  const empty = useMemo(() => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>Chưa có việc nào</Text>
      <Text style={styles.emptySub}>Nhấn “+” để thêm việc đầu tiên</Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Q1: Chạy được expo start + StatusBar */}
      <StatusBar />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Todo Notes</Text>
        {/* Q8/Q10: Đếm số mục sau filter */}
        <Text style={styles.headerSub}>{filteredCount} mục</Text>
      </View>

      <View style={styles.toolbar}>
        {/* Q8: Search real-time (client/SQL LIKE) */}
        <TextInput
          placeholder="Tìm kiếm..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {/* Q9: Nút Đồng bộ API + loading state (disabled khi loading) */}
        <TouchableOpacity disabled={loading} onPress={importFromApi} style={[styles.syncBtn, loading && styles.btnDisabled]}>
          <Text style={styles.syncText}>{loading ? 'Đang đồng bộ...' : 'Đồng bộ API'}</Text>
        </TouchableOpacity>
      </View>

      {/* Q3: FlatList từ SQLite; Q10: Pull-to-refresh */}
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      {/* Q4: FAB mở modal thêm */}
      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      {/* Q4/Q6: Modal thêm/sửa + validate title trống */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Sửa công việc' : 'Thêm công việc'}</Text>
            <TextInput
              placeholder="Nhập tiêu đề"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              autoFocus
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              {/* Q4/Q10: Nút Lưu disabled khi title trống */}
              <TouchableOpacity style={[styles.btn, !title.trim() && styles.btnDisabled]} disabled={!title.trim()} onPress={submit}>
                <Text style={styles.btnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 16, paddingTop: 24 },
  headerTitle: { color: 'white', fontWeight: '800', fontSize: 24 },
  headerSub: { color: '#a3a3a3', marginTop: 4 },
  toolbar: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  search: { flex: 1, backgroundColor: '#1f2937', color: 'white', borderRadius: 10, paddingHorizontal: 12, height: 44 },
  syncBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  syncText: { color: 'white', fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },

  item: { backgroundColor: '#111827', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1f2937' },
  itemDone: { backgroundColor: '#0b1220', borderColor: '#0b5e0b' },
  title: { color: 'white', fontSize: 16 },
  titleDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  badge: { backgroundColor: '#334155', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  badgeDanger: { backgroundColor: '#b91c1c' },
  badgeText: { color: 'white', fontWeight: '600' },

  emptyBox: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#9ca3af', marginTop: 6 },

  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabPlus: { color: 'white', fontSize: 28, lineHeight: 28 },

  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { width: '100%', backgroundColor: '#0b1220', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1f2937' },
  modalTitle: { color: 'white', fontWeight: '800', fontSize: 18, marginBottom: 10 },
  input: { backgroundColor: '#111827', color: 'white', height: 44, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btn: { backgroundColor: '#2563eb', borderRadius: 10, height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnGhost: { backgroundColor: '#334155' },
  btnText: { color: 'white', fontWeight: '700' },
});
