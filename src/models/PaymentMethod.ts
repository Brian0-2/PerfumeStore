import { Table, Column, Model, DataType, Unique, HasMany } from 'sequelize-typescript';
import Payment from './Payments';
import CustomerOrder from './CustomerOrder';
import SupplierOrder from './SuplierOrder';

@Table({ 
  tableName: 'payment_methods' 
})
class PaymentMethod extends Model {

  @Unique
  @Column({ type: DataType.STRING(80), allowNull: false })
  declare name: string;

  @HasMany(() => Payment)
  declare payments?: Payment[];

  @HasMany(() => CustomerOrder)
  declare customer_orders?: CustomerOrder[];

  @HasMany(() => SupplierOrder)
  declare supplier_orders?: SupplierOrder[];
}

export default PaymentMethod;
