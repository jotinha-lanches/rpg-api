import React, { useState } from "react";

const Colapse = ({ titulo, children }) => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="colapse-container">
      <button className="colapse-botao" onClick={() => setAberto(!aberto)}>
        {aberto ? "▼ " : "▶ "} {titulo}
      </button>
      {aberto && <div className="colapse-conteudo">{children}</div>}
    </div>
  );
};

export default Colapse;
