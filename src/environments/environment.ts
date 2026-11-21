const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const environment = {
  production: !isLocalhost,
  apiUrl: isLocalhost ? 'http://localhost:8083' : 'https://www.comandosamoris.tech/svc/auth',
  apiCalculadoraUrl: isLocalhost ? 'http://localhost:8081' : 'https://www.comandosamoris.tech/svc/calc',
  apiMateriaisUrl: isLocalhost ? 'http://localhost:8082' : 'https://www.comandosamoris.tech/svc/materiais',
  mercadoPagoPublicKey: 'APP_USR-08772766-1d3a-4e72-8d52-30f223b799f7'
};
