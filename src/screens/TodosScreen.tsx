import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import TodoItem from '../components/TodoItem';
import { useTheme } from '../context/ThemeContext';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const BASE_URL = 'http://10.0.2.2:5000/api/todos';

const TodosScreen = () => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTodos(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(BASE_URL, {
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
      const res = await axios.put(`${BASE_URL}/${id}`, updated);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const deleteAllTodos = async () => {
    try {
      await axios.delete(BASE_URL);
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

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: '#00ff88' }]} />
      </View>
      <Text style={[styles.percentText, { color: isDark ? '#0f0' : '#080' }]}>
        {progress.toFixed(0)}%
      </Text>

      {/* Add Task */}
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              backgroundColor: isDark ? '#1f1f2e' : '#f2f2f2',
            },
          ]}
          placeholder="What needs to be done?"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={styles.addBtnText}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
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
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Clear All */}
      {todos.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={deleteAllTodos}>
          <Text style={styles.clearText}>Clear All 🧹</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 6,
  },
  percentText: {
    marginTop: 2,
    marginBottom: 12,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 6,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 12,
  },
  addBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  addBtnText: {
    fontSize: 18,
    color: '#000',
  },
  clearBtn: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    backgroundColor: '#ff4d4f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
