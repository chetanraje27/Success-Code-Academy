import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ScholarshipProgramAttributes {
  id?: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class ScholarshipProgram extends Model {
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public isActive: boolean;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initScholarshipProgram(sequelize: Sequelize): typeof ScholarshipProgram {
  ScholarshipProgram.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'scholarship_programs',
      underscored: false,
    },
  );
  return ScholarshipProgram;
}
