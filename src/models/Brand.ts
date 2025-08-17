import { Table, Column, Model, DataType, Unique, HasMany, AllowNull } from 'sequelize-typescript';
import Perfume from './Perfume';

@Table({
  tableName: 'brands',
  timestamps: false
})

class Brand extends Model {
  
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @HasMany(() => Perfume)
  declare perfumes?: Perfume[];
}

export default Brand;
