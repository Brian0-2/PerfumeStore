import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo } from "sequelize-typescript";
import Perfume from "./Perfume";
import OrderItem from "./OrderItem";
import SupplierOrder from "./SuplierOrder";

@Table({ tableName: "supplier_order_items", timestamps: true })
class SupplierOrderItem extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare price_buy: number;

  @ForeignKey(() => OrderItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order_item_id: number;

  @ForeignKey(() => SupplierOrder)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare supplier_order_id: number;

  @ForeignKey(() => Perfume)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare perfume_id: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare subtotal: number;

  @BelongsTo(() => OrderItem)
  declare order_item: OrderItem;

  @BelongsTo(() => SupplierOrder)
  declare supplier_order: SupplierOrder;

  @BelongsTo(() => Perfume)
  declare perfume: Perfume;
}

export default SupplierOrderItem;
