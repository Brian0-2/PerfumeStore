import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import Perfume from "./Perfume";
import SupplierOrder from "./SuplierOrder";

@Table({ tableName: "supplier_order_details" })
class SupplierOrderDetail extends Model {
  @ForeignKey(() => SupplierOrder)
  @Column(DataType.INTEGER)
  declare supplier_order_id: number;

  @ForeignKey(() => Perfume)
  @Column(DataType.INTEGER)
  declare perfume_id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare unit_price: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare subtotal: number;

  @BelongsTo(() => SupplierOrder)
  declare supplier_order: SupplierOrder;

  @BelongsTo(() => Perfume)
  declare perfume: Perfume;
}

export default SupplierOrderDetail;
