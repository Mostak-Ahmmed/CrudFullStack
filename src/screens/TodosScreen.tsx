import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import TodoItem from '../components/TodoItem';
import { useTheme } from '../context/ThemeContext';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const TodosScreen = () => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', {
        title: newTask,
      });
      setTodos([...todos, res.data]);
      setNewTask('');
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const updateTodo = async (id: string, updated: Partial<Todo>) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, updated);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const deleteAllTodos = async () => {
    try {
      await axios.delete('http://localhost:5000/api/todos');
      setTodos([]);
    } catch (err) {
      console.error('Delete all error:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#111' }]}>Today's Tasks 👀</Text>
      <Text style={[styles.subtext, { color: isDark ? '#ccc' : '#333' }]}>
        {completedCount} of {todos.length} completed
      </Text>
      <Text style={[styles.progressText, { color: isDark ? '#0f0' : '#080' }]}>
        {progress.toFixed(0)}%
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#666' : '#aaa' }]}
          placeholder="What needs to be done?"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={styles.addBtnText}>➕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => updateTodo(item._id, { completed: !item.completed })}
            onDelete={() => deleteTodo(item._id)}
            onEdit={(title) => updateTodo(item._id, { title })}
          />
        )}
      />

      <TouchableOpacity style={styles.clearBtn} onPress={deleteAllTodos}>
        <Text style={styles.clearBtnText}>Clear All 🚨</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtext: { fontSize: 16 },
  progressText: { marginBottom: 12, fontSize: 16, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 4,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#0d6efd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addBtnText: { color: '#fff', fontSize: 18 },
  clearBtn: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
  },
  clearBtnText: { color: '#fff', fontWeight: 'bold' },
});
