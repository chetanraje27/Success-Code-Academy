import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ContactMessageAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMessageCreationAttributes
  extends Optional<ContactMessageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ContactMessage
  extends Model<ContactMessageAttributes, ContactMessageCreationAttributes>
  implements ContactMessageAttributes
{
  declare public id: number;
  declare public name: string;
  declare public email: string;
  declare public phone: string;
  declare public message: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initContactMessage(sequelize: Sequelize): void {
  ContactMessage.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'contact_messages',
      timestamps: true,
    }
  );
}

export default ContactMessage;
