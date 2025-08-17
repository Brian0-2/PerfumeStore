import { Table, Column, Model, DataType, AllowNull } from "sequelize-typescript";

@Table({ tableName: "recipient_types", timestamps: false })
class RecipientType extends Model {

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string; // Example: "Customer", "Supplier"
}

export default RecipientType;
