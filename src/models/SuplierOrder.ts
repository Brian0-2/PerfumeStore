import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, AllowNull } from "sequelize-typescript";
import Supplier from "./Supplier";
import PaymentMethod from "./PaymentMethod";
import OrderStatus from "./OrderStatus";
import SupplierOrderItem from "./SupplierOrderItem";

@Table({ tableName: "supplier_orders", timestamps: true })
class SupplierOrder extends Model {
  @ForeignKey(() => Supplier)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare supplier_id: number;

  @ForeignKey(() => OrderStatus)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @ForeignKey(() => PaymentMethod)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare payment_method_id: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare total_amount: number;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @HasMany(() => SupplierOrderItem)
  declare details: SupplierOrderItem[];
}

export default SupplierOrder;
