import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface BannerAttributes {
  id: number;
  type: string; // 'HOME' or 'RESULTS'
  image: string;
  altText: string;
  targetUrl?: string;
  isActive: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BannerCreationAttributes
  extends Optional<BannerAttributes, 'id' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt'> {}

export class Banner
  extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  declare public id: number;
  declare public type: string;
  declare public image: string;
  declare public altText: string;
  declare public targetUrl?: string;
  declare public isActive: boolean;
  declare public orderIndex: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initBanner(sequelize: Sequelize): void {
  Banner.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('HOME', 'RESULTS'),
        allowNull: false,
        defaultValue: 'HOME',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      altText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      targetUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'banners',
      timestamps: true,
      indexes: [{ fields: ['isActive', 'type', 'orderIndex'] }],
    }
  );
}

export default Banner;
