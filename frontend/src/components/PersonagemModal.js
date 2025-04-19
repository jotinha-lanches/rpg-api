import React, { useEffect, useState } from "react";
import Colapse from "./Colapse"; // Importando o colapse

const PersonagemModal = ({
  personagens,
  onClose,
  atualizarStatus,
  adicionarPersonagem,
  removerPersonagem,
}) => {
  const [condicoesDisponiveis, setCondicoesDisponiveis] = useState([]);
  const [novoPersonagem, setNovoPersonagem] = useState({
    nome: "",
    pontosVidaMaximos: "",
    pontosVidaAtuais: "",
    iniciativa: "",
    classeArmadura: "",
    cdMagia: "",
    condicoes: [],
  });

  useEffect(() => {
    fetch("/api/v1/batalha/condicoes")
      .then((res) => res.json())
      .then((data) => {
        if (data.condicoes && Array.isArray(data.condicoes)) {
          setCondicoesDisponiveis(data.condicoes); // ✅ Garante que é um array
        } else {
          console.error("Erro: API não retornou um array de condições", data);
          setCondicoesDisponiveis([]); // Evita erro
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar condições:", error);
        setCondicoesDisponiveis([]);
      });
  }, []);

  // Função para remover personagem
  const handleRemover = (nome) => {
    if (!window.confirm(`Tem certeza que deseja remover ${nome} da batalha?`))
      return;

    fetch(`/api/v1/batalha/personagens/${nome}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao remover personagem");
        removerPersonagem(nome); // Atualiza a lista na UI
      })
      .catch((error) => console.error("Erro ao remover personagem:", error));
  };

  // Adicionar personagem
  const handleAdicionar = () => {
    if (typeof adicionarPersonagem !== "function") {
      console.error("Erro: adicionarPersonagem não é uma função!");
      return;
    }
    adicionarPersonagem(novoPersonagem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Gerenciar Personagens</h2>

        {/* Lista de personagens com colapse e scroll */}
        <Colapse titulo="Personagens na Batalha">
          <div className="lista-scroll">
            {personagens.map((p, index) => (
              <div key={index} className="personagem-item">
                <div className="personagem-info">
                  <strong className="personagem-nome">{p.nome}</strong>
                  <span>
                    PV: {p.pontosVidaAtuais} / {p.pontosVidaMaximos}
                  </span>
                  <span>Status: {p.status || "Vivo"}</span>
                </div>

                <div className="personagem-controles">
                  <select
                    value={p.status || "vivo"}
                    onChange={(e) => atualizarStatus(p.nome, e.target.value)}
                  >
                    <option value="vivo">Vivo</option>
                    <option value="inconsciente">Inconsciente</option>
                    <option value="morto">Morto</option>
                  </select>

                  <button
                    className="botao-excluir"
                    onClick={() => removerPersonagem(p.nome)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Colapse>

        {/* Formulário para adicionar novo personagem */}
        <h3>Novo Personagem</h3>
        <input
          type="text"
          placeholder="Nome"
          value={novoPersonagem.nome}
          onChange={(e) =>
            setNovoPersonagem({ ...novoPersonagem, nome: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="PV Máximo"
          value={novoPersonagem.pontosVidaMaximos}
          onChange={(e) =>
            setNovoPersonagem({
              ...novoPersonagem,
              pontosVidaMaximos: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="PV Atual"
          value={novoPersonagem.pontosVidaAtuais}
          onChange={(e) =>
            setNovoPersonagem({
              ...novoPersonagem,
              pontosVidaAtuais: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Iniciativa"
          value={novoPersonagem.iniciativa}
          onChange={(e) =>
            setNovoPersonagem({ ...novoPersonagem, iniciativa: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="CA"
          value={novoPersonagem.classeArmadura}
          onChange={(e) =>
            setNovoPersonagem({
              ...novoPersonagem,
              classeArmadura: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="CD Magia"
          value={novoPersonagem.cdMagia}
          onChange={(e) =>
            setNovoPersonagem({ ...novoPersonagem, cdMagia: e.target.value })
          }
        />

        <button onClick={handleAdicionar}>➕ Adicionar</button>

        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default PersonagemModal;
