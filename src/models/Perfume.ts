import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Supplier from "./Supplier";
import Category from "./Category";
import Brand from "./Brand";
import FraganceType from "./FraganceType";
import OrderItem from "./OrderItem";
import SupplierOrderItem from "./SupplierOrderItem";

@Table({ tableName: "perfumes", timestamps: true })
class Perfume extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.STRING(10))
  declare size: string;

  @AllowNull(true)
  @Column(DataType.STRING(175))
  declare image_url: string;

  @AllowNull(true)
  @Column(DataType.STRING(200))
  declare image_id: string;

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

  @HasMany(() => OrderItem)
  declare order_items?: OrderItem[];

  @HasMany(() => SupplierOrderItem)
  declare supplier_order_items?: SupplierOrderItem[];
}

export default Perfume;
