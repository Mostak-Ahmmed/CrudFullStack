const API_URL = 'http://192.168.31.118:5000/users'; // use your local IP for real device

// Fetch all users
export const getUsers = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  } catch (err) {
    console.error('getUsers error:', err);
    return [];
  }
};

// Create a new user
export const createUser = async (user: any) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return await res.json();
  } catch (err) {
    console.error('createUser error:', err);
    return null;
  }
};

// Delete user by ID
export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
  } catch (err) {
    console.error('deleteUser error:', err);
  }
};
