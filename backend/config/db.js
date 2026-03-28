const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'petpal',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234567',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const addUsernameColumn = async () => {
  try {
    // Check if username column exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='username'
    `);
    
    if (results.length === 0) {
      console.log('📝 Adding username column...');
      
      // Step 1: Add column allowing NULL
      await sequelize.query(`
        ALTER TABLE "users" ADD COLUMN "username" VARCHAR(30)
      `);
      console.log('  ✅ Added username column (nullable)');
      
      // Step 2: Set default usernames for existing users
      await sequelize.query(`
        UPDATE "users" 
        SET "username" = SPLIT_PART(email, '@', 1)
        WHERE "username" IS NULL
      `);
      console.log('  ✅ Set default usernames for existing users');
      
      // Step 3: Handle any duplicate usernames
      await sequelize.query(`
        WITH duplicates AS (
          SELECT id, username, 
                 ROW_NUMBER() OVER (PARTITION BY username ORDER BY id) as rn
          FROM "users"
          WHERE username IN (
            SELECT username FROM "users" GROUP BY username HAVING COUNT(*) > 1
          )
        )
        UPDATE "users" 
        SET "username" = CONCAT(username, '_', (SELECT rn FROM duplicates WHERE duplicates.id = users.id))
        WHERE id IN (SELECT id FROM duplicates WHERE rn > 1)
      `);
      console.log('  ✅ Handled duplicate usernames');
      
      // Step 4: Make column NOT NULL and add UNIQUE constraint
      await sequelize.query(`
        ALTER TABLE "users" 
        ALTER COLUMN "username" SET NOT NULL,
        ADD CONSTRAINT "users_username_unique" UNIQUE ("username")
      `);
      console.log('  ✅ Made username required and unique');
      
      console.log('✅ Username column added successfully!');
    } else {
      console.log('✅ Username column already exists');
    }
  } catch (error) {
    console.error('❌ Error adding username column:', error.message);
    throw error;
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    
    // Manually add username column first
    await addUsernameColumn();
    
    // Now sync models (alter will add any other missing columns)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('📊 Database models synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };