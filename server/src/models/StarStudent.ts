import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface StarStudentAttributes {
  id: number;
  name: string;
  score: string;
  rank: string;
  course: string;
  year: string;
  image: string;
  colorHex: string;
  isActive: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StarStudentCreationAttributes
  extends Optional<StarStudentAttributes, 'id' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt'> {}

export class StarStudent
  extends Model<StarStudentAttributes, StarStudentCreationAttributes>
  implements StarStudentAttributes
{
  declare public id: number;
  declare public name: string;
  declare public score: string;
  declare public rank: string;
  declare public course: string;
  declare public year: string;
  declare public image: string;
  declare public colorHex: string;
  declare public isActive: boolean;
  declare public orderIndex: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initStarStudent(sequelize: Sequelize): void {
  StarStudent.init(
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
      score: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      colorHex: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#0257d0',
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
      tableName: 'star_students',
      timestamps: true,
      indexes: [{ fields: ['isActive', 'orderIndex'] }],
    }
  );
}

export default StarStudent;
