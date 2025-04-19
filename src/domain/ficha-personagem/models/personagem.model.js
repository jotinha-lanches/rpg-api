import {DataTypes, Model} from "sequelize";

import client from "#infra/database.js";
export class Personagem extends Model {}

Personagem.init(
    {
        idPeronsagem: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },
    {
        client,
        modelName: "Personagem",
    }
)