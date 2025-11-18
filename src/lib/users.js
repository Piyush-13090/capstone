import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read users from file
export function getUsers() {
  ensureDataDirectory();
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save users to file
function saveUsers(users) {
  ensureDataDirectory();
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Find user by email
export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
}

// Create new user
export async function createUser(name, email, password) {
  const users = getUsers();
  
  // Check if user already exists
  if (getUserByEmail(email)) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user object
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // Add user to array
  users.push(newUser);
  
  // Save to file
  saveUsers(users);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

// Verify password
export async function verifyPassword(email, password) {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

