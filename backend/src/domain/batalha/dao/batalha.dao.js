class BatalhaDAO {
  constructor() {
    this.personagens = [];
    this.estado = "creating"; // Estado inicial: creating, active, finished
  }

  adicionar(personagem) {
    if (this.personagens.find((p) => p.nome === personagem.nome)) {
      return false;
    }
    this.personagens.push(personagem);
    return true;
  }

  remover(nome) {
    const index = this.personagens.findIndex((p) => p.nome === nome);
    if (index === -1) return false;

    this.personagens.splice(index, 1);
    return true;
  }

  listar() {
    return this.personagens;
  }

  buscarPorNome(nome) {
    return this.personagens.find((p) => p.nome === nome);
  }

  atualizar(personagemAtualizado) {
    const index = this.personagens.findIndex(
      (p) => p.nome === personagemAtualizado.nome
    );
    if (index !== -1) {
      this.personagens[index] = personagemAtualizado;
    }
  }

  getEstado() {
    return this.estado;
  }

  setEstado(novoEstado) {
    if (["creating", "active", "finished"].includes(novoEstado)) {
      this.estado = novoEstado;
      return true;
    }
    return false;
  }
}

export default new BatalhaDAO();
