import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface NewsArticleAttributes {
  id: number;
  category: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  slug: string;
  externalUrl?: string;
  isActive: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsArticleCreationAttributes
  extends Optional<NewsArticleAttributes, 'id' | 'shortTitle' | 'externalUrl' | 'isActive' | 'orderIndex' | 'createdAt' | 'updatedAt'> {}

export class NewsArticle
  extends Model<NewsArticleAttributes, NewsArticleCreationAttributes>
  implements NewsArticleAttributes
{
  declare public id: number;
  declare public category: string;
  declare public title: string;
  declare public shortTitle?: string;
  declare public excerpt: string;
  declare public date: string;
  declare public author: string;
  declare public readTime: string;
  declare public image: string;
  declare public slug: string;
  declare public externalUrl?: string;
  declare public isActive: boolean;
  declare public orderIndex: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initNewsArticle(sequelize: Sequelize): void {
  NewsArticle.init(
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
      shortTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      readTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      externalUrl: {
        type: DataTypes.STRING,
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
      tableName: 'news_articles',
      timestamps: true,
      indexes: [{ fields: ['isActive', 'orderIndex'] }],
    }
  );
}

export default NewsArticle;
