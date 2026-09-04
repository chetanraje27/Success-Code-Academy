import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ScholarshipRegistrationAttributes {
  id: number;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  studentClass: string;
  schoolName: string;
  city: string;
  preferredCourse: string;
  userId?: number;
  studentEmail?: string;
  scholarshipProgram?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScholarshipRegistrationCreationAttributes
  extends Optional<ScholarshipRegistrationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ScholarshipRegistration
  extends Model<ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes>
  implements ScholarshipRegistrationAttributes
{
  declare public id: number;
  declare public studentName: string;
  declare public studentPhone: string;
  declare public parentPhone: string;
  declare public studentClass: string;
  declare public schoolName: string;
  declare public city: string;
  declare public preferredCourse: string;
  declare public userId?: number;
  declare public studentEmail?: string;
  declare public scholarshipProgram?: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initScholarshipRegistration(sequelize: Sequelize): void {
  ScholarshipRegistration.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentClass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      schoolName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferredCourse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      studentEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      scholarshipProgram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'scholarship_registrations',
      timestamps: true,
    }
  );
}

export default ScholarshipRegistration;
