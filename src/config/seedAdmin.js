import User from '../models/User.js';
import config from './index.js';

/**
 * Seed a default admin user if none exists in the database.
 * Credentials are loaded from environment variables via config.
 */
const seedAdmin = async () => {
  try {
    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(`  Admin user already exists: ${existingAdmin.email}`);
      return;
    }

    // Create the default admin user
    const adminUser = new User({
      username: config.adminUsername,
      email: config.adminEmail,
      password: config.adminPassword,
      role: 'admin',
    });

    await adminUser.save();

    console.log(`==========================================`);
    console.log(`  ✅ Default admin user created!`);
    console.log(`  Email   : ${config.adminEmail}`);
    console.log(`  Password: ${config.adminPassword}`);
    console.log(`==========================================`);
  } catch (error) {
    console.error(`Admin Seed Error: ${error.message}`);
  }
};

export default seedAdmin;
