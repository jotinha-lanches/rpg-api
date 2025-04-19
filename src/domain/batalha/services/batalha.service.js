import BatalhaDAO from "../dao/batalha.dao.js";
import PersonagemBatalha from "../models/batalha.model.js";
//import CombateLog from "./log.service.js";

class BatalhaService {
  adicionarPersonagem(dadosPersonagem) {
    const pontosVidaMaximos = Number(dadosPersonagem.pontosVidaMaximos) || 1; // Valor padrão de 1 se não vier nada
    const pontosVidaAtuais =
      Number(dadosPersonagem.pontosVidaAtuais) || pontosVidaMaximos; // PV Atual começa igual ao Máximo

    const personagem = new PersonagemBatalha(
      dadosPersonagem.nome,
      pontosVidaMaximos, // Agora garantimos que nunca será null
      pontosVidaAtuais, // Agora garantimos que nunca será null
      dadosPersonagem.iniciativa,
      dadosPersonagem.classeArmadura,
      dadosPersonagem.cdMagia,
      dadosPersonagem.condicoes,
      dadosPersonagem.status
    );

    if (!personagem.nome) {
      throw new Error("O nome do personagem é obrigatório.");
    }

    const sucesso = BatalhaDAO.adicionar(personagem);
    if (!sucesso) {
      throw new Error(`Personagem "${personagem.nome}" já está na batalha.`);
    }

    // CombateLog.adicionarLog(
    //   "ADICIONAR",
    //   `Personagem ${personagem.nome} entrou na batalha.`
    // );

    return personagem;
  }

  removerPersonagem(nome) {
    const sucesso = BatalhaDAO.remover(nome);
    if (!sucesso) {
      throw new Error(`Personagem "${nome}" não encontrado.`);
    }

    //CombateLog.adicionarLog("REMOVER", `Personagem ${nome} saiu da batalha.`);
    return nome;
  }

  listarPersonagens() {
    const personagens = BatalhaDAO.listar();
    return personagens.sort((a, b) => b.iniciativa - a.iniciativa); // Ordenação Descendente
  }

  /**
   * Aplica dano a um personagem
   */
  aplicarDano(nome, dano) {
    const personagem = BatalhaDAO.buscarPorNome(nome);
    if (!personagem) return null;

    // Logging para debug
    console.log("Antes do dano:", {
      nome,
      pontosVidaAtuais: personagem.pontosVidaAtuais,
      valorDano: dano,
      tipoValorDano: typeof dano
    });

    // Converte dano para número inteiro
    const danoNumero = parseInt(dano, 10);
    
    // Se a conversão falhar, usa 0
    if (isNaN(danoNumero)) {
      console.log("Valor de dano inválido:", dano);
      return personagem; // Retorna sem alterar se o dano for inválido
    }

    // Converte explicitamente para número inteiro
    let vidaAtual = parseInt(personagem.pontosVidaAtuais, 10);
    
    // Se a conversão falhar, usa valor seguro
    if (isNaN(vidaAtual)) vidaAtual = 0;
    
    // Subtrai o dano
    const novaVida = vidaAtual - danoNumero;
    
    // Não permite vida negativa
    personagem.pontosVidaAtuais = Math.max(0, novaVida);

    // Logging para debug
    console.log("Após o dano:", {
      nome,
      pontosVidaAtuaisAntes: vidaAtual,
      valorDanoAplicado: danoNumero,
      pontosVidaAtuaisDepois: personagem.pontosVidaAtuais
    });

    BatalhaDAO.atualizar(personagem);
    return personagem;
  }

  /**
   * Cura um personagem
   */
  curarPersonagem(nome, cura) {
    const personagem = BatalhaDAO.buscarPorNome(nome);
    if (!personagem) return null;

    // Logging para debug
    console.log("Antes da cura:", {
      nome,
      pontosVidaAtuais: personagem.pontosVidaAtuais,
      pontosVidaMaximos: personagem.pontosVidaMaximos,
      valorCura: cura,
      tipoValorCura: typeof cura
    });

    // Converte cura para número inteiro (usando parseInt para garantir inteiro)
    const curaNumero = parseInt(cura, 10);
    
    // Se a conversão falhar, usa 0
    if (isNaN(curaNumero)) {
      console.log("Valor de cura inválido:", cura);
      return personagem; // Retorna sem alterar se a cura for inválida
    }

    // Converte explicitamente para números inteiros
    let vidaAtual = parseInt(personagem.pontosVidaAtuais, 10);
    const vidaMaxima = parseInt(personagem.pontosVidaMaximos, 10);

    // Se a conversão falhar, usa valores seguros
    if (isNaN(vidaAtual)) vidaAtual = 0;
    
    // Adiciona a cura
    const novaVida = vidaAtual + curaNumero;
    
    // Limita ao máximo
    personagem.pontosVidaAtuais = Math.min(novaVida, vidaMaxima);

    // Logging para debug
    console.log("Após a cura:", {
      nome,
      pontosVidaAtuaisAntes: vidaAtual,
      valorCuraAplicado: curaNumero,
      pontosVidaAtuaisDepois: personagem.pontosVidaAtuais
    });

    BatalhaDAO.atualizar(personagem);
    return personagem;
  }

  /**
   * Atualiza o status de um personagem (vivo, inconsciente, morto)
   */
  atualizarStatus(nome, status) {
    const personagem = BatalhaDAO.buscarPorNome(nome);
    if (!personagem) throw new Error(`Personagem "${nome}" não encontrado.`);

    personagem.status = status;
    BatalhaDAO.atualizar(personagem);

    // Log.adicionarLog("STATUS", `O personagem ${nome} mudou de status: ${statusAnterior} → ${status}`);

    return personagem;
  }

  /**
   * Avança o turno para o próximo personagem vivo
   */
  avancarTurno() {
    const personagens = BatalhaDAO.listar();
    let indexAtual = personagens.findIndex((p) => p.status === "ativo");

    if (indexAtual === -1) indexAtual = 0;

    let novoIndex = (indexAtual + 1) % personagens.length;
    while (
      personagens[novoIndex].status === "morto" ||
      personagens[novoIndex].status === "inconsciente"
    ) {
      novoIndex = (novoIndex + 1) % personagens.length;
    }

    return personagens[novoIndex];
  }

  /**
   * Volta o turno para o personagem anterior vivo
   */
  voltarTurno() {
    const personagens = BatalhaDAO.listar();
    let indexAtual = personagens.findIndex((p) => p.status === "ativo");

    if (indexAtual === -1) indexAtual = 0;

    let novoIndex = (indexAtual - 1 + personagens.length) % personagens.length;
    while (
      personagens[novoIndex].status === "morto" ||
      personagens[novoIndex].status === "inconsciente"
    ) {
      novoIndex = (novoIndex - 1 + personagens.length) % personagens.length;
    }

    return personagens[novoIndex];
  }

  /**
   * Inicia a batalha, mudando seu estado de "creating" para "active"
   */
  iniciarBatalha() {
    const estadoAtual = BatalhaDAO.getEstado();
    
    if (estadoAtual !== "creating") {
      throw new Error(`Não é possível iniciar a batalha no estado: ${estadoAtual}`);
    }
    
    if (BatalhaDAO.listar().length === 0) {
      throw new Error("Não é possível iniciar uma batalha sem personagens");
    }
    
    BatalhaDAO.setEstado("active");
    return { estado: "active", mensagem: "Batalha iniciada com sucesso" };
  }

  /**
   * Finaliza a batalha, mudando seu estado de "active" para "finished"
   */
  finalizarBatalha() {
    const estadoAtual = BatalhaDAO.getEstado();
    
    if (estadoAtual !== "active") {
      throw new Error(`Não é possível finalizar a batalha no estado: ${estadoAtual}`);
    }
    
    BatalhaDAO.setEstado("finished");
    return { estado: "finished", mensagem: "Batalha finalizada com sucesso" };
  }

  /**
   * Retorna o estado atual da batalha
   */
  getEstadoBatalha() {
    return BatalhaDAO.getEstado();
  }
}

export default new BatalhaService();
