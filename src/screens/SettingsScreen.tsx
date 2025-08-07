import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Settings</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? '#eee' : '#000' }]}>🌙 Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? '#eee' : '#000' }]}>🔔 Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? '#eee' : '#000' }]}>🔄 Auto Sync</Text>
        <Switch value={autoSync} onValueChange={setAutoSync} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'center',
  },
  label: { fontSize: 16 },
});
