interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  constructor() {
    console.log('UserService initialized');
  }

  addUser(user: User): void {
    if (!user.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.users.push(user);
    console.log(`User ${user.name} added successfully`);
  }

  getActiveUsers(): User[] {
    const activeUsers = this.users.filter((user) => user.isActive);
    console.debug(`Found ${activeUsers.length} active users`);
    return activeUsers;
  }

  getUserById(id: number): User | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      console.error(`User with id ${id} not found`);
    }
    return user;
  }

  updateUser(id: number, updates: Partial<User>): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }

    this.users[index] = { ...this.users[index], ...updates };
    return true;
  }

  deleteUser(id: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < initialLength;
  }
}

const processUserData = async (userData: any[]): Promise<User[]> => {
  console.log('Processing user data...');

  const validUsers: User[] = [];

  for (const data of userData) {
    try {
      if (!data.name || !data.email) {
        console.warn('Invalid user data:', data);
        continue;
      }

      const user: User = {
        id: data.id || Math.random() * 1000,
        name: data.name,
        email: data.email,
        isActive: data.isActive ?? true,
      };

      validUsers.push(user);
    } catch (error) {
      console.error('Error processing user:', error);
    }
  }

  console.log(`Processed ${validUsers.length} valid users`);
  return validUsers;
};

const _unusedVariable = 'This will trigger a warning';

function _deprecatedFunction() {
  console.trace('This function is deprecated');
  const result = Math.random() * 100;
  console.table({ result });
  return result;
}

export { UserService, processUserData, User };
