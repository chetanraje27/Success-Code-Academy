import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type ContentBlockKind = 'text' | 'multiline';

export interface ContentBlockAttributes {
  id: number;
  pageKey: string;
  contentKey: string;
  kind: ContentBlockKind;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContentBlockCreationAttributes
  extends Optional<
    ContentBlockAttributes,
    'id' | 'kind' | 'createdAt' | 'updatedAt'
  > {}

export class ContentBlock
  extends Model<ContentBlockAttributes, ContentBlockCreationAttributes>
  implements ContentBlockAttributes
{
  declare public id: number;
  declare public pageKey: string;
  declare public contentKey: string;
  declare public kind: ContentBlockKind;
  declare public value: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initContentBlock(sequelize: Sequelize): void {
  ContentBlock.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pageKey: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      contentKey: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      kind: {
        type: DataTypes.ENUM('text', 'multiline'),
        allowNull: false,
        defaultValue: 'text',
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'content_blocks',
      timestamps: true,
      indexes: [
        {
          name: 'content_blocks_page_content_unique',
          unique: true,
          fields: ['pageKey', 'contentKey'],
        },
        {
          name: 'content_blocks_page_updated_idx',
          fields: ['pageKey', 'updatedAt'],
        },
      ],
    },
  );
}

export default ContentBlock;
