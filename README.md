# 🤟 Talk-IMAGE — Tradutor de Libras em Tempo Real (Web)

<div align="center">
  <img src="https://portal.ifrn.edu.br/icones/logo-ifrn/@@images/image.png" width="160" alt="Logo IFRN" />
  <br />
  <strong>Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte</strong>
  <p>Campus Nova Cruz • Curso: Análise e Desenvolvimento de Sistemas (ADS)</p>

  <p>
    <a href="https://github.com/Carl0s33/Talk-Image">Repositório</a>
    •
    <a href="https://www.figma.com/design/I185kSzR6UlheQFbly0HVq/Talk-IMAGE-Mobile-Interface">Protótipo (Figma)</a>
  </p>
</div>

---

## 📝 Visão Geral
O **Talk-IMAGE** é uma solução de acessibilidade que utiliza **Visão Computacional** e **Inteligência Artificial** para traduzir sinais da **Língua Brasileira de Sinais (Libras)** para **texto em tempo real**.

O sistema foi projetado para funcionar **diretamente no navegador (client-side)**, reduzindo latência e preservando privacidade (os frames podem ser processados localmente, sem envio para servidor, dependendo da configuração do projeto).

---

## ✨ Funcionalidades
- Captura de vídeo em tempo real (câmera do dispositivo).
- Extração de **landmarks** das mãos com **MediaPipe**.
- Normalização das coordenadas para reduzir variações de posição/distância.
- Predição contínua por **janela deslizante** (sequência temporal).
- Classificação de sinais (ex.: `Bom dia`, `Oi`, `Obrigado`, `Outros`).

---

## 🧰 Tecnologias
**Front-end**
- React + Vite

**Visão Computacional**
- MediaPipe (Hand Landmarker)

**IA / Modelo**
- Treinamento: Python + Keras (Google Colab)
- Inferência no browser: TensorFlow.js

<div>
  <img alt="React" src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img alt="TensorFlow.js" src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
  <img alt="MediaPipe" src="https://img.shields.io/badge/MediaPipe-007FBA?style=for-the-badge&logo=google&logoColor=white"/>
  <img alt="Python" src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"/>
  <img alt="Keras" src="https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white"/>
</div>

---

## 🧠 Como funciona (Arquitetura)

### 1) Extração de características (MediaPipe)
O **MediaPipe Hand Landmarker** detecta e rastreia **21 pontos** por mão em coordenadas **(X, Y, Z)**.  
Cada frame gera **63 features** (21 × 3).

**Objetivo:** transformar imagem → dados numéricos estruturados para a rede neural.

### 2) Normalização dos dados
Os landmarks são normalizados para reduzir ruídos comuns, como:
- variação de distância da câmera,
- deslocamento da mão no frame,
- pequenas mudanças de escala/posição.

> (Se quiser, posso sugerir no README o tipo exato de normalização que você usa: por ex. centralização no punho + escala por distância entre pontos-chave.)

### 3) Predição temporal (LSTM)
Sinais em Libras são **movimentos**, então o modelo precisa “memória” de frames anteriores.  
Por isso, foi usada uma **LSTM (Long Short-Term Memory)**.

- **Entrada (input):** sequência de **30 frames** (janela deslizante)
- **Dimensão por frame:** 63 features
- **Saída (output):** classes, por exemplo: `Bom dia`, `Oi`, `Obrigado`, `Outros`

### 4) Pipeline de desenvolvimento
1. Coleta de dados primários em `.json`
2. Treinamento no **Google Colab** (Python/Keras)
3. Conversão do modelo para **TensorFlow.js**
4. Integração no **React** para inferência em tempo real

---

## 📦 Como executar localmente

### Pré-requisitos
- Node.js (recomendado: LTS)
- NPM (ou PNPM/Yarn, se você usar)

### 1) Instalação
```bash
npm install
```

### 2) Arquivos do modelo
Garanta que os arquivos do modelo estejam em:

- `public/model/model.json`
- `public/model/group1-shard1of1.bin`

> Se o teu modelo tiver mais shards (ex.: `group1-shard1of3.bin`), atualiza esta lista.

### 3) Rodar o projeto
```bash
npm run dev
```

Abra no navegador a URL que o Vite mostrar (normalmente `http://localhost:5173`).

---

## 📁 Estrutura sugerida do repositório
```text
├── public/
│   └── model/                # Artefatos do modelo (TensorFlow.js)
├── src/
│   ├── components/           # Componentes React (Camera, UI, etc.)
│   ├── styles/               # Estilos
│   ├── services/             # (opcional) lógica de inferência / helpers
│   └── App.jsx               # Ponto de entrada
└── README.md
```

---

## ⚠️ Observações / Limitações (honesto e “cara de TCC”)
- Acurácia depende de iluminação, ângulo da câmera e variações de execução do sinal.
- Classes atuais são limitadas (ex.: poucas palavras). O sistema é extensível com:
  - mais amostras por classe,
  - mais classes,
  - validação cruzada e métricas (accuracy, F1-score),
  - aumento de dados (data augmentation) aplicado aos landmarks.

---

## 📄 Licença
Defina aqui a licença do projeto (ex.: MIT).  
Se ainda não definiu, recomendo adicionar um arquivo `LICENSE`.

---

<div align="center">
  <p>Desenvolvido por <strong>Carlos Eduardo</strong> • ADS/IFRN</p>
  <a href="https://github.com/Carl0s33">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-121011?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</div>
