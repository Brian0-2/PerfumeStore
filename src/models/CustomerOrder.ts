import { Table, Column, Model, DataType, Default, AllowNull, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Client from "./Client";
import CustomerOrderDetail from "./CustomerOrderDetail";
import PaymentMethod from "./PaymentMethod";
import OrderStatus from "./OderStatus";
import Payment from "./Payments";

@Table({ tableName: "customer_orders" })
class CustomerOrder extends Model {
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare total_amount: number;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare is_paid: boolean;

  @ForeignKey(() => Client)
  @Column(DataType.INTEGER)
  declare client_id: number;

  @ForeignKey(() => OrderStatus)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @ForeignKey(() => PaymentMethod)
  @Column(DataType.INTEGER)
  declare payment_method_id: number;

  @BelongsTo(() => Client)
  declare client: Client;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;

  @HasMany(() => CustomerOrderDetail)
  declare details: CustomerOrderDetail[];

  @HasMany(() => Payment)
  declare payments: Payment[];
}

export default CustomerOrder;
