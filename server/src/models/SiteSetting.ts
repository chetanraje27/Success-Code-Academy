import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface SiteSettingAttributes {
  id: number;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SiteSettingCreationAttributes
  extends Optional<SiteSettingAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class SiteSetting
  extends Model<SiteSettingAttributes, SiteSettingCreationAttributes>
  implements SiteSettingAttributes
{
  declare public id: number;
  declare public key: string;
  declare public value: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initSiteSetting(sequelize: Sequelize): void {
  SiteSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'site_settings',
      timestamps: true,
    }
  );
}

export default SiteSetting;
