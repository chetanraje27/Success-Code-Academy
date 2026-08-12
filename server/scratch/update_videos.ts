import { sequelize } from '../src/models';
import { seedDatabase } from '../src/seedDatabase';

async function main() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await seedDatabase();
    console.log('Seed and update complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error running update_videos script:', error);
    process.exit(1);
  }
}

main();
