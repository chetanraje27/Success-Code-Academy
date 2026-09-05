import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export interface AdminNotificationPreferenceAttributes { id: number; adminId: number; enabled: boolean; createdAt?: Date; updatedAt?: Date; }
export interface AdminNotificationPreferenceCreationAttributes extends Optional<AdminNotificationPreferenceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
export class AdminNotificationPreference extends Model<AdminNotificationPreferenceAttributes, AdminNotificationPreferenceCreationAttributes> implements AdminNotificationPreferenceAttributes { declare id: number; declare adminId: number; declare enabled: boolean; declare readonly createdAt: Date; declare readonly updatedAt: Date; }
export function initAdminNotificationPreference(sequelize: Sequelize): void { AdminNotificationPreference.init({ id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, adminId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true } }, { sequelize, tableName: 'admin_notification_preferences', timestamps: true }); }
export default AdminNotificationPreference;
