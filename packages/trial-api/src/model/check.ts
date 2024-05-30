import { DataTypes, Model } from "sequelize";
import { sequelize } from "../client.js";
import { Category } from "./category.js";

interface CheckAttributes {
  id: number;
  code: string;
  description: string | null;
  order: number;
  category_id: number | null;
  category?: Category;
}

class Check extends Model<CheckAttributes> implements CheckAttributes {
  public id!: number;
  public code!: string;
  public description!: string | null;
  public order!: number;
  public category_id!: number | null;
  public category?: Category;
}

Check.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Check",
    tableName: "check",
    timestamps: false,
  }
);

// Definisci l'associazione
Check.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

export const checkValuesMap: { [key: string]: number } = {
  VOUCHER_AUTH_DATA_CANNOT_BE_PARSED: 1,
  VOUCHER_HEADER_NOT_PRESENT: 2,
  VOUCHER_PAYLOAD_NOT_PRESENT: 3,
  VOUCHER_TYP_NOT_VALID: 4,
  VOUCHER_ISS_NOT_VALID: 5,
  VOUCHER_AUD_NOT_VALID: 6,
  SIGNATURE_NOT_PRESENT: 7,
  SIGNATURE_NOT_VALID: 8,
  SIGNATURE_PUBLIC_KEY_NOT_VALID: 9,
  SIGNATURE_PAYLOAD_NOT_PRESENT: 10,
  SIGNATURE_EXP_NOT_PRESENT: 11,
  SIGNATURE_EXP_IS_EXPIRED: 12,
  SIGNATURE_IAT_NOT_PRESENT: 13,
  SIGNATURE_IAT_IS_EXPIRED: 14,
  SIGNATURE_AUD_NOT_PRESENT: 15,
  SIGNATURE_AUD_NOT_VALID: 16,
  SIGNATURE_CONTENT_TYPE_NOT_PRESENT: 17,
  SIGNATURE_CONTENT_ENCODING_NOT_PRESENT: 18,
  SIGNATURE_SIGNED_NOT_PRESENT: 19,
  SIGNATURE_SIGNED_CONTENT_TYPE_NOT_PRESENT: 20,
  SIGNATURE_SIGNED_CONTENT_ENCODING_NOT_PRESENT: 21,
  SIGNATURE_SIGNED_DIGEST_NOT_PRESENT: 22,
  SIGNATURE_SIGNED_CONTENT_TYPE_NOT_MATCH: 23,
  SIGNATURE_SIGNED_CONTENT_ENCODING_NOT_MATCH: 24,
  SIGNATURE_SIGNED_DIGEST_NOT_VALID: 25,
  SIGNATURE_DIGEST_NOT_VALID: 26,
  SIGNATURE_DIGEST_NOT_MATCH_SIGNED_DIGEST: 27,
  SIGNATURE_DIGEST_BODY_NOT_MATCH_SIGNED_DIGEST: 28,
  TRACKING_EVIDENCE_NOT_PRESENT: 29,
  TRACKING_EVIDENCE_NOT_VALID: 30,
  TRACKING_EVIDENCE_PUBLIC_KEY_NOT_VALID: 31,
  TRACKING_EVIDENCE_PAYLOAD_NOT_PRESENT: 32,
  TRACKING_EVIDENCE_EXP_NOT_PRESENT: 33,
  TRACKING_EVIDENCE_EXP_NOT_VALID: 34,
  TRACKING_EVIDENCE_IAT_NOT_PRESENT: 35,
  TRACKING_EVIDENCE_IAT_NOT_VALID: 36,
  TRACKING_EVIDENCE_AUD_NOT_PRESENT: 37,
  TRACKING_EVIDENCE_AUD_NOT_VALID: 38,
  TRACKING_EVIDENCE_ISS_NOT_PRESENT: 39,
  TRACKING_EVIDENCE_PURPOSE_ID_NOT_VALID: 40,
  TRACKING_EVIDENCE_USER_ID_NOT_VALID: 41,
  TRACKING_EVIDENCE_USER_LOCATION_NOT_VALID: 42,
  TRACKING_EVIDENCE_USER_LOA_NOT_VALID: 43,
  VOUCHER: 44,
  SIGNATURE: 45,
  TRACKING_EVIDENCE: 46,
  RESIDENCE_VERIFICATION_001: 47,
  FISCALCODE_VERIFICATION: 48,
  CERT_VERIFICATION_OK: 49,
  CERT_VERIFICATION_NOT_VALID: 50,
};

const getCheckValue = (key: string): number | undefined => checkValuesMap[key];

export { Check, CheckAttributes, getCheckValue };
