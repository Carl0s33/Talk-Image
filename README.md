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

O sistema foi projetado para funcionar **diretamente no navegador (client-side)**, reduzindo latência e preservando privacidade.

---

## ✨ Funcionalidades
- Captura de vídeo em tempo real (câmera do dispositivo).
- Extração de **landmarks** da mão com **MediaPipe**.
- Buffer temporal com **janela deslizante** para manter o contexto do movimento.
- Inferência no browser com **TensorFlow.js**.
- Classificação em 4 categorias: **`Bom dia`**, **`Oi`**, **`Obrigado`** e **`Outros`**.

---

## 🧰 Tecnologias
<div>
  <img alt="React" src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img alt="TensorFlow.js" src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
  <img alt="MediaPipe" src="https://img.shields.io/badge/MediaPipe-007FBA?style=for-the-badge&logo=google&logoColor=white"/>
  <img alt="Python" src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"/>
  <img alt="Keras" src="https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white"/>
</div>

---

## 🧠 Arquitetura e Funcionamento Técnico
O motor de tradução do Talk-IMAGE opera através de um pipeline de processamento temporal dividido em três camadas lógicas:

### 1) Extração de Landmarks (Visão Computacional)
Utilizamos o **MediaPipe Hand Landmarker** para o rastreamento dinâmico de **21 pontos-chave** da mão. Embora o MediaPipe possa detectar até duas mãos, o modelo atual foi treinado para processar **uma mão por vez** (no código, é considerada a primeira mão detectada, `landmarks[0]`).

Cada frame produz coordenadas tridimensionais **(x, y, z)**, totalizando **63 features** (21 × 3).

### 2) Normalização (Invariância de Escala)
As coordenadas fornecidas pelo MediaPipe já vêm **normalizadas entre 0.0 e 1.0** em relação ao espaço de visualização da câmera (largura/altura da imagem). Isso reduz a influência da distância do usuário à câmera e elimina a necessidade de um pré-processamento pesado de re-scaling no cliente.

### 3) Janela Deslizante + Inferência Temporal (LSTM)
O sistema implementa uma técnica de **Sliding Window**, onde os últimos **30 frames** são armazenados em um buffer (sequência temporal). Essa sequência é necessária para que a rede neural compreenda o início, meio e fim de cada sinal.

O modelo utiliza uma arquitetura **LSTM (Long Short-Term Memory)**, capaz de aprender dependências em séries temporais. O tensor de entrada **[1, 30, 63]** é processado e retorna probabilidades (Softmax) para as classes:
- `Bom dia`
- `Oi`
- `Obrigado`
- `Outros` (classe de ruído, essencial para evitar traduções indevidas)

---

## 🔁 Pipeline de Desenvolvimento
1. Coleta de dados primários em formato `.json`.
2. Treinamento do modelo em **Python/Keras** (Google Colab).
3. Conversão do modelo Keras para **TensorFlow.js**.
4. Integração no **React** com lógica de buffer para predição contínua.

---

## 🎨 Interface e UX
O design foi focado na experiência mobile, permitindo o uso rápido e intuitivo em qualquer smartphone com câmera frontal.  
- **Protótipo Figma:** https://www.figma.com/design/I185kSzR6UlheQFbly0HVq/Talk-IMAGE-Mobile-Interface

---

## 🛠️ Como Executar

### 1) Instalação
```bash
npm install
```

### 2) Modelo
Garanta que os arquivos do modelo estejam em:
- `public/model/model.json`
- `public/model/group1-shard1of1.bin`

### 3) Execução
```bash
npm run dev
```

---

## 📂 Estrutura do Repositório (sugestão)
```text
├── public/
│   └── model/                # Artefatos do modelo (TensorFlow.js)
├── src/
│   ├── components/           # Componentes React (Câmera, UI, etc.)
│   ├── styles/               # Estilos
│   └── App.jsx               # Ponto de entrada
└── README.md
```

---

<div align="center">
  <p>Desenvolvido por <strong>Carlos Eduardo</strong> • ADS/IFRN</p>
  <a href="https://github.com/Carl0s33">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-121011?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</div>
