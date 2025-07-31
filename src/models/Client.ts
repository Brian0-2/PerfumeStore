import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./User";

@Table({ tableName: "clients" })
class Client extends Model {
  @Column(DataType.STRING(20))
  declare phone: string;

  @Column(DataType.TEXT)
  declare address: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default Client;
