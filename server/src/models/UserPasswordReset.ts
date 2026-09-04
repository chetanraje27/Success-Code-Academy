import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserPasswordResetAttributes {
  id: number;
  userId: number;
  /**
   * SHA-256 of the token that was put in the reset link. The raw token is
   * shown once, at issue time, and is never recoverable from the database, so
   * a leaked table dump cannot be replayed as a reset.
   */
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPasswordResetCreationAttributes
  extends Optional<
    UserPasswordResetAttributes,
    'id' | 'usedAt' | 'createdAt' | 'updatedAt'
  > {}

export class UserPasswordReset
  extends Model<
    UserPasswordResetAttributes,
    UserPasswordResetCreationAttributes
  >
  implements UserPasswordResetAttributes
{
  declare public id: number;
  declare public userId: number;
  declare public tokenHash: string;
  declare public expiresAt: Date;
  declare public usedAt?: Date | null;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initUserPasswordReset(sequelize: Sequelize): void {
  UserPasswordReset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user_password_resets',
      timestamps: true,
      indexes: [{ fields: ['userId'] }, { fields: ['expiresAt'] }],
    }
  );
}

export default UserPasswordReset;
