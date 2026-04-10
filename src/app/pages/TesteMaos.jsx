import React, { useState, useEffect, useRef } from 'react';
// Importação oficial via pacote NPM
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// ==========================================
// 1. A MATEMÁTICA (CONTADOR DE DEDOS)
// ==========================================
function contarDedos(landmarks) {
  let dedosLevantados = 0;
  
  const pontas = [8, 12, 16, 20];
  const juntas = [6, 10, 14, 18];

  for (let i = 0; i < pontas.length; i++) {
    if (landmarks[pontas[i]].y < landmarks[juntas[i]].y) {
      dedosLevantados++;
    }
  }

  const isMaoDireita = landmarks[17].x > landmarks[5].x; 
  if (isMaoDireita) {
    if (landmarks[4].x < landmarks[3].x) dedosLevantados++;
  } else {
    if (landmarks[4].x > landmarks[3].x) dedosLevantados++;
  }

  return dedosLevantados;
}

// ==========================================
// 2. O COMPONENTE REACT
// ==========================================
export default function TesteMaos() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const handLandmarkerRef = useRef(null); 
  const loopRef = useRef(null);
  const ultimoTempoVideo = useRef(-1);

  const [mensagem, setMensagem] = useState('Carregando MediaPipe...');
  const [dedosNaTela, setDedosNaTela] = useState(0);

  // 1. Inicialização correta via pacote NPM
  useEffect(() => {
    const inicializarMediaPipe = async () => {
      try {
        // Baixa apenas os módulos matemáticos (WASM) necessários
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        // Configura o rastreador
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { 
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU" // Utiliza aceleração de hardware
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        handLandmarkerRef.current = landmarker;
        setMensagem('Modelo carregado! Ligue a câmera.');
      } catch (error) {
        console.error("Erro ao inicializar o MediaPipe:", error);
        setMensagem('Erro ao carregar o modelo matemático.');
      }
    };

    inicializarMediaPipe();

    // Limpeza de memória ao desmontar o componente
    return () => {
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
      if (loopRef.current) {
        cancelAnimationFrame(loopRef.current);
      }
    };
  }, []);

  // 2. O Motor de Repetição (Loop)
  const rodarDeteccao = () => {
    if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState >= 2 && video.currentTime !== ultimoTempoVideo.current) {
      ultimoTempoVideo.current = video.currentTime;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const resultados = handLandmarkerRef.current.detectForVideo(video, performance.now());
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      
      if (resultados.landmarks && resultados.landmarks.length > 0) {
        const mao = resultados.landmarks[0];
        
        // Desenha as marcações verdes
        for (let pt of mao) {
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
        }

        const quantidade = contarDedos(mao);
        setDedosNaTela(quantidade);
        setMensagem(`Sinal Numérico: ${quantidade}`);
      } else {
        setMensagem('Nenhuma mão detectada.');
        setDedosNaTela(0);
      }
    }
    
    loopRef.current = requestAnimationFrame(rodarDeteccao);
  };

  // 3. Controle de Hardware (Câmera)
  const ligarCamera = async () => {
    try {
      if (!window.isSecureContext) {
        setMensagem('A câmera só funciona em HTTPS (ou localhost). No dev via IP, use HTTPS.');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setMensagem('Seu navegador não suporta acesso à câmera (getUserMedia).');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => {
        setMensagem('Analisando...');
        rodarDeteccao(); 
      };
    } catch (err) {
      console.error(err);
      const name = err?.name;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMensagem('Permissão da câmera negada. Verifique as permissões do site.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setMensagem('Nenhuma câmera encontrada neste dispositivo.');
      } else {
        setMensagem('Não foi possível abrir a câmera.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#1351B4' }}>Módulo de Validação - MediaPipe</h1>
      
      <div style={{ position: 'relative', width: '640px', height: '480px', backgroundColor: '#1A1A1A', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ position: 'absolute', width: '100%', height: '100%', transform: 'scaleX(-1)' }}
        />
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', width: '100%', height: '100%', transform: 'scaleX(-1)', zIndex: 10 }}
        />
      </div>

      <h2 style={{ fontSize: '24px', color: '#333', marginTop: '1.5rem' }}>{mensagem}</h2>
      
      <button 
        onClick={ligarCamera} 
        style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', backgroundColor: '#00883E', color: 'white', border: 'none', borderRadius: '8px', transition: 'background 0.2s' }}
      >
        Ligar Câmera e Iniciar Rastreamento
      </button>
    </div>
  );
}