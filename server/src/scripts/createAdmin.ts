import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { sequelize, User } from '../models';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function validatePassword(password: string): void {
  const strongEnough =
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!strongEnough) {
    throw new Error(
      'ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, number, and symbol.',
    );
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

  const existing = await User.findOne({
    where: {
      [Op.or]: [{ email }, { mobileNumber }],
    },
  });

  if (existing && existing.role !== 'admin') {
    throw new Error(
      'That email or mobile number belongs to a student account. Use different admin details.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await existing.update({
      email,
      mobileNumber,
      firstName,
      lastName,
      role: 'admin',
      passwordHash,
    });
    console.log(`Admin credentials updated for ${email}.`);
    return;
  }

  await User.create({
    email,
    mobileNumber,
    firstName,
    lastName,
    role: 'admin',
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
