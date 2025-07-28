import React from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * Error Boundary component to catch and handle JavaScript errors in React components
 * @component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Update state to show error UI when an error occurs
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log error details and update state with error information
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  /**
   * Reset error state to retry rendering
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorMessage}>
              The application encountered an unexpected error. Please try again.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error Details (Development Mode)</summary>
                <div className={styles.errorStack}>
                  <p><strong>Error:</strong> {this.state.error.toString()}</p>
                  <p><strong>Stack:</strong></p>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
            
            <div className={styles.errorActions}>
              <button onClick={this.handleRetry} className={styles.retryButton}>
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.reloadButton}
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
