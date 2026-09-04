import React, { Component, ErrorInfo, ReactNode } from 'react';
import { CONTENT } from '../content';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const hotline = CONTENT.site.hotline;
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 text-orange-400 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Đã xảy ra sự cố khi tải trang
          </h1>
          <p className="text-zinc-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
            Hệ thống đang được cập nhật hoặc kết nối mạng bị gián đoạn. Vui lòng bấm tải lại trang hoặc liên hệ hotline để được hỗ trợ trực tiếp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={this.handleReload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-semibold transition"
            >
              Tải Lại Trang
            </button>
            <a
              href={`tel:${hotline}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
            >
              Hotline: {hotline}
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
