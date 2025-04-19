/**
 * Modelo que representa um personagem dentro de uma batalha
 */
class PersonagemBatalha {
  constructor(
    nome,
    pontosVidaMaximos,
    pontosVidaAtuais,
    iniciativa,
    classeArmadura,
    cdMagia,
    condicoes,
    status
  ) {
    this.nome = nome;
    this.pontosVidaMaximos = pontosVidaMaximos;
    this.pontosVidaAtuais = pontosVidaAtuais;
    this.iniciativa = iniciativa;
    this.classeArmadura = classeArmadura;
    this.cdMagia = cdMagia;
    this.condicoes = condicoes || [];
    this.status = status || "vivo";
  }
}

export default PersonagemBatalha;