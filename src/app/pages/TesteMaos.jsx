import React, { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

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

export default function TesteMaos() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const loopRef = useRef(null);
  const ultimoTempoVideo = useRef(-1);

  const [mensagem, setMensagem] = useState('Carregando MediaPipe...');
  const [dedosNaTela, setDedosNaTela] = useState(0);

  useEffect(() => {
    const inicializarMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        handLandmarkerRef.current = landmarker;
        setMensagem('Modelo carregado! Ligue a câmera.');
      } catch (error) {
        setMensagem('Erro ao carregar o modelo matemático.');
      }
    };

    inicializarMediaPipe();

    return () => {
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []);

  const rodarDeteccao = () => {
    if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState >= 2 && video.currentTime !== ultimoTempoVideo.current) {
      ultimoTempoVideo.current = video.currentTime;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const resultados = handLandmarkerRef.current.detectForVideo(video, performance.now());

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (resultados.landmarks && resultados.landmarks.length > 0) {
        const mao = resultados.landmarks[0];

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

  const ligarCamera = async () => {
    try {
      if (!window.isSecureContext) {
        setMensagem('Acesso restrito a HTTPS ou localhost.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });

      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => {
        setMensagem('Analisando...');
        rodarDeteccao();
      };
    } catch (err) {
      setMensagem('Erro ao acessar a webcam. Verifique as permissões.');
    }
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#1351B4' }}>Módulo de Validação - MediaPipe</h1>

        <div style={{ position: 'relative', width: '640px', height: '480px', backgroundColor: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
          <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ position: 'absolute', width: '100%', height: '100%', transform: 'scaleX(-1)', objectFit: 'cover' }}
          />
          <canvas
              ref={canvasRef}
              style={{ position: 'absolute', width: '100%', height: '100%', transform: 'scaleX(-1)', zIndex: 10 }}
          />
        </div>

        <h2 style={{ fontSize: '24px', color: '#333', marginTop: '1.5rem' }}>{mensagem}</h2>

        <button
            onClick={ligarCamera}
            style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', backgroundColor: '#00883E', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          Ligar Câmera
        </button>
      </div>
  );
}