import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, AllowNull, Default } from "sequelize-typescript";
import RecipientType from "./RecipientType";
import OrderItem from "./OrderItem";
import Payment from "./Payment";
import OrderStatus from "./OrderStatus";

@Table({ tableName: "orders", timestamps: true })
class Order extends Model {

  @ForeignKey(() => RecipientType)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare recipient_type_id: number;

  @Column(DataType.INTEGER)
  declare recipient_id: number;

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

  @ForeignKey(() => OrderStatus)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @BelongsTo(() => RecipientType)
  declare recipient_type: RecipientType;

  @HasMany(() => OrderItem)
  declare order_items?: OrderItem[];

  @HasMany(() => Payment, {
    foreignKey: "payable_id",
    constraints: false,
    scope: { payable_type_id: 1 }
  })
  declare payments?: Payment[];
}

export default Order;
