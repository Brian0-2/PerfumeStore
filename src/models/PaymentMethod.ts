import { Table, Column, Model, DataType, Unique, HasMany, AllowNull } from 'sequelize-typescript';
import Order from './Order';
import Payment from './Payment';

@Table({
  tableName: 'payment_methods',
  timestamps: false
})

class PaymentMethod extends Model {
  
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @HasMany(() => Payment)
  declare payments?: Payment[];

  // @HasMany(() => Order)
  // declare orders?: Order[];
}

export default PaymentMethod;
