import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface NewsletterSubscriberAttributes {
  id: number;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsletterSubscriberCreationAttributes
  extends Optional<NewsletterSubscriberAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class NewsletterSubscriber
  extends Model<NewsletterSubscriberAttributes, NewsletterSubscriberCreationAttributes>
  implements NewsletterSubscriberAttributes
{
  declare public id: number;
  declare public email: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initNewsletterSubscriber(sequelize: Sequelize): void {
  NewsletterSubscriber.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'newsletter_subscribers',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
}
