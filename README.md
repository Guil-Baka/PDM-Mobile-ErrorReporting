# Ocorrências de Infraestrutura

Aplicativo mobile React Native (Expo) para registro e gestão de **Ocorrências de Infraestrutura** da faculdade, conforme o domínio definido em [CONTEXT.md](./CONTEXT.md).

## Funcionalidades

- **Abertura da Ocorrência** por Aluno, Professor ou Equipe de TI
- Listagem e detalhes com status canônicos (Aberta, Em Atendimento, Aguardando Solicitante, Solicitação de Encerramento, Encerrada)
- **Escopo de Localização** (Específica / Geral)
- **Ações de Gestão da Ocorrência** (Equipe de TI): assumir, aguardar solicitante, encerrar, negar encerramento
- **Resposta do Solicitante** em Aguardando Solicitante
- **Solicitação de Encerramento** pelo Solicitante
- **Nova Ocorrência após Encerramento** com pré-preenchimento de título e localização
- Encerramento por **Duplicata** com referência à Ocorrência Principal

---

## Setup

### 1. Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|------------|---------------|------------|
| [Node.js](https://nodejs.org/) | 18 LTS ou superior | Inclui o `npm` |
| Git | qualquer recente | Para clonar o repositório |
| Smartphone com [Expo Go](https://expo.dev/go) | — | Forma mais simples de testar |
| Android Studio *(opcional)* | — | Apenas se quiser usar emulador Android |
| Xcode *(opcional, macOS)* | — | Apenas se quiser usar simulador iOS |

Verifique se o Node.js foi instalado corretamente:

```bash
node -v
npm -v
```

Saída esperada: `v18.x.x` (ou superior) e `10.x.x` (ou superior).

#### Instalar Node.js no Windows

1. Acesse [https://nodejs.org/](https://nodejs.org/) e baixe a versão **LTS**.
2. Execute o instalador e marque a opção **Add to PATH**.
3. Feche e reabra o terminal (PowerShell ou CMD).
4. Confirme com `node -v`.

### 2. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd PDM-Mobile-ErrorReporting
```

Se você já possui o projeto localmente, navegue até a pasta raiz do repositório antes de continuar.

### 3. Instalar dependências

Na raiz do projeto:

```bash
npm install
```

Esse comando baixa o Expo, React Native e todas as bibliotecas listadas em `package.json`. A primeira execução pode levar alguns minutos.

---

## Rodar o programa

### Opção A — Dispositivo físico com Expo Go *(recomendado)*

1. Instale o app **Expo Go** no celular:
   - [Android — Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Certifique-se de que o **celular e o computador estão na mesma rede Wi-Fi**.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

4. Um QR code aparecerá no terminal (ou no navegador, em `http://localhost:8081`).

5. Abra o app no celular:
   - **Android:** abra o Expo Go e toque em **Scan QR code**.
   - **iOS:** abra a câmera nativa, aponte para o QR code e toque na notificação do Expo Go.

6. Aguarde o bundle carregar. Na primeira execução pode demorar um pouco.

### Opção B — Emulador Android

Requer [Android Studio](https://developer.android.com/studio) com um AVD (Android Virtual Device) configurado.

```bash
npm run android
```

O Expo iniciará o Metro bundler e tentará abrir o app no emulador automaticamente.

### Opção C — Simulador iOS *(somente macOS)*

Requer Xcode instalado.

```bash
npm run ios
```

### Opção D — Navegador web

Útil para inspecionar layout rapidamente, mas alguns recursos mobile podem se comportar de forma diferente.

```bash
npm run web
```

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo Dev Server (Metro) |
| `npm run android` | Abre no emulador/dispositivo Android |
| `npm run ios` | Abre no simulador iOS *(macOS)* |
| `npm run web` | Abre no navegador |
| `npm run lint` | Executa o linter do Expo |

Atalhos no terminal do Expo (após `npm start`):

| Tecla | Ação |
|-------|------|
| `a` | Abrir no Android |
| `i` | Abrir no iOS |
| `w` | Abrir no navegador |
| `r` | Recarregar o app |
| `m` | Alternar menu de desenvolvedor |

---

## Primeiro uso

1. Ao abrir o app, selecione um perfil na tela **Entrar como**:

   | Perfil | Nome | Uso |
   |--------|------|-----|
   | Aluno | Ana Silva | Abrir ocorrências, responder, solicitar encerramento |
   | Professor | Prof. Carlos | Mesmas ações de Solicitante |
   | Equipe de TI | Mariana TI | Assumir, gerir e encerrar ocorrências |

2. Na aba **Ocorrências**, visualize a lista e toque em **+** para abrir uma nova ocorrência.

3. Toque em uma ocorrência para ver detalhes e executar ações conforme o perfil selecionado.

Os dados são armazenados localmente no dispositivo via AsyncStorage. Três ocorrências de exemplo são criadas automaticamente na primeira execução.

---

## Solução de problemas

### `npx` ou `npm` não reconhecido

O Node.js não está no PATH. Reinstale o Node.js marcando **Add to PATH** ou reinicie o terminal após a instalação.

### QR code não conecta / "Unable to connect"

- Confirme que celular e PC estão na **mesma rede Wi-Fi**.
- Desative VPN ou firewall que bloqueie a porta `8081`.
- No terminal do Expo, pressione `s` para alternar entre **LAN** e **Tunnel** (tunnel funciona mesmo em redes diferentes, porém é mais lento).

### Erro ao instalar dependências

Limpe o cache e reinstale:

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

No PowerShell (Windows):

```powershell
Remove-Item -Recurse -Force node_modules
npm cache clean --force
npm install
```

### Porta 8081 já em uso

Encerre o processo que ocupa a porta ou inicie em outra porta:

```bash
npx expo start --port 8082
```

### App não atualiza após mudanças no código

No terminal do Expo, pressione `r` para recarregar. Se persistir, pressione `Shift + r` para limpar o cache do bundler:

```bash
npx expo start --clear
```

---

## Estrutura do projeto

```
app/                  # Telas (Expo Router)
src/
  domain/             # Tipos e regras de transição de status
  services/           # Persistência local (AsyncStorage)
  components/         # UI reutilizável
  context/            # Estado global da aplicação
  theme/              # Cores e tipografia
assets/               # Ícones e splash screen
```

---

## Próximos passos

- Autenticação institucional (OAuth/LDAP)
- API backend com persistência real
- Notificações push para mudanças de status
- Anexos de fotos
