import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TopperResultAttributes {
  id: number;
  name: string;
  image: string;
  year: number;
  college?: string | null;
  city?: string | null;
  marks?: number | null;
  isActive: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TopperResultCreationAttributes
  extends Optional<
    TopperResultAttributes,
    'id' | 'college' | 'city' | 'marks' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt'
  > {}

export class TopperResult
  extends Model<TopperResultAttributes, TopperResultCreationAttributes>
  implements TopperResultAttributes
{
  declare public id: number;
  declare public name: string;
  declare public image: string;
  declare public year: number;
  declare public college?: string | null;
  declare public city?: string | null;
  declare public marks?: number | null;
  declare public isActive: boolean;
  declare public orderIndex: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initTopperResult(sequelize: Sequelize): void {
  TopperResult.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      college: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      marks: {
        type: DataTypes.INTEGER,
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
      tableName: 'topper_results',
      timestamps: true,
    }
  );
}

export default TopperResult;
