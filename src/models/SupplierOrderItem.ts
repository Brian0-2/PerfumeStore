import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo } from "sequelize-typescript";
import OrderItem from "./OrderItem";

@Table({ 
  tableName: "supplier_order_items", 
  timestamps: false 
})
class SupplierOrderItem extends Model {

  @ForeignKey(() => OrderItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_item_id: number;

  @BelongsTo(() => OrderItem)
  declare order_item: OrderItem;
}

export default SupplierOrderItem;
