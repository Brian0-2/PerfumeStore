import { Table, Column, Model, DataType, Unique, HasMany, AllowNull } from 'sequelize-typescript';
import Order from './Order';
import Payment from './Payment';
import SupplierOrder from './SuplierOrder';

@Table({ tableName: 'payment_methods' })
class PaymentMethod extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @HasMany(() => Payment)
  declare payments?: Payment[];

  @HasMany(() => SupplierOrder)
  declare supplier_orders?: SupplierOrder[];
}

export default PaymentMethod;
