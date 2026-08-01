import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Course extends Model {
  declare public id: number;
  declare public slug: string;
  declare public category: string;
  declare public type: string;
  declare public badge: string;
  declare public title: string;
  declare public description: string;
  declare public highlights: string[];
  declare public isActive: boolean;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initCourse(sequelize: Sequelize): typeof Course {
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.ENUM('freshers', 'repeaters', 'test-series'),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      badge: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      highlights: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'courses',
      timestamps: true,
    }
  );

  return Course;
}
