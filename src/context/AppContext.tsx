import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Ocorrencia, Usuario, podeGerirOcorrencia } from '../domain/types';
import {
  atualizarOcorrencia,
  criarOcorrencia,
  definirUsuarioAtual,
  listarOcorrencias,
  listarUsuarios,
  obterOcorrencia,
  obterUsuarioAtual,
} from '../services/ocorrenciaService';

interface AppContextValue {
  usuario: Usuario | null;
  ocorrencias: Ocorrencia[];
  carregando: boolean;
  isTi: boolean;
  entrarComo: (usuario: Usuario) => Promise<void>;
  recarregar: () => Promise<void>;
  buscarOcorrencia: (id: string) => Promise<Ocorrencia | null>;
  salvarOcorrencia: (ocorrencia: Ocorrencia) => Promise<Ocorrencia>;
  abrirOcorrencia: typeof criarOcorrencia;
  usuariosDisponiveis: Usuario[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    const lista = await listarOcorrencias();
    setOcorrencias(lista);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [usuarioAtual, lista, usuarios] = await Promise.all([
          obterUsuarioAtual(),
          listarOcorrencias(),
          listarUsuarios(),
        ]);
        setUsuario(usuarioAtual);
        setOcorrencias(lista);
        setUsuariosDisponiveis(usuarios);
      } finally {
        setCarregando(false);
      }
    }
    init();
  }, []);

  const entrarComo = useCallback(async (u: Usuario) => {
    await definirUsuarioAtual(u);
    setUsuario(u);
  }, []);

  const buscarOcorrencia = useCallback(async (id: string) => {
    return obterOcorrencia(id);
  }, []);

  const salvarOcorrencia = useCallback(async (ocorrencia: Ocorrencia) => {
    const atualizada = await atualizarOcorrencia(ocorrencia);
    setOcorrencias((prev) =>
      prev
        .map((o) => (o.id === atualizada.id ? atualizada : o))
        .sort(
          (a, b) =>
            new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime()
        )
    );
    return atualizada;
  }, []);

  const abrirOcorrencia = useCallback(
    async (...args: Parameters<typeof criarOcorrencia>) => {
      const nova = await criarOcorrencia(...args);
      setOcorrencias((prev) => [nova, ...prev]);
      return nova;
    },
    []
  );

  const value = useMemo<AppContextValue>(
    () => ({
      usuario,
      ocorrencias,
      carregando,
      isTi: usuario ? podeGerirOcorrencia(usuario.perfil) : false,
      entrarComo,
      recarregar,
      buscarOcorrencia,
      salvarOcorrencia,
      abrirOcorrencia,
      usuariosDisponiveis,
    }),
    [
      usuario,
      ocorrencias,
      carregando,
      entrarComo,
      recarregar,
      buscarOcorrencia,
      salvarOcorrencia,
      abrirOcorrencia,
      usuariosDisponiveis,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return ctx;
}
