import { Sequelize } from "sequelize";
// Verifica se le variabili d'ambiente necessarie sono definite
if (!process.env.DATABASE_URL) {
  throw new Error("Una o più variabili d'ambiente necessarie non sono definite: DATABASE_URL");
}
const sequelize = new Sequelize(
  process.env.DATABASE_URL ?? ""
);

export { sequelize };
