
import React from 'react';
import { Link } from 'react-router';
import { Hand, FileText, Mic, Volume2, ArrowRight, Video, Save } from 'lucide-react';
import './PaginaInicial.css';

const modulos = [
  {
    id: 1, titulo: 'Libras → Texto',
    descricao: 'Câmera detecta sinais e converte em texto escrito',
    IconeA: Hand, IconeB: FileText,
    cor: 'azul', href: '/libras-texto',
    ariaLabel: 'Ir para módulo Libras para Texto',
    iconeAColor: '#007830', // Verde
    iconeBColor: '#2563eb', // Azul
  },
  {
    id: 2, titulo: 'Texto → Libras',
    descricao: 'Digite um texto e veja a tradução em Libras',
    IconeA: FileText, IconeB: Hand,
    cor: 'verde', href: '/texto-libras',
    ariaLabel: 'Ir para módulo Texto para Libras',
    iconeAColor: '#2563eb', // Azul
    iconeBColor: '#007830', // Verde
  },
  {
    id: 3, titulo: 'Voz → Libras',
    descricao: 'Fale e o sistema traduz sua voz para Libras',
    IconeA: Mic, IconeB: Hand,
    cor: 'amarelo', href: '/voz-libras',
    ariaLabel: 'Ir para módulo Voz para Libras',
    iconeAColor: '#f59e42', // Laranja/Amarelo
    iconeBColor: '#007830', // Verde
  },
  {
    id: 4, titulo: 'Libras → Voz',
    descricao: 'Sinalize e o sistema gera áudio sintetizado',
    IconeA: Hand, IconeB: Volume2,
    cor: 'vermelho', href: '/libras-voz',
    ariaLabel: 'Ir para módulo Libras para Voz',
    iconeAColor: '#007830', // Verde
    iconeBColor: '#e52207', // Vermelho
  },
  {
    id: 5, titulo: 'Vídeo → Libras',
    descricao: 'Envie um vídeo e veja a tradução em Libras',
    IconeA: Video, IconeB: Hand,
    cor: 'roxo', href: '/video-libras',
    ariaLabel: 'Ir para módulo Vídeo para Libras',
    iconeAColor: '#7c3aed', // Roxo
    iconeBColor: '#007830', // Verde
  },
  {
    id: 6, titulo: 'Libras → Vídeo',
    descricao: 'Sinalize e gere um vídeo correspondente',
    IconeA: Hand, IconeB: Video,
    cor: 'cinza', href: '/libras-video',
    ariaLabel: 'Ir para módulo Libras para Vídeo',
    iconeAColor: '#007830', // Verde
    iconeBColor: '#7c3aed', // Roxo
  },
  {
    id: 7, titulo: 'Texto → Vídeo',
    descricao: 'Digite um texto e gere um vídeo',
    IconeA: FileText, IconeB: Video,
    cor: 'rosa', href: '/texto-video',
    ariaLabel: 'Ir para módulo Texto para Vídeo',
    iconeAColor: '#2563eb', // Azul
    iconeBColor: '#7c3aed', // Roxo
  },
  {
    id: 8, titulo: 'Vídeo → Texto',
    descricao: 'Envie um vídeo e converta para texto',
    IconeA: Video, IconeB: FileText,
    cor: 'preto', href: '/video-texto',
    ariaLabel: 'Ir para módulo Vídeo para Texto',
    iconeAColor: '#7c3aed', // Roxo
    iconeBColor: '#2563eb', // Azul
  },
  {
    id: 9, titulo: 'Texto → Voz',
    descricao: 'Digite um texto e ouça a voz sintetizada',
    IconeA: FileText, IconeB: Volume2,
    cor: 'laranja', href: '/texto-voz',
    ariaLabel: 'Ir para módulo Texto para Voz',
    iconeAColor: '#2563eb', // Azul
    iconeBColor: '#f59e42', // Laranja
  },
  {
    id: 10, titulo: 'Gravador de Sinais',
    descricao: 'Grave e baixe seus próprios sinais para IA',
    IconeA: FileText, IconeB: Save,
    cor: 'preto', href: '/gravador-sinais',
    ariaLabel: 'Ir para o Gravador de Sinais',
    iconeAColor: '#2563eb',
    iconeBColor: '#00883E',
  },
];

function CardModulo({ modulo }) {
  const { titulo, descricao, IconeA, IconeB, cor, href, ariaLabel, iconeAColor, iconeBColor } = modulo;

  return (
    <li>
      <Link to={href} className={`pi-card pi-card--${cor}`} aria-label={ariaLabel}>
        <div className="pi-card__icones" aria-hidden="true">
          <span className="pi-card__icone">
            <IconeA size={28} color={iconeAColor} />
          </span>
          <ArrowRight size={13} className="pi-card__seta" />
          <span className="pi-card__icone">
            <IconeB size={28} color={iconeBColor} />
          </span>
        </div>
        <span className="pi-card__titulo">{titulo}</span>
        <span className="pi-card__desc">{descricao}</span>
      </Link>
    </li>
  );
}

export default function PaginaInicial() {
  return (
    <div className="pi-wrap">
      {/* Boas-vindas */}
      <section className="pi-boas-vindas" aria-labelledby="titulo-home">
        <div className="pi-boas-vindas__icone" aria-hidden="true">
          <Hand size={38} />
        </div>
        <div className="pi-boas-vindas__texto">
          <h2 className="pi-boas-vindas__titulo" id="titulo-home">
            Bem-vindo ao Talk IMAGE
          </h2>
          <p className="pi-boas-vindas__desc">
            Sistema de acessibilidade e tradução simultânea de Libras do IFRN.
            Escolha um módulo abaixo para começar.
          </p>
        </div>
      </section>

      {/* Grade de Módulos */}
      <section className="pi-modulos" aria-labelledby="titulo-modulos">
        <h2 className="pi-modulos__titulo" id="titulo-modulos">
          Módulos Disponíveis
        </h2>
        <ul className="pi-grade" role="list" aria-label="Módulos de tradução">
          {modulos.map(m => <CardModulo key={m.id} modulo={m} />)}
        </ul>
      </section>
    </div>
  );
}