const express = require('express');
const router = express.Router();
const BatalhaService = require('../services/batalha.service');
const Condicao = require('../models/condicao.model'); // Certifique-se de ajustar o caminho corretamente
/**
 * @swagger
 * tags:
 *   name: Batalha
 *   description: Gerenciamento de personagens na batalha
 */

/**
 * @swagger
 * /batalha/personagens:
 *   get:
 *     summary: Lista todos os personagens na batalha
 *     tags: [Batalha]
 */
router.get('/personagens', (req, res) => {
    res.status(200).json({ personagens: BatalhaService.listarPersonagens() });
});

/**
 * @swagger
 * /batalha/personagens:
 *   post:
 *     summary: Adiciona um personagem à batalha
 *     tags: [Batalha]
 */
router.post('/personagens', (req, res) => {
    try {
        const personagem = BatalhaService.adicionarPersonagem(req.body);
        res.status(201).json({ message: 'Personagem adicionado à batalha', personagem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /batalha/personagens/{nome}:
 *   delete:
 *     summary: Remove um personagem da batalha pelo nome
 *     tags: [Batalha]
 */
router.delete('/personagens/:nome', (req, res) => {
    try {
        const nome = BatalhaService.removerPersonagem(req.params.nome);
        res.status(200).json({ message: `Personagem ${nome} removido da batalha.` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /batalha/personagens/{nome}/dano:
 *   patch:
 *     summary: Aplica dano a um personagem
 *     tags: [Batalha]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do personagem a ser danificado
 *       - in: body
 *         name: body
 *         required: true
 *         description: Quantidade de dano a ser aplicada
 *         schema:
 *           type: object
 *           properties:
 *             dano:
 *               type: integer
 *     responses:
 *       200:
 *         description: Dano aplicado com sucesso
 */
router.patch('/personagens/:nome/dano', (req, res) => {
    const { nome } = req.params;
    const { dano } = req.body;

    const personagem = BatalhaService.aplicarDano(nome, dano);
    if (!personagem) return res.status(404).json({ error: "Personagem não encontrado" });

    res.status(200).json({ message: `Dano de ${dano} aplicado a ${nome}.`, personagem });
});

/**
 * @swagger
 * /batalha/personagens/{nome}/cura:
 *   patch:
 *     summary: Cura um personagem
 *     tags: [Batalha]
 */
router.patch('/personagens/:nome/cura', (req, res) => {
    const { nome } = req.params;
    const { cura } = req.body;

    const personagem = BatalhaService.curarPersonagem(nome, cura);
    if (!personagem) return res.status(404).json({ error: "Personagem não encontrado" });

    res.status(200).json({ message: `${nome} foi curado em ${cura} pontos.`, personagem });
});

/**
 * @swagger
 * /batalha/turno/avancar:
 *   post:
 *     summary: Avança o turno para o próximo personagem
 *     tags: [Batalha]
 */
router.post('/turno/avancar', (req, res) => {
    const proximo = BatalhaService.avancarTurno();
    res.status(200).json({ message: `Turno avançado para ${proximo.nome}.`, personagem: proximo });
});

/**
 * @swagger
 * /batalha/turno/voltar:
 *   post:
 *     summary: Volta o turno para o personagem anterior
 *     tags: [Batalha]
 */
router.post('/turno/voltar', (req, res) => {
    const anterior = BatalhaService.voltarTurno();
    res.status(200).json({ message: `Turno voltado para ${anterior.nome}.`, personagem: anterior });
});

/**
 * @swagger
 * /batalha/personagens/{nome}/status:
 *   patch:
 *     summary: Atualiza o status de um personagem (vivo, inconsciente, morto)
 *     tags: [Batalha]
 */
router.patch('/personagens/:nome/status', (req, res) => {
    const { nome } = req.params;
    const { status } = req.body; // "vivo", "inconsciente", "morto"

    const personagem = BatalhaService.atualizarStatus(nome, status);
    if (!personagem) return res.status(404).json({ error: "Personagem não encontrado" });

    res.status(200).json({ message: `Status de ${nome} atualizado para ${status}.`, personagem });
});

/**
 * @swagger
 * /batalha/condicoes:
 *   get:
 *     summary: Retorna todas as condições disponíveis
 *     tags: [Batalha]
 *     responses:
 *       200:
 *         description: Lista de condições disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 condicoes:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/condicoes', (req, res) => {
    const condicoes = Object.values(Condicao); // Converte os valores da classe Condicao em um array
    res.status(200).json({ condicoes });
});



module.exports = router;
