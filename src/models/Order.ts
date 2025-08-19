import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, AllowNull, Default } from "sequelize-typescript";
import OrderItem from "./OrderItem";
import OrderStatus from "./OrderStatus";
import User from "./User";
import Payment from "./Payment";

@Table({ tableName: "orders", timestamps: true })
class Order extends Model {

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare is_paid: boolean;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare total: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare amount_paid: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @ForeignKey(() => OrderStatus)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => OrderItem)
  declare order_items?: OrderItem[];

  @HasMany(() => Payment)
  declare payments?: Payment[];
}

export default Order;
