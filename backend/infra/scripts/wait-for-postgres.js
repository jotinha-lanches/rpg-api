import { exec } from "node:child_process";
function waitingForPostgres() {
  exec(
    "docker exec rpg-battle-dev pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.search("accepting connections") == -1) {
        process.stdout.write(".");
        waitingForPostgres();
        return;
      }
      process.stdout.write(
        "\n\n🟢Postgres está pronto e aceitando conexões!\n"
      );
    }
  );
}

process.stdout.write("\n\n🔴 Aguardando postgres aceitar conexões ");
waitingForPostgres();
