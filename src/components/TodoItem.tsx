import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (title: string) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.title);

  const handleEditSave = () => {
    if (isEditing && editedText.trim()) {
      onEdit(editedText);
      setIsEditing(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isDark ? '#1a1a2e' : '#f0f0f0' },
      ]}
    >
      <TouchableOpacity onPress={onToggle}>
        <Text style={[styles.check, { color: todo.completed ? '#00ff88' : '#888' }]}>
          {todo.completed ? '✔' : '◻'}
        </Text>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          value={editedText}
          onChangeText={setEditedText}
          placeholder="Edit task..."
          placeholderTextColor="#999"
          style={[
            styles.editInput,
            { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#2e2e3e' : '#fff' },
          ]}
        />
      ) : (
        <Text
          onLongPress={() => setIsEditing(true)}
          style={[
            styles.taskText,
            { color: isDark ? '#fff' : '#000' },
            todo.completed && styles.completed,
          ]}
        >
          {todo.title}
        </Text>
      )}

      {isEditing ? (
        <View style={styles.editActions}>
          <TouchableOpacity onPress={handleEditSave}>
            <Text style={styles.saveBtn}>✅ Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelBtn}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.iconActions}>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  check: {
    fontSize: 20,
    paddingTop: 3,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  editInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  iconActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editIcon: {
    fontSize: 18,
    color: '#ffc107',
  },
  deleteIcon: {
    fontSize: 18,
    color: '#ff4d4f',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  saveBtn: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelBtn: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
