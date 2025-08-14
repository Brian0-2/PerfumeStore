import { Table, Column, Model, DataType, Unique, HasMany, AllowNull } from 'sequelize-typescript';
import Order from './Order';
import SupplierOrder from './SuplierOrder';

@Table({ tableName: 'order_statuses' })
class OrderStatus extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(80))
  declare name: string;

  @HasMany(() => Order)
  declare orders?: Order[];

  @HasMany(() => SupplierOrder)
  declare supplier_orders?: SupplierOrder[];
}

export default OrderStatus;
