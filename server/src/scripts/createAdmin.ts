import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { sequelize, Admin } from '../models';
import { ADMIN, isAdminRole, type AdminRole } from '../config/roles';

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

/** Reads ADMIN_ROLE, defaulting to the restricted level when it is unset. */
function resolveRole(): AdminRole {
  const value = process.env.ADMIN_ROLE?.trim();
  if (!value) return ADMIN;
  if (!isAdminRole(value)) {
    throw new Error("ADMIN_ROLE must be either 'super-admin' or 'admin'.");
  }
  return value;
}

async function createOrUpdateAdmin(): Promise<void> {
  const email = required('ADMIN_EMAIL').toLowerCase();
  const mobileNumber = required('ADMIN_MOBILE_NUMBER');
  const password = required('ADMIN_PASSWORD');
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Site';
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'Administrator';
  const role = resolveRole();

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
      role,
    });
    console.log(`Admin credentials updated for ${email} (role: ${role}).`);
    return;
  }

  await Admin.create({
    email,
    mobileNumber,
    name,
    passwordHash,
    role,
  });
  console.log(`Admin account created for ${email} (role: ${role}).`);
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
