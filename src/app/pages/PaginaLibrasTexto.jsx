import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Type, Loader } from 'lucide-react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as tf from '@tensorflow/tfjs';
import './PaginaLibrasTexto.css';

export default function PaginaLibrasTexto() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const loopRef = useRef(null);
  const framesBuffer = useRef([]); // Armazena a sequência para a IA
  const expectedFeaturesRef = useRef(63);

  const [estado, setEstado] = useState('idle');
  const [textoTraduzido, setTextoTraduzido] = useState('');
  const [isModeloPronto, setIsModeloPronto] = useState(false);
  const [modeloIA, setModeloIA] = useState(null);

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        const baseUrlRaw = import.meta?.env?.BASE_URL ?? '/';
        const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw : `${baseUrlRaw}/`;
        const modelUrlBase = `${baseUrl}model/model.json`;
        const modelUrl = import.meta?.env?.DEV
          ? `${modelUrlBase}?cb=${Date.now()}`
          : modelUrlBase;
        const [landmarker, model] = await Promise.all([
          HandLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task", delegate: "GPU" },
            runningMode: "VIDEO", numHands: 2
          }),
          tf.loadLayersModel(modelUrl)
        ]);

        handLandmarkerRef.current = landmarker;
        setModeloIA(model);
        expectedFeaturesRef.current = model?.inputs?.[0]?.shape?.[2] ?? 63;
        setIsModeloPronto(true);
        console.log("Motor IFRN pronto!");
      } catch (err) {
        console.error("Erro no carregamento:", err);
      }
    };
    carregarTudo();
  }, []);

  const predizerSinal = async (results) => {
    if (!modeloIA || !results?.landmarks) return;

    const flatten = (lm) => lm.flatMap((p) => [p.x, p.y, p.z]);
    const zeros = (n) => Array.from({ length: n }, () => 0);

    const hands = results.landmarks;
    const expectedFeatures = expectedFeaturesRef.current;

    let frame = null;
    if (expectedFeatures === 63) {
      if (!hands[0]) return;
      frame = flatten(hands[0]);
    } else if (expectedFeatures === 126) {
      let left = null;
      let right = null;
      const handedness = results.handedness ?? [];

      for (let i = 0; i < hands.length; i++) {
        const label = handedness?.[i]?.[0]?.categoryName ?? handedness?.[i]?.[0]?.displayName;
        if (label === 'Left') left = hands[i];
        else if (label === 'Right') right = hands[i];
        else if (!left) left = hands[i];
        else if (!right) right = hands[i];
      }

      const leftVec = left ? flatten(left) : zeros(63);
      const rightVec = right ? flatten(right) : zeros(63);
      frame = [...leftVec, ...rightVec];
    } else {
      if (!hands[0]) return;
      frame = flatten(hands[0]);
    }

    framesBuffer.current.push(frame);

    // Quando atinge 30 frames, faz a predição
    if (framesBuffer.current.length === 30) {
      const input = tf.tensor3d([framesBuffer.current]);
      const predicao = modeloIA.predict(input);
      const scores = await predicao.data();
      
      const classes = ['Bom dia', 'Oi', 'Obrigado', 'Outros'];
      const maxIdx = scores.indexOf(Math.max(...scores));

      const confianca = scores[maxIdx];
      const classe = classes[maxIdx] ?? 'Outros';

      // Se a confiança for maior que 85%, atualiza a interface
      if (confianca > 0.85 && classe !== 'Outros') setTextoTraduzido(classe);
      else setTextoTraduzido('');

      framesBuffer.current.shift(); // Remove o frame mais antigo (janela deslizante)
      input.dispose();
      predicao.dispose();
    }
  };

  const rodarDeteccao = () => {
    if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.readyState >= 2) {
      const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.landmarks && results.landmarks[0]) {
        // Desenha os pontos
        for (const hand of results.landmarks) {
          for (const pt of hand) {
            ctx.beginPath();
            ctx.arc(pt.x * canvasRef.current.width, pt.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#2F9E41';
            ctx.fill();
          }
        }
        // Envia para a IA analisar o movimento
        predizerSinal(results);
      } else {
        framesBuffer.current = []; // Limpa o buffer se tirar a mão
      }
    }
    loopRef.current = requestAnimationFrame(rodarDeteccao);
  };

  const iniciarCamera = async () => {
    setEstado('carregando');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        setEstado('ativo');
        rodarDeteccao();
      };
    } catch (err) {
      setEstado('idle');
    }
  };

  return (
    <div className="ptl-wrap">
      <section className="ptl-secao">
        <div className="ptl-secao__cabecalho">
          <Camera size={20} />
          <h2 className="ptl-secao__titulo">Captura de Sinais</h2>
        </div>
        <div className="ptl-camera-area">
          <video ref={videoRef} className="ptl-video" autoPlay playsInline muted style={{ display: estado === 'ativo' ? 'block' : 'none', transform: 'scaleX(-1)' }} />
          <canvas ref={canvasRef} className="ptl-canvas" style={{ display: estado === 'ativo' ? 'block' : 'none', transform: 'scaleX(-1)' }} />
          {estado === 'idle' && <div className="ptl-camera-placeholder"><CameraOff size={48} /><p>Câmera desligada</p></div>}
        </div>
        <div className="ptl-acoes">
          <button className="ptl-btn ptl-btn--primario" onClick={iniciarCamera} disabled={!isModeloPronto}>
            {isModeloPronto ? 'Ligar Câmera' : 'Carregando IA...'}
          </button>
        </div>
      </section>

      <section className="ptl-secao">
        <div className="ptl-secao__cabecalho">
          <Type size={20} />
          <h2 className="ptl-secao__titulo">Tradução</h2>
        </div>
        <div className="ptl-caixa-traducao-wrap">
          <div className="ptl-caixa-traducao">{textoTraduzido || "Aguardando sinal..."}</div>
        </div>
      </section>
    </div>
  );
}