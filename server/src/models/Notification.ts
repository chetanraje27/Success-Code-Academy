import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface NotificationAttributes {
  id: number;
  text: string;
  isActive: boolean;
  orderIndex: number;
  link?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt' | 'icon'> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare public id: number;
  declare public text: string;
  declare public isActive: boolean;
  declare public orderIndex: number;
  declare public link?: string;
  declare public icon?: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initNotification(sequelize: Sequelize): void {
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
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
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: true,
      indexes: [{ fields: ['isActive', 'orderIndex'] }],
    }
  );
}

export default Notification;
