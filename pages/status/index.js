import useSWR from "swr";

async function fetchStatus() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 5000,
  });

  if (isLoading || !data) {
    return "Carregando...";
  }

  return (
    <>
      <div>
        Data atual:{" "}
        <strong>{new Date(data.updated_at).toLocaleString("pt-BR")}</strong>
      </div>
      <div>
        Versão do Postgres:{" "}
        <strong>{data.dependencies.database.version}</strong>
      </div>
      <div>
        Conexões máximas:{" "}
        <strong>{data.dependencies.database.maximum_connections}</strong>
      </div>
      <div>
        Conexões abertas:{" "}
        <strong>{data.dependencies.database.opened_connections}</strong>
      </div>
    </>
  );
}
