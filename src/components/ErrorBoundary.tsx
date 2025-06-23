
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary detailed error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to any external service if needed
    console.log('Error boundary triggered:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  private handleRefresh = () => {
    // Clear error state and reload
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleGoHome = () => {
    // Clear error state and navigate to home
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                שגיאה במערכת LeviPro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                אירעה שגיאה בלתי צפויה במערכת LeviPro.
              </p>
              {this.state.error && (
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
                  <strong>שגיאה טכנית:</strong><br/>
                  {this.state.error.message}
                  {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                    <>
                      <br/><br/>
                      <strong>Stack trace:</strong><br/>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRefresh}
                  className="flex-1 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  רענן דף
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Home className="h-4 w-4" />
                  עמוד הבית
                </Button>
              </div>
              <div className="text-xs text-center text-gray-500">
                שגיאה זו נרשמה במערכת הלוגים
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
