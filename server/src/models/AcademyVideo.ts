import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AcademyVideoAttributes {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  duration: string;
  image: string;
  videoUrl: string;
  isActive: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AcademyVideoCreationAttributes
  extends Optional<AcademyVideoAttributes, 'id' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt'> {}

export class AcademyVideo
  extends Model<AcademyVideoAttributes, AcademyVideoCreationAttributes>
  implements AcademyVideoAttributes
{
  declare public id: number;
  declare public category: string;
  declare public title: string;
  declare public excerpt: string;
  declare public date: string;
  declare public duration: string;
  declare public image: string;
  declare public videoUrl: string;
  declare public isActive: boolean;
  declare public orderIndex: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initAcademyVideo(sequelize: Sequelize): void {
  AcademyVideo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: 'academy_videos',
      timestamps: true,
      indexes: [{ fields: ['isActive', 'orderIndex'] }],
    }
  );
}

export default AcademyVideo;
