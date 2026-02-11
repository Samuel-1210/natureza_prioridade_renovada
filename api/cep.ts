export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: true;
};

const normalizeCep = (value: string) => value.replace(/\D/g, "").slice(0, 8);
const VIACEP_URL = "https://viacep.com.br/ws";
const CEP_TIMEOUT_MS = 15000;

export const lookupCep = async (cep: string): Promise<ViaCepResponse> => {
  const normalizedCep = normalizeCep(cep);

  if (normalizedCep.length !== 8) {
    throw new Error("CEP invalido.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CEP_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${VIACEP_URL}/${normalizedCep}/json/`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tempo limite excedido ao consultar o CEP.");
    }

    throw new Error("Falha de rede ao consultar o CEP.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error("Servico de CEP indisponivel no momento.");
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    throw new Error("CEP nao encontrado.");
  }

  return data;
};
