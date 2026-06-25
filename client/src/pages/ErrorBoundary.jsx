import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught a runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fadeInUp">
          <div className="bg-base-200 p-8 md:p-12 rounded-3xl border border-base-300 max-w-md w-full shadow-2xl flex flex-col items-center gap-6">
            
            <div className="bg-error/10 text-error p-4 rounded-full border border-error/20">
              <AlertCircle className="h-12 w-12" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-extrabold tracking-tight">Something Went Wrong</h2>
              <p className="text-xs text-base-content/60 leading-relaxed">
                An unexpected frontend rendering error was caught.
              </p>
              {this.state.error && (
                <pre className="bg-base-300 p-3 rounded-lg text-left text-[10px] text-error font-mono overflow-auto max-h-36 max-w-full">
                  {this.state.error.toString()}
                </pre>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary rounded-xl font-bold flex items-center justify-center gap-2 w-full mt-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reload Application</span>
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
