import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, AllowNull } from "sequelize-typescript";
import OrderStatus from "./OrderStatus";
import SupplierOrderItem from "./SupplierOrderItem";
import Supplier from "./Supplier";

@Table({ tableName: "supplier_orders", timestamps: true })
class SupplierOrder extends Model {

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare total: number;

  @ForeignKey(() => Supplier)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare supplier_id: number;

  @ForeignKey(() => OrderStatus)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_status_id: number;

  @BelongsTo(() => OrderStatus)
  declare order_status: OrderStatus;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @HasMany(() => SupplierOrderItem)
  declare supplier_order_items?: SupplierOrderItem[];

}

export default SupplierOrder;
