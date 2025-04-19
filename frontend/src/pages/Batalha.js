import React, { useEffect, useState } from "react";
import PersonagemModal from "../components/PersonagemModal";
import JogarForaDeHoraModal from "../components/JogarForaDeHoraModal";
import SelecionarAlvoModal from "../components/SelecionarAlvoModal";
import Colapse from "../components/Colapse";

const Batalha = () => {
    const [personagens, setPersonagens] = useState([]);
    const [turnoAtual, setTurnoAtual] = useState(0);
    const [modalGerenciamento, setModalGerenciamento] = useState(false);
    const [modalJogarForaDeHora, setModalJogarForaDeHora] = useState(false);
    const [modalSelecionarAlvo, setModalSelecionarAlvo] = useState(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);

    useEffect(() => {
        carregarPersonagens();
    }, []);

    const carregarPersonagens = async () => {
        try {
            const response = await fetch("/api/v1/batalha/personagens");
            const data = await response.json();
            setPersonagens(data.personagens);
        } catch (error) {
            console.error("Erro ao buscar personagens:", error);
        }
    };

    // Adicionar novo personagem com body correto
    const adicionarPersonagem = async (personagem) => {
        if (!personagem.nome) return alert("Nome é obrigatório!");

        const novoPersonagem = {
            nome: personagem.nome,
            pontosVidaMaximos: Number(personagem.pontosVidaMaximos),
            pontosVidaAtuais: Number(personagem.pontosVidaAtuais) || Number(personagem.pontosVidaMaximos), // Inicia igual ao Máximo
            iniciativa: Number(personagem.iniciativa),
            classeArmadura: Number(personagem.classeArmadura),
            cdMagia: Number(personagem.cdMagia),
            condicoes: Array.isArray(personagem.condicoes) ? personagem.condicoes : [], // 🔥 Garante que condicoes seja um array
            status: "vivo",
        };

        try {
            await fetch("/api/v1/batalha/personagens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoPersonagem),
            });

            carregarPersonagens();
        } catch (error) {
            console.error("Erro ao adicionar personagem:", error);
        }
    };

    const removerPersonagem = async (nome) => {
        try {
            const response = await fetch(`/api/v1/batalha/personagens/${nome}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erro ao remover personagem");

        } catch (error) {
            console.error("Erro ao remover personagem:", error);
        }
        carregarPersonagens();
    };

    // Atualizar status (vivo, inconsciente, morto)
    const atualizarStatus = async (nome, status) => {
        try {
            const response = await fetch(`/api/v1/batalha/personagens/${nome}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar status");

        } catch (error) {
            console.error("Erro ao atualizar status do personagem:", error);
        }
        carregarPersonagens();
    };

    // Abrir modal para selecionar alvo da ação
    const prepararAcao = (acao) => {
        setAcaoSelecionada(acao);
        setModalSelecionarAlvo(true);
    };

    // Função para aplicar dano ou cura
    const executarAcao = async (nomeAlvo, quantidade) => {
        if (!acaoSelecionada || !quantidade || Number(quantidade) <= 0) {
            alert("Selecione uma ação e insira uma quantidade válida.");
            return;
        }

        try {
            const endpoint = acaoSelecionada === "dano"
                ? `/api/v1/batalha/personagens/${nomeAlvo}/dano`
                : `/api/v1/batalha/personagens/${nomeAlvo}/cura`;

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [acaoSelecionada]: Number(quantidade) }),
            });

            if (!response.ok) throw new Error("Erro ao executar ação");

            carregarPersonagens(); // Atualiza a lista de personagens
            setModalSelecionarAlvo(false); // Fecha o modal após a ação
        } catch (error) {
            console.error("Erro ao executar ação:", error);
        }
    };

    // Avançar turno, pulando personagens mortos/inconscientes
    const avancarTurno = () => {
        let novoTurno = (turnoAtual + 1) % personagens.length;
        while (personagens[novoTurno].status === "morto" || personagens[novoTurno].status === "inconsciente") {
            novoTurno = (novoTurno + 1) % personagens.length;
        }
        setTurnoAtual(novoTurno);
    };

    // Voltar turno, pulando personagens mortos/inconscientes
    const voltarTurno = () => {
        let novoTurno = (turnoAtual - 1 + personagens.length) % personagens.length;
        while (personagens[novoTurno].status === "morto" || personagens[novoTurno].status === "inconsciente") {
            novoTurno = (novoTurno - 1 + personagens.length) % personagens.length;
        }
        setTurnoAtual(novoTurno);
    };

    return (
        <div className="container-batalha">
            <h1>BATALHA</h1>
            <h2>TURNO ATUAL: {personagens[turnoAtual]?.nome || "Ninguém"}</h2>

            {/* Controles de Ação */}
            <div className="controle-acao">
                <button className="botao-acao" onClick={() => prepararAcao("dano")}>⚔️ Dar Dano</button>
                <button className="botao-acao" onClick={() => prepararAcao("cura")}>🩹 Curar</button>
            </div>

            {/* Controles de Turno */}
            <div className="controle-turno">
                <button className="botao-controle" onClick={() => setModalGerenciamento(true)}>⚙️ Gerenciar Personagens</button>
                <button className="botao-controle" onClick={() => setModalJogarForaDeHora(true)}>⏳ Jogar Fora de Hora</button>
                <button className="botao-controle" onClick={voltarTurno}>⏪ Voltar Turno</button>
                <button className="botao-controle" onClick={avancarTurno}>⏩ Avançar Turno</button>
            </div>

            <Colapse titulo="Personagens na Batalha">
                <div className="tabela-personagens">
                    <div className="tabela-body">
                        <div className="tabela-header">
                            <div className="coluna-header">Nome</div>
                            <div className="coluna-header">PV</div>
                            <div className="coluna-header">Iniciativa</div>
                            <div className="coluna-header">CA</div>
                            <div className="coluna-header">CD Magia</div>
                        </div>
                        {personagens.map((p, index) => (
                            <div key={index} className={`tabela-linha ${p.status === "morto" ? "morto" : ""}`}>
                                <div className="coluna">
                                    <strong>
                                        {p.nome} {p.status === "morto" ? "💀" : p.status === "inconsciente" ? "💤" : ""}
                                    </strong>

                                </div>
                                <div className="coluna pv-coluna">{p.pontosVidaAtuais} / {p.pontosVidaMaximos}</div>
                                <div className="coluna">{p.iniciativa}</div>
                                <div className="coluna">{p.classeArmadura}</div>
                                <div className="coluna">{p.cdMagia}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Colapse>

            {/* Modais */}
            {modalGerenciamento && <PersonagemModal personagens={personagens} onClose={() => setModalGerenciamento(false)} atualizarStatus={atualizarStatus} adicionarPersonagem={adicionarPersonagem} removerPersonagem={removerPersonagem} />}
            {modalJogarForaDeHora && <JogarForaDeHoraModal personagens={personagens} onClose={() => setModalJogarForaDeHora(false)} />}
            {modalSelecionarAlvo && <SelecionarAlvoModal personagens={personagens} onClose={() => setModalSelecionarAlvo(false)} executarAcao={executarAcao} acao={acaoSelecionada} />}
        </div>
    );
};

export default Batalha;
