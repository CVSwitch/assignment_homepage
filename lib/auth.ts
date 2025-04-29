// Simple authentication service using localStorage
export interface User {
  id: string;
  username: string;
  email: string;
}

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123' // In a real app, this would be hashed
  }
];

export const auth = {
  // Sign in with username and password
  signIn: async (username: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Store user in localStorage
    const userData = { id: user.id, username: user.username, email: user.email };
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  },
  
  // Sign out
  signOut: () => {
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  }
}; 