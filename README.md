# 🤟 Talk-IMAGE - Tradutor de Libras em Tempo Real

<div align="center">
  <img src="https://portal.ifrn.edu.br/icones/logo-ifrn/@@images/image.png" width="160" alt="Logo IFRN" />
  <br />
  <strong>Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte</strong>
  <p>Campus Nova Cruz | Curso: Análise e Desenvolvimento de Sistemas (ADS)</p>
</div>

---

## 📝 Sobre o Projeto
O **Talk-IMAGE** é uma solução de acessibilidade tecnológica que utiliza Visão Computacional e Inteligência Artificial para traduzir sinais da Língua Brasileira de Sinais (Libras) para texto em tempo real. O projeto foi concebido para rodar inteiramente no lado do cliente (browser), garantindo privacidade e baixa latência.

## 🚀 Tecnologias e Stacks

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-%23FF6F00.svg?style=for-the-badge&logo=tensorflow&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-007fba?style=for-the-badge&logo=google&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Keras](https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white)

## 🧠 Arquitetura do Sistema

### 1. Coleta e Processamento (MediaPipe)
Utilizamos o **MediaPipe Hand Landmarker** para extrair 21 pontos de referência tridimensionais (X, Y, Z) de cada mão. Estes dados são normalizados para garantir que a distância do utilizador à câmara não interfira na tradução.

### 2. Rede Neural (LSTM)
A tradução de sinais de movimento exige memória temporal. Por isso, implementámos uma rede **LSTM (Long Short-Term Memory)**:
- **Input:** Sequências de 30 frames (Janela Deslizante).
- **Features:** 63 coordenadas por frame (21 pontos * 3 eixos).
- **Output:** Classificação entre as categorias: `Bom dia`, `Oi`, `Obrigado` e `Outros`.



### 3. Pipeline de Desenvolvimento
1. Coleta de dados primários em formato `.json`.
2. Treinamento do modelo em **Python** no Google Colab.
3. Conversão do modelo Keras para **TensorFlow.js**.
4. Integração no **React** com lógica de buffer para predição contínua.

## 🎨 Interface e UX
O design foi focado na experiência mobile, permitindo o uso rápido e intuitivo em qualquer smartphone com câmara frontal.
- **Protótipo Figma:** [Aceder ao Design](https://www.figma.com/design/I185kSzR6UlheQFbly0HVq/Talk-IMAGE-Mobile-Interface)

## 🛠️ Como Executar

1. **Instalação:**
   ```bash
   npm install
