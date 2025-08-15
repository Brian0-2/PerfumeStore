import { Table, Column, Model, DataType, ForeignKey, AllowNull, BelongsTo } from "sequelize-typescript";
import Order from "./Order";
import Perfume from "./Perfume";

@Table({ tableName: "order_items", timestamps: true })
class OrderItem extends Model {
    @ForeignKey(() => Order)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare order_id: number;

    @ForeignKey(() => Perfume)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare perfume_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare quantity: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare price_buy: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare price_sell: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare to_earn: number;

    @BelongsTo(() => Order)
    declare order: Order;

    @BelongsTo(() => Perfume)
    declare perfume: Perfume;
}

export default OrderItem;
