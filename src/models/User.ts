import { Table, Column, Model, DataType, Default, Unique, AllowNull, HasMany } from "sequelize-typescript";
import Order from "./Order";

@Table({ 
    tableName: "users", 
    timestamps: true 
})

class User extends Model {
    
    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare name: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare email: string;

    @Unique
    @Column(DataType.STRING(10))
    declare phone: string;

    @Column(DataType.TEXT)
    declare address: string;

    @Column(DataType.STRING(60))
    declare password: string;

    @Column(DataType.DATE)
    declare tokenExpiresAt: Date;

    @Column(DataType.STRING(36))
    declare token: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.BOOLEAN)
    declare confirmed: boolean;

    @Default("client")
    @Column(DataType.ENUM("admin", "client"))
    declare role: string;

    @HasMany(() => Order)
    declare orders : Order
    
}

export default User;
