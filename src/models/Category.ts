import { Table, Column, Model, DataType, HasMany, AllowNull, Unique } from "sequelize-typescript";
import Perfume from "./Perfume";

@Table({ tableName: "categories" })
class Category extends Model {
    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(50))
    declare name: string;

    @HasMany(() => Perfume)
    declare perfumes: Perfume[];
}

export default Category;
