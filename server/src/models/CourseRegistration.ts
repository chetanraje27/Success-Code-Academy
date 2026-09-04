import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CourseRegistrationAttributes {
  id: number;
  userId?: number;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  visitingDate: string;
  visitingTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseRegistrationCreationAttributes
  extends Optional<CourseRegistrationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class CourseRegistration
  extends Model<CourseRegistrationAttributes, CourseRegistrationCreationAttributes>
  implements CourseRegistrationAttributes
{
  declare public id: number;
  declare public userId?: number;
  declare public courseTitle: string;
  declare public studentName: string;
  declare public studentEmail: string;
  declare public studentPhone: string;
  declare public visitingDate: string;
  declare public visitingTime: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initCourseRegistration(sequelize: Sequelize): void {
  CourseRegistration.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      courseTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visitingDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visitingTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'course_registrations',
      timestamps: true,
    }
  );
}

export default CourseRegistration;
