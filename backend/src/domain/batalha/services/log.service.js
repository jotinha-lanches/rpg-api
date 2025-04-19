import fs from "fs";
import path from "path";

class Log {
  constructor() {
    this.logs = [];
    this.logFilePath = path.join(__dirname, "logs.json"); // Salvando logs em arquivo JSON
    this.carregarLogs(); // Carrega logs anteriores se existirem
  }

  carregarLogs() {
    if (fs.existsSync(this.logFilePath)) {
      try {
        const data = fs.readFileSync(this.logFilePath, "utf8");
        this.logs = JSON.parse(data);
      } catch (error) {
        console.error("Erro ao carregar logs:", error);
        this.logs = [];
      }
    }
  }

  salvarLogs() {
    fs.writeFileSync(this.logFilePath, JSON.stringify(this.logs, null, 2));
  }

  adicionarLog(acao, detalhes) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, acao, detalhes };

    this.logs.push(logEntry);
    this.salvarLogs();
  }

  obterLogs() {
    return this.logs;
  }

  limparLogs() {
    this.logs = [];
    this.salvarLogs();
  }
}

export default new Log();
