import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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

  const handleEdit = () => {
    if (isEditing && editedText.trim()) onEdit(editedText);
    setIsEditing(!isEditing);
  };

  return (
    <View style={[styles.item, { backgroundColor: isDark ? '#333' : '#eee' }]}>
      <TouchableOpacity onPress={onToggle}>
        <Text style={[styles.checkbox, todo.completed && styles.checked]}>
          {todo.completed ? '✔' : '◻'}
        </Text>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedText}
          onChangeText={setEditedText}
          onSubmitEditing={handleEdit}
        />
      ) : (
        <Text style={[styles.title, todo.completed && styles.completed]} onLongPress={handleEdit}>
          {todo.title}
        </Text>
      )}

      <TouchableOpacity onPress={handleEdit}>
        <Text style={styles.editBtn}>{isEditing ? '💾' : '✏️'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkbox: { fontSize: 18, marginRight: 10 },
  checked: { color: 'green' },
  title: { flex: 1, fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: '#777' },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 2,
  },
  editBtn: { marginLeft: 10, fontSize: 18 },
  deleteBtn: { marginLeft: 10, fontSize: 18 },
});
