import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client.js";

interface TrialAttributes {
  id: number;
  execution_date: Date | null;
  check_id: number;
  purpose_id: string;
  response: boolean | null;
  message: string | null;
  order: number;
}

class Trial extends Model<TrialAttributes> implements TrialAttributes {
  public id!: number;
  public execution_date!: Date | null;
  public check_id!: number;
  public purpose_id!: string;
  public response!: boolean | null;
  public message!: string | null;
  public order!: number;
}

Trial.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    execution_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    purpose_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    response: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Trial",
    tableName: "trial",
    timestamps: false,
  }
);

export { Trial };
