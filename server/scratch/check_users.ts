import { sequelize, User } from '../src/models';

async function main() {
  await sequelize.authenticate();
  console.log("DB Connection authenticated.");
  const users = await User.findAll();
  console.log("Current Registered Users:");
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
