import FichaPersonagem from "../models/personagem.model.js";

class FichaPersonagemDAO {
  constructor() {
    this.fichasPersonagem = []; // Simula um banco de dados em memória
  }
  
  getFichasPersonagem() {
    return this.fichasPersonagem;
  }
  
  addFichaPersonagem(data) {
    const novaFichaPersonagem = new FichaPersonagem();
  
    // Atualiza os valores do personagem com os dados recebidos
    Object.assign(novaFichaPersonagem, data);
  
    this.fichasPersonagem.push(novaFichaPersonagem);
    return novaFichaPersonagem;
  }
}

export default new FichaPersonagemDAO();
