import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client.js";
import { Check } from "./check.js";

interface TrialAttributes {
  id: number | null;
  purpose_id: string;
  correlation_id: string;
  operation_path: string;
  check_id: number;
  response: boolean | null;
  message: string | null;
}

class Trial extends Model<TrialAttributes> implements TrialAttributes {
  public id!: number | null;
  public purpose_id!: string;
  public correlation_id!: string;
  public operation_path!: string;
  public check_id!: number;
  public response!: boolean | null;
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
    check_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Check,
        key: "id",
      },
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
  },
  {
    sequelize,
    modelName: "Trial",
    tableName: "trial",
    timestamps: false,
  }
);

export { Trial };
