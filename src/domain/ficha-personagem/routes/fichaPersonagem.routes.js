const express = require("express");
const router = express.Router();
const FichaPersonagemService = require("../services/fichaPersonagem.service");
/**
 * @swagger
 * /api/ficha-personagem:
 *   get:
 *     summary: Retorna todas as fichas de personagens
 *     tags:  # 🔥 Adicionando a tag correta para agrupar corretamente
 *       - FichaPersonagem
 *     responses:
 *       200:
 *         description: Lista de fichas cadastradas
 */
router.get("/", (req, res) => {
    const fichas = FichaPersonagemService.getFichas();
    res.status(200).json(fichas);
});

/**
 * @swagger
 * /api/ficha-personagem:
 *   post:
 *     summary: Cadastra uma nova ficha de personagem
 *     description: Este endpoint permite criar uma nova ficha de personagem para um RPG.
 *     tags:
 *       - FichaPersonagem  # 🔥 Tag já estava correta
 *     requestBody:
 *       description: Dados da ficha do personagem a ser cadastrada.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personagem:
 *                 type: object
 *                 properties:
 *                   nome:
 *                     type: string
 *                     description: Nome do personagem.
 *                     example: "Arthas"
 *                   classe_e_nível:
 *                     type: string
 *                     description: Classe e nível do personagem.
 *                     example: "Paladino 5"
 *                   antecedente:
 *                     type: string
 *                     description: Antecedente do personagem.
 *                     example: "Nobre"
 *                   nome_do_jogador:
 *                     type: string
 *                     description: Nome do jogador responsável.
 *                     example: "Gabriel"
 *                   raça:
 *                     type: string
 *                     description: Raça do personagem.
 *                     example: "Humano"
 *                   alinhamento:
 *                     type: string
 *                     description: Alinhamento do personagem.
 *                     example: "Leal e Mau"
 *                   pontos_de_experiência:
 *                     type: integer
 *                     description: Pontos de experiência acumulados.
 *                     example: 14000
 *               atributos:
 *                 type: object
 *                 properties:
 *                   força:
 *                     type: integer
 *                     description: Atributo de força.
 *                     example: 16
 *                   destreza:
 *                     type: integer
 *                     description: Atributo de destreza.
 *                     example: 12
 *                   constituição:
 *                     type: integer
 *                     description: Atributo de constituição.
 *                     example: 14
 *                   inteligência:
 *                     type: integer
 *                     description: Atributo de inteligência.
 *                     example: 10
 *                   sabedoria:
 *                     type: integer
 *                     description: Atributo de sabedoria.
 *                     example: 13
 *                   carisma:
 *                     type: integer
 *                     description: Atributo de carisma.
 *                     example: 18
 *     responses:
 *       201:
 *         description: Ficha cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personagem:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       example: "Arthas"
 *                     classe_e_nível:
 *                       type: string
 *                       example: "Paladino 5"
 */
router.post("/", (req, res) => {
    const data = req.body;

    if (!data.personagem || !data.personagem.classe_e_nível) {
        return res.status(400).json({ error: "A classe e o nível são obrigatórios." });
    }

    const newFicha = FichaPersonagemService.addFicha(data);
    res.status(201).json(newFicha);
});

module.exports = router;
