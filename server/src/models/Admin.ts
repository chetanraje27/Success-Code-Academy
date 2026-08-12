import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { ADMIN, ADMIN_ROLES, type AdminRole } from '../config/roles';

export interface AdminAttributes {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  /**
   * Privilege level for this account. `super-admin` has full CRUD access;
   * `admin` is restricted to reading and updating existing records.
   */
  role: AdminRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminCreationAttributes
  extends Optional<AdminAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {}

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  declare public id: number;
  declare public name: string;
  declare public email: string;
  declare public mobileNumber: string;
  declare public passwordHash: string;
  declare public role: AdminRole;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;

  /** True when this account may create and delete records. */
  isSuperAdmin(): boolean {
    return this.role === 'super-admin';
  }
}

export function initAdmin(sequelize: Sequelize): void {
  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // New accounts are restricted by default. Elevating one is always an
      // explicit action taken by an existing super administrator.
      role: {
        type: DataTypes.ENUM(...ADMIN_ROLES),
        allowNull: false,
        defaultValue: ADMIN,
      },
    },
    {
      sequelize,
      tableName: 'admins',
      timestamps: true,
    }
  );
}

export default Admin;
