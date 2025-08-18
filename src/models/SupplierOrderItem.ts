import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo } from "sequelize-typescript";
import OrderItem from "./OrderItem";
import SupplierOrder from "./SupplierOrder";

@Table({ 
  tableName: "supplier_order_items", 
  timestamps: false 
})
class SupplierOrderItem extends Model {

  @ForeignKey(() => OrderItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_item_id: number;

  @ForeignKey(() => SupplierOrder)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare supplier_order_id: number;

  @BelongsTo(() => OrderItem)
  declare order_item: OrderItem;

  @BelongsTo(() => SupplierOrder)
  declare supplier_order: SupplierOrder;
}

export default SupplierOrderItem;
