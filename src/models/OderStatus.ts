import {Table, Column, Model, DataType, Unique, HasMany } from 'sequelize-typescript';
import CustomerOrder from './CustomerOrder';
import SupplierOrder from './SuplierOrder';

@Table({ 
    tableName: 'order_statuses' 
})

class OrderStatus extends Model {

  @Unique
  @Column({ type: DataType.STRING(80), allowNull: false })
  declare name: string;

  @HasMany(() => CustomerOrder)
  declare customer_order?: CustomerOrder[];

  @HasMany(() => SupplierOrder)
  declare supplier_order?: SupplierOrder[];
}

export default OrderStatus;
