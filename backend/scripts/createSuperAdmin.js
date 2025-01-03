const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shiv');
    
    // Check if super admin already exists
    const existingAdmin = await User.findOne({ userType: 1 });
    if (existingAdmin) {
      console.log('Super admin already exists!');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = new User({
      username: 'superadmin', // Change this to your desired username
      password: 'admin123!@#', // Change this to your desired password
      userType: 1
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Username:', superAdmin.username);
    console.log('Password: admin123!@#'); // Log the password before it's hashed
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdmin(); 