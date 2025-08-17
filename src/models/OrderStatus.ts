import { Table, Column, Model, DataType, Unique, HasMany, AllowNull } from 'sequelize-typescript';
import Order from './Order';

@Table({
  tableName: 'order_statuses',
  timestamps: false
})
class OrderStatus extends Model {
  
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @HasMany(() => Order)
  declare orders?: Order[];
}

export default OrderStatus;
