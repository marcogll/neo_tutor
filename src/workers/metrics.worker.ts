// Web Worker para cálculo de métricas pesadas (NFR <50ms)
self.onmessage = (e: MessageEvent) => {
  // placeholder - moverá cálculos de ritmo/dominio aquí en Fase 4
  self.postMessage({ echo: e.data });
};
