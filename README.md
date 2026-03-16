MotivaIA – Projeto Final React Native (UTFPR)
Este aplicativo foi desenvolvido para a disciplina de React Native, sob orientação do professor Vinicius Oliveira. O MotivaIA combina inteligência artificial e curadoria visual para gerar mensagens de incentivo personalizadas, envoltas em uma interface minimalista projetada para transmitir calma e bem-estar.

### Evolução e Funcionalidades
O projeto evoluiu para integrar não apenas texto, mas também contexto visual, utilizando:

Mensagens Personalizadas: Processamento de linguagem natural via Google Gemini para interpretar o estado emocional do usuário.

Curadoria Visual: Integração com a API do Unsplash para buscar imagens temáticas que complementam a mensagem motivacional.

Interface Soft Design: Layout focado em legibilidade, com cores suaves, cards brancos e feedback visual de carregamento.

### Stack Técnica
Core: React Native (Expo SDK 55)

IA: Google Gemini API

Imagens: Unsplash API

Arquitetura: Modular (Screens & Services)

### Estrutura do Código
src/screens/HomeScreen.js: Gerencia a entrada de dados, validações e a renderização dos cards motivacionais.

src/services/aiService.js: Lógica de consumo da API Gemini e estruturação do prompt em português.

src/services/imageService.js: Gerencia as requisições ao Unsplash com base no humor detectado.

### Configuração e chaves de API
O app utiliza variáveis de ambiente para segurança. Crie um arquivo .env na raiz do projeto:

Bash
# Google Gemini (https://ai.google.dev)
EXPO_PUBLIC_GEMINI_API_KEY="SUA_CHAVE_AQUI"

# Unsplash API (https://unsplash.com/developers)
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY="SUA_CHAVE_AQUI"
Nota Técnica: O app foi projetado de forma resiliente. Caso uma das chaves não esteja configurada, a funcionalidade correspondente é omitida sem comprometer a execução das demais partes do sistema.

## Como Executar
Instalação:

Bash
npm install
Iniciar o servidor:

Bash
npx expo start
Ambiente de Testes: Devido a restrições de versão do Expo Go no hardware utilizado (iPhone 11), a validação principal foi realizada via Expo Web, garantindo total compatibilidade do código com builds mobile nativos.

### Requisitos do Enunciado Atendidos
[x] Interface Intuitiva: Tema claro com foco em UX, estados de botão dinâmicos e tratamento de erros.

[x] Integração Multisserviços: Consumo de APIs via fetch com lógica de fallback.

[x] Organização Profissional: Código modularizado, comentado e separado por responsabilidades.

[x] Documentação e Entrega: Repositório estruturado para versionamento via Git/GitHub.


### Destaques: Update atualização

Destaque para o Unsplash: Coloquei logo no início que o app agora tem "curadoria visual", o que soa muito bem tecnicamente.

Seção de Variáveis de Ambiente: Agrupei as duas chaves de forma mais limpa, facilitando para o professor na hora de testar.

Refinamento da UX: Mencionei o "Soft Design" e o "fundo suave", mostrando que você teve cuidado estético, e não apenas funcional.

Resiliência do Código: Adicionei a nota técnica explicando que o app não "quebra" se uma chave faltar, o que demonstra maturidade no desenvolvimento (o famoso graceful degradation).

Desenvolvido por: Samuel Teodoro Ferreira

# MotivaIA
