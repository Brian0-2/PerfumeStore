import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Supplier from "./Supplier";
import Category from "./Category";
import Brand from "./Brand";
import FraganceType from "./FraganceType";
import CustomerOrderDetail from "./CustomerOrderDetail";

@Table({ tableName: "perfumes" })
class Perfume extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.STRING(10))
  declare size: string;

  @Column(DataType.STRING(100))
  declare image: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare supplier_price: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare to_earn: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  declare price : number;

  @ForeignKey(() => Brand)
  @Column(DataType.INTEGER)
  declare brand_id: number;

  @ForeignKey(() => FraganceType)
  @Column(DataType.INTEGER)
  declare fragance_type_id: number;

  @ForeignKey(() => Supplier)
  @Column(DataType.INTEGER)
  declare supplier_id: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  declare category_id: number;

  @BelongsTo(() => Brand)
  declare brand: Brand;

  @BelongsTo(() => FraganceType)
  declare fraganceType: FraganceType;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @BelongsTo(() => Category)
  declare category: Category;

  @HasMany(() => CustomerOrderDetail)
  declare order_details: CustomerOrderDetail[];
}

export default Perfume;
