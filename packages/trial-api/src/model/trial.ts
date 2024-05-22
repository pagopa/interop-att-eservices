import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client.js";
import { Check } from "./check.js";

interface TrialAttributes {
  id: number | null;
  purpose_id: string;
  correlation_id: string;
  operation_path: string;
  operation_method: string | null;
  check_id: number;
  response: string | null;
  created_date: Date | null;
  message: string | null;
}

class Trial extends Model<TrialAttributes> implements TrialAttributes {
  public id!: number | null;
  public purpose_id!: string;
  public correlation_id!: string;
  public operation_path!: string;
  public operation_method!: string | null;
  public check_id!: number;
  public response!: string | null;
  public created_date!: Date | null;
  public message!: string | null;
}

Trial.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    purpose_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correlation_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operation_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operation_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    check_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Check,
        key: "id",
      },
    },
    response: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
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
