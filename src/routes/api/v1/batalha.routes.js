import express from "express";
import BatalhaService from "#src/domain/batalha/services/batalha.service.js";
import Condicao from "#src/domain/batalha/models/condicao.model.js";

const router = express.Router();

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
router.get("/personagens", (req, res) => {
  res.status(200).json({ personagens: BatalhaService.listarPersonagens() });
});

/**
 * @swagger
 * /batalha/personagens:
 *   post:
 *     summary: Adiciona um personagem à batalha
 *     tags: [Batalha]
 */
router.post("/personagens", (req, res) => {
  try {
    const personagem = BatalhaService.adicionarPersonagem(req.body);
    res
      .status(201)
      .json({ message: "Personagem adicionado à batalha", personagem });
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
router.delete("/personagens/:nome", (req, res) => {
  try {
    const nome = BatalhaService.removerPersonagem(req.params.nome);
    res
      .status(200)
      .json({ message: `Personagem ${nome} removido da batalha.` });
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
 */
router.patch("/personagens/:nome/dano", (req, res) => {
  const { nome } = req.params;
  const { dano } = req.body;

  const personagem = BatalhaService.aplicarDano(nome, dano);
  if (!personagem)
    return res.status(404).json({ error: "Personagem não encontrado" });

  res
    .status(200)
    .json({ message: `Dano de ${dano} aplicado a ${nome}.`, personagem });
});

/**
 * @swagger
 * /batalha/personagens/{nome}/cura:
 *   patch:
 *     summary: Cura um personagem
 *     tags: [Batalha]
 */
router.patch("/personagens/:nome/cura", (req, res) => {
  const { nome } = req.params;
  const { cura } = req.body;

  const personagem = BatalhaService.curarPersonagem(nome, cura);
  if (!personagem)
    return res.status(404).json({ error: "Personagem não encontrado" });

  res
    .status(200)
    .json({ message: `${nome} foi curado em ${cura} pontos.`, personagem });
});

/**
 * @swagger
 * /batalha/turno/avancar:
 *   post:
 *     summary: Avança o turno para o próximo personagem
 *     tags: [Batalha]
 */
router.post("/turno/avancar", (req, res) => {
  const proximo = BatalhaService.avancarTurno();
  res.status(200).json({
    message: `Turno avançado para ${proximo.nome}.`,
    personagem: proximo,
  });
});

/**
 * @swagger
 * /batalha/turno/voltar:
 *   post:
 *     summary: Volta o turno para o personagem anterior
 *     tags: [Batalha]
 */
router.post("/turno/voltar", (req, res) => {
  const anterior = BatalhaService.voltarTurno();
  res.status(200).json({
    message: `Turno voltado para ${anterior.nome}.`,
    personagem: anterior,
  });
});

/**
 * @swagger
 * /batalha/personagens/{nome}/status:
 *   patch:
 *     summary: Atualiza o status de um personagem (vivo, inconsciente, morto)
 *     tags: [Batalha]
 */
router.patch("/personagens/:nome/status", (req, res) => {
  const { nome } = req.params;
  const { status } = req.body;

  const personagem = BatalhaService.atualizarStatus(nome, status);
  if (!personagem)
    return res.status(404).json({ error: "Personagem não encontrado" });

  res.status(200).json({
    message: `Status de ${nome} atualizado para ${status}.`,
    personagem,
  });
});

/**
 * @swagger
 * /batalha/condicoes:
 *   get:
 *     summary: Retorna todas as condições disponíveis
 *     tags: [Batalha]
 */
router.get("/condicoes", (req, res) => {
  const condicoes = Object.values(Condicao);
  res.status(200).json({ condicoes });
});

/**
 * @swagger
 * /batalha/iniciar:
 *   post:
 *     summary: Inicia a batalha, mudando seu estado de "creating" para "active"
 *     tags: [Batalha]
 *     responses:
 *       200:
 *         description: Batalha iniciada com sucesso
 *       400:
 *         description: Erro ao iniciar batalha
 */
router.post("/iniciar", (req, res) => {
  try {
    const resultado = BatalhaService.iniciarBatalha();
    res.status(200).json({
      message: resultado.mensagem,
      estado: resultado.estado
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /batalha/finalizar:
 *   post:
 *     summary: Finaliza a batalha, mudando seu estado de "active" para "finished"
 *     tags: [Batalha]
 *     responses:
 *       200:
 *         description: Batalha finalizada com sucesso
 *       400:
 *         description: Erro ao finalizar batalha
 */
router.post("/finalizar", (req, res) => {
  try {
    const resultado = BatalhaService.finalizarBatalha();
    res.status(200).json({
      message: resultado.mensagem,
      estado: resultado.estado
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /batalha/estado:
 *   get:
 *     summary: Retorna o estado atual da batalha (creating, active, finished)
 *     tags: [Batalha]
 *     responses:
 *       200:
 *         description: Estado atual da batalha
 */
router.get("/estado", (req, res) => {
  const estado = BatalhaService.getEstadoBatalha();
  res.status(200).json({ estado });
});

export default router;
