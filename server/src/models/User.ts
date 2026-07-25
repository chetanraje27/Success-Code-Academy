import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: number;
  firstName?: string;
  lastName?: string;
  mobileNumber: string;
  email?: string;
  age?: number;
  role: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare public id: number;
  declare public firstName?: string;
  declare public lastName?: string;
  declare public mobileNumber: string;
  declare public email?: string;
  declare public age?: number;
  declare public role: string;
  declare public passwordHash?: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'student',
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      indexes: [
        { fields: ['role'] },
        { fields: ['createdAt'] },
      ],
    }
  );
}

export default User;
