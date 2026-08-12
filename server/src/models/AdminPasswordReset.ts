import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AdminPasswordResetAttributes {
  id: number;
  adminId: number;
  /**
   * SHA-256 of the token that was put in the reset link. The raw token is
   * shown once, at issue time, and is never recoverable from the database, so
   * a leaked table dump cannot be replayed as a reset.
   */
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  /** Which administrator issued the link, for the audit trail. */
  requestedByAdminId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminPasswordResetCreationAttributes
  extends Optional<
    AdminPasswordResetAttributes,
    'id' | 'usedAt' | 'requestedByAdminId' | 'createdAt' | 'updatedAt'
  > {}

export class AdminPasswordReset
  extends Model<
    AdminPasswordResetAttributes,
    AdminPasswordResetCreationAttributes
  >
  implements AdminPasswordResetAttributes
{
  declare public id: number;
  declare public adminId: number;
  declare public tokenHash: string;
  declare public expiresAt: Date;
  declare public usedAt?: Date | null;
  declare public requestedByAdminId?: number | null;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initAdminPasswordReset(sequelize: Sequelize): void {
  AdminPasswordReset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      adminId: {
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
      requestedByAdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'admin_password_resets',
      timestamps: true,
      indexes: [{ fields: ['adminId'] }, { fields: ['expiresAt'] }],
    }
  );
}

export default AdminPasswordReset;
