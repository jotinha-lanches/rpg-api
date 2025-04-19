import React from "react";

const JogarForaDeHoraModal = ({ personagens, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Escolha um Personagem para Jogar Fora de Hora</h2>
        <ul>
          {personagens.map((p, index) => (
            <li key={index}>
              <strong>{p.nome}</strong> - PV: {p.pontosVida} - Status: {p.status || "Vivo"}
              <button onClick={() => onClose()}>🎲 Escolher</button>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default JogarForaDeHoraModal;
