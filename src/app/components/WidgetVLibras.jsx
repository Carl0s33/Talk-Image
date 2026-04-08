import React, { useEffect } from 'react';
import './WidgetVLibras.css'; // Arquivo para os nossos ajustes visuais

export default function WidgetVLibras() {
  useEffect(() => {
    // Injeta o script oficial do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    
    script.onload = () => {
      // Inicializa o widget assim que o script carregar
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    // Estrutura HTML obrigatória exigida pelo VLibras
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}