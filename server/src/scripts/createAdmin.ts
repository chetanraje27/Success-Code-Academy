import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { sequelize, Admin } from '../models';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function validatePassword(password: string): void {
  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters.');
  }
}

async function createOrUpdateAdmin(): Promise<void> {
  const email = required('ADMIN_EMAIL').toLowerCase();
  const mobileNumber = required('ADMIN_MOBILE_NUMBER');
  const password = required('ADMIN_PASSWORD');
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Site';
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'Administrator';

  if (!/^[0-9]{10}$/.test(mobileNumber)) {
    throw new Error('ADMIN_MOBILE_NUMBER must contain exactly 10 digits.');
  }
  validatePassword(password);

  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // Ensure the admins table is created before inserting

  const name = `${firstName} ${lastName}`.trim();

  const existing = await Admin.findOne({
    where: {
      [Op.or]: [{ email }, { mobileNumber }],
    },
  });

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await existing.update({
      email,
      mobileNumber,
      name,
      passwordHash,
    });
    console.log(`Admin credentials updated for ${email}.`);
    return;
  }

  await Admin.create({
    email,
    mobileNumber,
    name,
    passwordHash,
  });
  console.log(`Admin account created for ${email}.`);
}

createOrUpdateAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Unable to create admin: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
