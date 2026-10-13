import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Đã xảy ra sự cố hiển thị</h1>
          <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
            {this.state.error?.message || 'Không thể tải giao diện học tập.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 active:scale-95"
            >
              Tải lại ứng dụng
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-300 active:scale-95"
            >
              Khôi phục gốc
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
