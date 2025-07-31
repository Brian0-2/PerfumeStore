import {Table, Column, Model, DataType, Unique, HasMany } from 'sequelize-typescript';
import Perfume from './Perfume';

@Table({ 
  tableName: 'brands' 
})

class Brand extends Model {

  @Unique
  @Column({ type: DataType.STRING(80), allowNull: false })
  declare name: string;

  @HasMany(() => Perfume)
  declare perfumes?: Perfume[];
}
export default Brand;
