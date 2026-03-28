const { Sequelize } = require('sequelize');

const DB_PASSWORD = '1234567';

const createDatabase = async () => {
  const sequelize = new Sequelize('postgres', 'postgres', DB_PASSWORD, {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    await sequelize.query('CREATE DATABASE petpal;');
    console.log('✅ Database "petpal" created!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Database "petpal" already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createDatabase();