const fichaPersonagemDAO = require("../dao/fichaPersonagem.dao");

class FichaPersonagemService {
  getCharacters() {
    return fichaPersonagemDAO.getFichasPersonagem();
  }

  addCharacter(data) {
    // Aqui é possível incluir validações antes de salvar a ficha
    return fichaPersonagemDAO.addFichaPersonagem(data);
  }
}

module.exports = new FichaPersonagemService();