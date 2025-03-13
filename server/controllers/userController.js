const inMemoryDB = require('../models/inMemoryDB');

// Get user by id
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = inMemoryDB.findUser(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new user
const createUser = (req, res) => {
  try {
    const { name, ageGroup, parentEmail } = req.body;
    
    // Validate required fields
    if (!ageGroup) {
      return res.status(400).json({ message: 'Age group is required' });
    }
    
    // Validate age group
    if (ageGroup !== 'preStudents' && ageGroup !== 'elementary') {
      return res.status(400).json({ message: 'Invalid age group' });
    }
    
    // Create user
    const newUser = inMemoryDB.createUser({
      name: name || 'Kid Explorer',
      ageGroup,
      parentEmail,
      createdAt: new Date()
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, ageGroup, parentEmail } = req.body;
    
    // Check if user exists
    const existingUser = inMemoryDB.findUser(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const updatedUser = inMemoryDB.updateUser(id, {
      ...(name && { name }),
      ...(ageGroup && { ageGroup }),
      ...(parentEmail && { parentEmail }),
      updatedAt: new Date()
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = inMemoryDB.findUser(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    inMemoryDB.deleteUser(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
