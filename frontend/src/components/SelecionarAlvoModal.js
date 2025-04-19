import React, { useState } from "react";

const SelecionarAlvoModal = ({ personagens, onClose, executarAcao, acao }) => {
    const [quantidade, setQuantidade] = useState(""); 
    const [fase, setFase] = useState("input"); // Fases: "input" para valor e "selecao" para escolha de alvo

    return (
        <div className="modal-overlay">
            <div className="modal">
                {fase === "input" ? (
                    <>
                        <h2>{acao === "dano" ? "⚔️ Insira o Dano" : "🩹 Insira a Cura"}</h2>
                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                        <button onClick={() => setFase("selecao")} disabled={!quantidade || Number(quantidade) <= 0}>
                            ✔ Confirmar
                        </button>
                    </>
                ) : (
                    <>
                        <h2>{acao === "dano" ? "⚔️ Escolha o Alvo para Dano" : "🩹 Escolha o Alvo para Cura"}</h2>
                        <ul className="lista-scroll">
                            {personagens.map((p, index) => (
                                <li key={index}>
                                    <strong>{p.nome}</strong> - PV: {p.pontosVidaAtuais} / {p.pontosVidaMaximos} - Status: {p.status}
                                    <button onClick={() => executarAcao(p.nome, Number(quantidade))}>🎯 Selecionar</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={onClose}>Fechar</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SelecionarAlvoModal;
