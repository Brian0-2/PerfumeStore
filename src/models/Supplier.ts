import { Table, Column, Model, DataType, AllowNull, HasMany } from "sequelize-typescript";
import Perfume from "./Perfume";
import SupplierOrder from "./SuplierOrder";

@Table({ tableName: "suppliers" })
class Supplier extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @Column(DataType.STRING(20))
  declare phone: string;

  @Column(DataType.STRING(100))
  declare email: string;

  @Column(DataType.TEXT)
  declare address: string;

  @HasMany(() => Perfume)
  declare perfumes: Perfume[];

  @HasMany(() => SupplierOrder)
  declare supplier_orders: SupplierOrder[];
}

export default Supplier;
