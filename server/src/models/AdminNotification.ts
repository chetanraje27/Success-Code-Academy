import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AdminNotificationAttributes { id: number; eventType: string; title: string; body: string; targetUrl?: string | null; adminId: number; readAt?: Date | null; createdAt?: Date; updatedAt?: Date; }
export interface AdminNotificationCreationAttributes extends Optional<AdminNotificationAttributes, 'id' | 'targetUrl' | 'readAt' | 'createdAt' | 'updatedAt'> {}
export class AdminNotification extends Model<AdminNotificationAttributes, AdminNotificationCreationAttributes> implements AdminNotificationAttributes {
  declare id: number; declare eventType: string; declare title: string; declare body: string; declare targetUrl: string | null; declare adminId: number; declare readAt: Date | null; declare readonly createdAt: Date; declare readonly updatedAt: Date;
}
export function initAdminNotification(sequelize: Sequelize): void {
  AdminNotification.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    eventType: { type: DataTypes.STRING(80), allowNull: false }, title: { type: DataTypes.STRING(160), allowNull: false }, body: { type: DataTypes.STRING(500), allowNull: false },
    targetUrl: { type: DataTypes.STRING(500), allowNull: true }, adminId: { type: DataTypes.INTEGER, allowNull: false }, readAt: { type: DataTypes.DATE, allowNull: true },
  }, { sequelize, tableName: 'admin_notifications', timestamps: true, indexes: [{ fields: ['adminId', 'readAt', 'createdAt'] }] });
}
export default AdminNotification;
