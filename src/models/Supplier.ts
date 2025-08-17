import { Table, Column, Model, DataType, AllowNull, HasMany, Unique } from "sequelize-typescript";
import Perfume from "./Perfume";
import Order from "./Order";

@Table({
  tableName: "suppliers",
  timestamps: false
})

class Supplier extends Model {

  @Unique
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

  // @HasMany(() => Order)
  // declare orders: Order[];
}

export default Supplier;
