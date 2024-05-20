import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client.js";

interface CategoryAttributes {
  id: number;
  code: string;
  eservice: string;
  description: string | null;
  order: number;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public code!: string;
  public eservice!: string;
  public description!: string | null;
  public order!: number;
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eservice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
    modelName: "Category",
    tableName: "category",
    timestamps: false,
  }
);

export { Category, CategoryAttributes };
