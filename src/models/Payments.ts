import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import CustomerOrder from "./CustomerOrder";
import PaymentMethod from "./PaymentMethod";

@Table({ tableName: "payments" })
class Payment extends Model {
  @ForeignKey(() => CustomerOrder)
  @Column(DataType.INTEGER)
  declare customer_order_id: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare amount: number;

  @ForeignKey(() => PaymentMethod)
  @Column(DataType.INTEGER)
  declare payment_method_id: number;

  @Column(DataType.TEXT)
  declare note: string;

  @BelongsTo(() => CustomerOrder)
  declare customer_order: CustomerOrder;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;
}

export default Payment;
