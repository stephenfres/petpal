const { Sequelize } = require('sequelize');

// Connect to default postgres database first
const createDatabase = async () => {
  const sequelize = new Sequelize('postgres', 'postgres', '1234567', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Create petpal database if it doesn't exist
    await sequelize.query('CREATE DATABASE petpal;');
    console.log('✅ Database "petpal" created successfully!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Database "petpal" already exists');
    } else {
      console.error('❌ Error creating database:', error.message);
    }
  } finally {
    await sequelize.close();
  }
};

// Now connect to petpal database
const setupTables = async () => {
  const { sequelize: petpalSequelize, connectDB } = require('./config/db');
  
  try {
    await connectDB();
    console.log('✅ Tables synchronized!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to setup tables:', error.message);
    process.exit(1);
  }
};

// Run both
const runSetup = async () => {
  await createDatabase();
  await setupTables();
};

runSetup();