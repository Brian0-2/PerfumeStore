import { Table, Column, Model, DataType, Default, AllowNull, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "./User";
import OrderItem from "./OrderItem";
import OrderStatus from "./OderStatus";
import Payment from "./Payment";

@Table({ tableName: "orders", timestamps: true })
class Order extends Model {
    @Default(false)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_paid: boolean;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare user_id: number;

    @ForeignKey(() => OrderStatus)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare order_status_id: number;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => OrderStatus)
    declare order_status: OrderStatus;

    @HasMany(() => OrderItem)
    declare items?: OrderItem[];

    @HasMany(() => Payment)
    declare payments?: Payment[];
}

export default Order;
