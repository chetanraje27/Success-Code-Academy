import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OtpVerificationAttributes {
  id: number;
  mobileNumber: string;
  otp: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OtpVerificationCreationAttributes
  extends Optional<OtpVerificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class OtpVerification
  extends Model<OtpVerificationAttributes, OtpVerificationCreationAttributes>
  implements OtpVerificationAttributes
{
  declare public id: number;
  declare public mobileNumber: string;
  declare public otp: string;
  declare public expiresAt: Date;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initOtpVerification(sequelize: Sequelize): void {
  OtpVerification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'otp_verifications',
      timestamps: true,
    }
  );
}

export default OtpVerification;
