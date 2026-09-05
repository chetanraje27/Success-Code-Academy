import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export interface AdminPushSubscriptionAttributes { id: number; adminId: number; endpoint: string; p256dh: string; auth: string; userAgent?: string | null; deviceName?: string | null; createdAt?: Date; updatedAt?: Date; }
export interface AdminPushSubscriptionCreationAttributes extends Optional<AdminPushSubscriptionAttributes, 'id' | 'userAgent' | 'deviceName' | 'createdAt' | 'updatedAt'> {}
export class AdminPushSubscription extends Model<AdminPushSubscriptionAttributes, AdminPushSubscriptionCreationAttributes> implements AdminPushSubscriptionAttributes {
  declare id: number; declare adminId: number; declare endpoint: string; declare p256dh: string; declare auth: string; declare userAgent: string | null; declare deviceName: string | null; declare readonly createdAt: Date; declare readonly updatedAt: Date;
}
export function initAdminPushSubscription(sequelize: Sequelize): void { AdminPushSubscription.init({ id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, adminId: { type: DataTypes.INTEGER, allowNull: false }, endpoint: { type: DataTypes.TEXT, allowNull: false, unique: true }, p256dh: { type: DataTypes.STRING, allowNull: false }, auth: { type: DataTypes.STRING, allowNull: false }, userAgent: { type: DataTypes.STRING, allowNull: true }, deviceName: { type: DataTypes.STRING, allowNull: true } }, { sequelize, tableName: 'admin_push_subscriptions', timestamps: true, indexes: [{ fields: ['adminId'] }] }); }
export default AdminPushSubscription;
