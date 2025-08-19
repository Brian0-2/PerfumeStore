import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import PaymentMethod from "./PaymentMethod";
import Order from "./Order";

@Table({
  tableName: "payments",
  timestamps: true
})
class Payment extends Model {
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare amount: number;

  @ForeignKey(() => PaymentMethod)
  @Column(DataType.INTEGER)
  declare payment_method_id: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  declare order_id: number;

  @Column(DataType.TEXT)
  declare note: string;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;

  @BelongsTo(() => Order)
  declare order : Order

}

export default Payment;
