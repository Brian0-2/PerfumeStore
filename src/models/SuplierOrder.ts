import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Supplier from "./Supplier";
import PaymentMethod from "./PaymentMethod";
import SupplierOrderDetail from "./SupplierOrderDetail";
import OrderStatus from "./OderStatus";

@Table({ tableName: "supplier_orders" })
class SupplierOrder extends Model {
  @ForeignKey(() => Supplier)
  @Column(DataType.INTEGER)
  declare supplier_id: number;

  @ForeignKey(() => OrderStatus)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @ForeignKey(() => PaymentMethod)
  @Column(DataType.INTEGER)
  declare payment_method_id: number;

  @Column(DataType.DECIMAL(10, 2))
  declare total_amount: number;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @BelongsTo(() => PaymentMethod)
  declare payment_method: PaymentMethod;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @HasMany(() => SupplierOrderDetail)
  declare details: SupplierOrderDetail[];
}

export default SupplierOrder;
