import { Table, Column, Model, DataType, Default, Unique, AllowNull } from "sequelize-typescript";

@Table({
    tableName: "users"
})

class User extends Model {
    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare name: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare email: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    declare password: string;

    @Column(DataType.STRING(6))
    declare token: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.BOOLEAN)
    declare confirmed: boolean;

    @Default("client")
    @Column(DataType.ENUM("admin", "client"))
    declare role: string;
}

export default User;