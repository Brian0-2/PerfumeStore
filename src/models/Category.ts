import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Perfume from "./Perfume";

@Table({ 
    tableName: "categories" 
})

class Category extends Model {

    @Column(DataType.STRING(20))
    declare name: string;

    @HasMany(() => Perfume)
    declare perfumes: Perfume[];

}
export default Category