import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import CustomerOrder from "./CustomerOrder";
import Perfume from "./Perfume";

@Table({ tableName: "customer_order_details" })
class CustomerOrderDetail extends Model {
  @ForeignKey(() => CustomerOrder)
  @Column(DataType.INTEGER)
  declare customer_order_id: number;

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

  @BelongsTo(() => CustomerOrder)
  declare customer_order: CustomerOrder;

  @BelongsTo(() => Perfume)
  declare perfume: Perfume;
}

export default CustomerOrderDetail;
