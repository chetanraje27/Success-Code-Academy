import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AdminAttributes {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminCreationAttributes
  extends Optional<AdminAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  declare public id: number;
  declare public name: string;
  declare public email: string;
  declare public mobileNumber: string;
  declare public passwordHash: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
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
    },
    {
      sequelize,
      tableName: 'admins',
      timestamps: true,
    }
  );
}

export default Admin;
