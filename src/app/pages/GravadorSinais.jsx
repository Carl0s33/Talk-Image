import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, Trash2, Loader, Play, Video } from 'lucide-react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import './PaginaLibrasTexto.css'; 

export default function GravadorSinais() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const framesRef = useRef([]);
  const gravacaoInicioRef = useRef(0);
  const lastUiUpdateRef = useRef(0);
  const autoCameraTriedRef = useRef(false);

  const gravandoRef = useRef(false);
  const modoSequenciaRef = useRef(false);
  const sequenciaAtivaRef = useRef(false);

  const [nomeSinal, setNomeSinal] = useState('');
  const [gravando, setGravando] = useState(false);
  const [framesCount, setFramesCount] = useState(0);
  const [isModeloPronto, setIsModeloPronto] = useState(false);
  const [cameraLigada, setCameraLigada] = useState(false);
  const [erroCamera, setErroCamera] = useState('');
  const [handsDetectadas, setHandsDetectadas] = useState(0);

  const [modoSequencia, setModoSequencia] = useState(false);
  const [sequenciaAtiva, setSequenciaAtiva] = useState(false);
  const [totalClipes, setTotalClipes] = useState(50);
  const [clipeAtual, setClipeAtual] = useState(0);
  const [contagem, setContagem] = useState(0);
  const [framesPorClipe, setFramesPorClipe] = useState(30);
  const [pausaMs, setPausaMs] = useState(10000);
  const [sugestaoAtual, setSugestaoAtual] = useState('');

  const seqRunIdRef = useRef(null);
  const seqTimerRef = useRef(null);
  const stopAfterFramesRef = useRef(30);
  const isDownloadingRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setIsModeloPronto(true);
      } catch (e) {
        setIsModeloPronto(false);
      }
    };
    init();

    // No dev, tenta solicitar permissão automaticamente ao entrar na página.
    // Obs.: alguns navegadores só permitem isso com gesto do usuário.
    // Se falhar, o botão "Ligar Câmera" continua sendo o fallback.
    // (Rodamos esse efeito de forma idempotente.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      try {
        streamRef.current?.getTracks?.()?.forEach((t) => t.stop());
      } catch (_) {
      }
      streamRef.current = null;
      try {
        handLandmarkerRef.current?.close?.();
      } catch (_) {
      }
      handLandmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!import.meta?.env?.DEV) return;
    if (!isModeloPronto) return;
    if (cameraLigada) return;
    if (autoCameraTriedRef.current) return;
    autoCameraTriedRef.current = true;
    ligarCamera({ auto: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModeloPronto, cameraLigada]);

  useEffect(() => {
    gravandoRef.current = gravando;
  }, [gravando]);

  useEffect(() => {
    modoSequenciaRef.current = modoSequencia;
  }, [modoSequencia]);

  useEffect(() => {
    sequenciaAtivaRef.current = sequenciaAtiva;
  }, [sequenciaAtiva]);

  const sugestoes = [
    'Frente (0°)',
    'Leve à direita (+15°)',
    'Leve à esquerda (-15°)',
    'Mais perto da câmera',
    'Mais longe da câmera',
    'Mais alto (mãos acima)',
    'Mais baixo (mãos abaixo)'
  ];

  const zeroHand = () => Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));

  const normalizeHand = (hand) => {
    const pts = (hand ?? []).map((p) => ({ x: p.x, y: p.y, z: p.z }));
    if (pts.length === 21) return pts;
    const padded = pts.concat(Array.from({ length: Math.max(0, 21 - pts.length) }, () => ({ x: 0, y: 0, z: 0 })));
    return padded.slice(0, 21);
  };

  const flattenHand = (hand) => {
    const out = [];
    for (const p of hand) out.push(p.x, p.y, p.z);
    return out;
  };

  const toLeftRight = (results) => {
    const hands = results?.landmarks ?? [];
    const handedness = results?.handedness ?? [];

    let left = null;
    let right = null;

    for (let i = 0; i < hands.length; i++) {
      const label = handedness?.[i]?.[0]?.categoryName ?? handedness?.[i]?.[0]?.displayName;
      if (label === 'Left') left = hands[i];
      else if (label === 'Right') right = hands[i];
    }

    if (!left || !right) {
      if (hands.length === 2) {
        const x0 = hands[0]?.[0]?.x ?? 0;
        const x1 = hands[1]?.[0]?.x ?? 0;
        const hLeft = x0 <= x1 ? hands[0] : hands[1];
        const hRight = x0 <= x1 ? hands[1] : hands[0];
        left ??= hLeft;
        right ??= hRight;
      } else if (hands.length === 1) {
        const wristX = hands[0]?.[0]?.x ?? 0.5;
        if (wristX <= 0.5) left ??= hands[0];
        else right ??= hands[0];
      }
    }

    const leftNorm = left ? normalizeHand(left) : zeroHand();
    const rightNorm = right ? normalizeHand(right) : zeroHand();

    return {
      lr: [leftNorm, rightNorm],
      features126: [...flattenHand(leftNorm), ...flattenHand(rightNorm)],
    };
  };

  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ];

  const desenharOverlay = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vw = video.videoWidth || 0;
    const vh = video.videoHeight || 0;
    if (vw <= 0 || vh <= 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (canvas.width !== vw) canvas.width = vw;
    if (canvas.height !== vh) canvas.height = vh;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Moldura guia (informativo)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    const padX = canvas.width * 0.12;
    const padY = canvas.height * 0.12;
    ctx.strokeRect(padX, padY, canvas.width - padX * 2, canvas.height - padY * 2);
    ctx.restore();

    const hands = results?.landmarks ?? [];
    setHandsDetectadas((prev) => (prev === hands.length ? prev : hands.length));
    if (!hands.length) return;

    for (let h = 0; h < hands.length; h++) {
      const hand = hands[h] ?? [];

      ctx.save();
      ctx.globalAlpha = h === 0 ? 0.95 : 0.7;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2F9E41';
      ctx.fillStyle = '#2F9E41';

      // Linhas ("esqueleto")
      for (const [a, b] of HAND_CONNECTIONS) {
        const p1 = hand[a];
        const p2 = hand[b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.stroke();
      }

      // Pontos
      for (const pt of hand) {
        if (!pt) continue;
        ctx.beginPath();
        ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  };

  const registrarFrame = (results, now) => {
    const handsRaw = (results?.landmarks ?? []).map((hand) => normalizeHand(hand));
    const { lr, features126 } = toLeftRight(results);

    framesRef.current.push({
      t: Math.round(now - gravacaoInicioRef.current),
      hands: handsRaw,
      lr,
      features126,
    });

    if (modoSequenciaRef.current && sequenciaAtivaRef.current) {
      const alvo = stopAfterFramesRef.current;
      if (framesRef.current.length >= alvo) {
        setGravando(false);
      }
    }

    if (now - lastUiUpdateRef.current > 200) {
      lastUiUpdateRef.current = now;
      setFramesCount(framesRef.current.length);
    }
  };

  const tickPreview = () => {
    if (!handLandmarkerRef.current || !videoRef.current) return;
    if (!streamRef.current) return;

    const video = videoRef.current;
    if (video.readyState >= 2) {
      const now = performance.now();
      const results = handLandmarkerRef.current.detectForVideo(video, now);
      desenharOverlay(results);
      if (gravandoRef.current) registrarFrame(results, now);
    }

    rafRef.current = requestAnimationFrame(tickPreview);
  };

  const toggleGravacao = () => {
    if (!nomeSinal.trim()) {
      alert("Dê um nome ao sinal antes de gravar (ex: bom_dia)");
      return;
    }
    if (!cameraLigada) {
      alert("Ligue a câmera antes de gravar.");
      return;
    }
    if (modoSequencia) {
      alert('Desative o Modo Sequência para gravar manualmente.');
      return;
    }

    if (!gravando) {
      framesRef.current = [];
      gravacaoInicioRef.current = performance.now();
      lastUiUpdateRef.current = 0;
      setFramesCount(0);
      setGravando(true);
    } else {
      setGravando(false);
    }
  };

  useEffect(() => {
    if (!cameraLigada) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      const ctx = canvasRef.current?.getContext?.('2d');
      if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHandsDetectadas(0);
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tickPreview);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraLigada]);

  const baixarDados = (opts = {}) => {
    const sinal = nomeSinal.trim();
    const frames = framesRef.current;
    if (!frames.length) return;

    const payload = {
      sinal,
      createdAt: new Date().toISOString(),
      meta: {
        schemaVersion: 2,
        mirrored: true,
        hands: 2,
        pointsPerHand: 21,
        windowSugestao: 30,
        sequenceRunId: opts.sequenceRunId ?? null,
        sequenceClipIndex: opts.sequenceClipIndex ?? null,
        sequenceTotal: opts.sequenceTotal ?? null,
        suggestedAngle: opts.suggestedAngle ?? null,
      },
      timestampsMs: frames.map((f) => f.t),
      sequencia: frames.map((f) => f.hands),
      sequencia_lr: frames.map((f) => f.lr),
      sequencia_126: frames.map((f) => f.features126),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const suffix = opts.fileSuffix ? `_${opts.fileSuffix}` : '';
    downloadAnchorNode.setAttribute("download", `${sinal}${suffix}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    framesRef.current = [];
    setFramesCount(0);
  };

  const limparTimersSequencia = () => {
    if (seqTimerRef.current) clearTimeout(seqTimerRef.current);
    seqTimerRef.current = null;
    setContagem(0);
  };

  const pararSequencia = () => {
    limparTimersSequencia();
    setSequenciaAtiva(false);
    setGravando(false);
  };

  const iniciarClipeComContagem = (clipIndex) => {
    const id = seqRunIdRef.current;
    if (!id) return;

    const sugestao = sugestoes[clipIndex % sugestoes.length];
    setSugestaoAtual(sugestao);

    const iniciar = () => {
      stopAfterFramesRef.current = Number(framesPorClipe) || 30;
      framesRef.current = [];
      gravacaoInicioRef.current = performance.now();
      lastUiUpdateRef.current = 0;
      setFramesCount(0);
      setGravando(true);
    };

    setContagem(3);
    seqTimerRef.current = setTimeout(() => setContagem(2), 1000);
    seqTimerRef.current = setTimeout(() => setContagem(1), 2000);
    seqTimerRef.current = setTimeout(() => {
      setContagem(0);
      iniciar();
    }, 3000);
  };

  useEffect(() => {
    if (!modoSequencia) {
      if (sequenciaAtiva) pararSequencia();
      return;
    }
  }, [modoSequencia]);

  useEffect(() => {
    if (!modoSequencia || !sequenciaAtiva) return;

    if (!gravando && contagem === 0) {
      const frames = framesRef.current;
      if (!frames.length) return;
      if (isDownloadingRef.current) return;

      isDownloadingRef.current = true;
      try {
        const idx = clipeAtual;
        const sugestao = sugestoes[idx % sugestoes.length];
        const runId = seqRunIdRef.current;
        baixarDados({
          sequenceRunId: runId,
          sequenceClipIndex: idx + 1,
          sequenceTotal: totalClipes,
          suggestedAngle: sugestao,
          fileSuffix: `clip_${String(idx + 1).padStart(3, '0')}`,
        });
      } finally {
        isDownloadingRef.current = false;
      }

      const proximo = clipeAtual + 1;
      if (proximo >= totalClipes) {
        pararSequencia();
        return;
      }

      setClipeAtual(proximo);
      limparTimersSequencia();
      seqTimerRef.current = setTimeout(() => iniciarClipeComContagem(proximo), pausaMs);
    }
  }, [gravando, contagem, modoSequencia, sequenciaAtiva, clipeAtual, totalClipes, pausaMs]);

  const iniciarSequencia = () => {
    const sinal = nomeSinal.trim();
    if (!sinal) {
      alert('Dê um nome ao sinal antes de iniciar (ex: bom_dia)');
      return;
    }
    if (!cameraLigada) {
      alert('Ligue a câmera antes de iniciar.');
      return;
    }
    if (!isModeloPronto) {
      alert('Carregando MediaPipe...');
      return;
    }

    limparTimersSequencia();
    seqRunIdRef.current = `run_${Date.now()}`;
    stopAfterFramesRef.current = Number(framesPorClipe) || 30;
    setClipeAtual(0);
    setSequenciaAtiva(true);
    iniciarClipeComContagem(0);
  };

  const ligarCamera = async (opts = {}) => {
    setErroCamera('');
    try {
      if (!window.isSecureContext) {
        setErroCamera('A câmera só funciona em contexto seguro (HTTPS) ou localhost. No celular/na rede, use HTTPS no dev server.');
        setCameraLigada(false);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setErroCamera('Seu navegador não suporta acesso à câmera (getUserMedia).');
        setCameraLigada(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 480 },
          height: { ideal: 640 },
          facingMode: "user"
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play?.();
      }
      setCameraLigada(true);
    } catch (err) {
      const msgAuto = opts?.auto ? ' Clique em “Ligar Câmera” para permitir.' : '';
      setErroCamera(`Erro ao abrir a câmera.${msgAuto}`);
      setCameraLigada(false);
    }
  };

  const desligarCamera = () => {
    try {
      streamRef.current?.getTracks?.()?.forEach((t) => t.stop());
    } catch (_) {
    }
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraLigada(false);
    setGravando(false);
  };

  return (
    <div className="ptl-wrap">
      <section className="ptl-secao">
        <div className="ptl-secao__cabecalho">
          <Video size={20} color="white" />
          <h2 className="ptl-secao__titulo">Coletor de Movimentos IFRN</h2>
        </div>

        <div className="ptl-camera-area" style={{ maxWidth: '380px', aspectRatio: '3/4', margin: '20px auto' }}>
          <video ref={videoRef} autoPlay playsInline className="ptl-video" style={{transform: 'scaleX(-1)'}} />
          <canvas ref={canvasRef} className="ptl-canvas" style={{ transform: 'scaleX(-1)' }} />
          {gravando && (
            <div className="ptl-gravando-badge" style={{ backgroundColor: 'var(--ifrn-vermelho)', padding: '5px 10px', borderRadius: '5px', color: 'white', position: 'absolute', top: '10px', right: '10px', fontWeight: 'bold', zIndex: 20 }}>
              REC: {framesCount}
            </div>
          )}
          {cameraLigada && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 20,
                background: 'rgba(0,0,0,0.45)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              Mãos: {handsDetectadas}
            </div>
          )}
        </div>

        <div className="ptl-acoes" style={{flexDirection: 'column', gap: '15px', padding: '20px'}}>
          <input 
            type="text" 
            placeholder="Qual sinal? (ex: bom_dia, me_ajude, outros)" 
            className="ptl-input"
            value={nomeSinal}
            onChange={e => setNomeSinal(e.target.value)}
            style={{padding: '12px', borderRadius: '8px', border: '2px solid var(--ifrn-verde)', width: '100%', outline: 'none'}}
            list="sugestoes-sinal"
          />
          <datalist id="sugestoes-sinal">
            <option value="bom_dia" />
            <option value="oi" />
            <option value="obrigado" />
            <option value="outros" />
          </datalist>
          <div style={{fontSize: '13px', color: '#888', marginTop: '-10px', marginBottom: '8px'}}>
            Para exemplos negativos (sem gesto), use <b>outros</b>.<br />
            Isso ajuda a IA a não confundir movimentos aleatórios com sinais reais.
          </div>

          <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#888' }}>
            <input
              type="checkbox"
              checked={modoSequencia}
              onChange={(e) => setModoSequencia(e.target.checked)}
              disabled={gravando}
            />
            Modo Sequência (auto gravar + baixar)
          </label>

          {modoSequencia && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              <input
                type="number"
                min={1}
                className="ptl-input"
                value={totalClipes}
                onChange={(e) => setTotalClipes(Math.max(1, Number(e.target.value) || 1))}
                style={{ padding: '12px', borderRadius: '8px', border: '2px solid var(--ifrn-verde)', width: '100%', outline: 'none' }}
                placeholder="Qtd clipes (ex: 50)"
              />
              <input
                type="number"
                min={10}
                className="ptl-input"
                value={framesPorClipe}
                onChange={(e) => setFramesPorClipe(Math.max(10, Number(e.target.value) || 30))}
                style={{ padding: '12px', borderRadius: '8px', border: '2px solid var(--ifrn-verde)', width: '100%', outline: 'none' }}
                placeholder="Frames por clipe (30)"
              />
              <input
                type="number"
                min={0}
                className="ptl-input"
                value={pausaMs}
                onChange={(e) => setPausaMs(Math.max(0, Number(e.target.value) || 0))}
                style={{ padding: '12px', borderRadius: '8px', border: '2px solid var(--ifrn-verde)', width: '100%', outline: 'none' }}
                placeholder="Pausa (ms)"
              />
              <div style={{ fontSize: '13px', color: '#888', alignSelf: 'center' }}>
                {sequenciaAtiva ? (
                  <span>
                    Clipe {clipeAtual + 1}/{totalClipes}{sugestaoAtual ? ` • ${sugestaoAtual}` : ''}{contagem ? ` • começa em ${contagem}` : ''}
                  </span>
                ) : (
                  <span>
                    Sugestão: {sugestoes[0]}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div style={{display: 'flex', gap: '10px', width: '100%'}}>
            <button 
              className={`ptl-btn ${gravando ? 'ptl-btn--fantasma' : 'ptl-btn--primario'}`} 
              onClick={toggleGravacao}
              disabled={!isModeloPronto}
              style={{ flex: 2 }}
            >
              {gravando ? <><Trash2 size={18} /> Parar</> : <><Play size={18} /> Gravar</>}
            </button>

            <button 
              className="ptl-btn ptl-btn--primario" 
              onClick={baixarDados} 
              disabled={framesCount === 0 || gravando}
              style={{ flex: 1, backgroundColor: framesCount > 0 && !gravando ? 'var(--ifrn-verde)' : '#ccc' }}
            >
              <Save size={18} /> Salvar
            </button>
          </div>

          {modoSequencia && (
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                className="ptl-btn ptl-btn--primario"
                onClick={sequenciaAtiva ? pararSequencia : iniciarSequencia}
                disabled={!isModeloPronto || !cameraLigada}
                style={{ flex: 1 }}
              >
                {sequenciaAtiva ? 'Parar Sequência' : 'Iniciar Sequência'}
              </button>
            </div>
          )}

          {!!erroCamera && (
            <div style={{ fontSize: '13px', color: 'var(--ifrn-vermelho)' }}>
              {erroCamera}
            </div>
          )}

          <button
            className="ptl-btn"
            onClick={cameraLigada ? desligarCamera : ligarCamera}
            style={{ border: '1px solid var(--ifrn-cinza-borda)' }}
          >
            <Camera size={18} /> {cameraLigada ? 'Desligar Câmera' : 'Ligar Câmera'}
          </button>
        </div>
      </section>
    </div>
  );
}