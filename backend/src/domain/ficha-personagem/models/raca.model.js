import {DataTypes, Model} from "sequelize";
import client from "#infra/database.js";

export class Raca extends Model {}
Raca.init(
    {
        idRaca: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        client,
        modelName: "Raca",
    }
)