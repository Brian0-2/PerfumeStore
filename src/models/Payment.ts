import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import PaymentMethod from "./PaymentMethod";
import RecipientType from "./RecipientType";

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

  @ForeignKey(() => RecipientType)
  @Column(DataType.INTEGER)
  declare order_type_id: number; // FK → PayableType

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare recipient_id: number; // ID de la orden (Order o SupplierOrder)

  @Column(DataType.TEXT)
  declare note: string;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;

  @BelongsTo(() => RecipientType)
  declare order_type: RecipientType;
}

export default Payment;
