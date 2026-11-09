import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RootErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2', color: '#2D2118', padding: '20px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Maitê Bolos e Doces</h1>
          <p style={{ fontSize: '14px', color: '#7A6455', marginBottom: '16px' }}>Ocorreu um pequeno erro ao carregar a página.</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ padding: '10px 20px', backgroundColor: '#FF7243', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
          >
            Recarregar Loja
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
