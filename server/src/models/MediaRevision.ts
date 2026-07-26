import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type MediaResourceType = 'banner' | 'star' | 'result' | 'news' | 'video';
export type MediaRevisionAction = 'update' | 'delete' | 'restore';

export interface MediaRevisionAttributes {
  id: number;
  resourceType: MediaResourceType;
  resourceId: number;
  action: MediaRevisionAction;
  snapshot: Record<string, unknown>;
  createdBy: number | null;
  createdAt?: Date;
}

export interface MediaRevisionCreationAttributes
  extends Optional<MediaRevisionAttributes, 'id' | 'createdBy' | 'createdAt'> {}

export class MediaRevision
  extends Model<MediaRevisionAttributes, MediaRevisionCreationAttributes>
  implements MediaRevisionAttributes
{
  declare public id: number;
  declare public resourceType: MediaResourceType;
  declare public resourceId: number;
  declare public action: MediaRevisionAction;
  declare public snapshot: Record<string, unknown>;
  declare public createdBy: number | null;
  declare public readonly createdAt: Date;
}

export function initMediaRevision(sequelize: Sequelize): void {
  MediaRevision.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      resourceType: {
        type: DataTypes.ENUM('banner', 'star', 'result', 'news', 'video'),
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM('update', 'delete', 'restore'),
        allowNull: false,
      },
      snapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'media_revisions',
      timestamps: true,
      updatedAt: false,
      indexes: [{ fields: ['resourceType', 'resourceId', 'createdAt'] }],
    },
  );
}

export default MediaRevision;
