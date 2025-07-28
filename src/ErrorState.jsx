import styles from './ErrorState.module.css';

/**
 * ErrorState component for displaying various error conditions
 * @component
 * @param {Object} props - Component props
 * @param {string} props.type - Type of error (network, notFound, generic)
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry callback function
 * @param {Function} props.onGoBack - Go back callback function
 * @returns {JSX.Element} Error state component
 */
function ErrorState({ 
  type = 'generic', 
  title, 
  message, 
  onRetry, 
  onGoBack 
}) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: '🌐',
          defaultTitle: 'Network Error',
          defaultMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
          showRetry: true
        };
      case 'notFound':
        return {
          icon: '🔍',
          defaultTitle: 'No Results Found',
          defaultMessage: 'We couldn\'t find any apps matching your search. Try different keywords.',
          showRetry: false
        };
      case 'timeout':
        return {
          icon: '⏱️',
          defaultTitle: 'Request Timeout',
          defaultMessage: 'The request took too long to complete. Please try again.',
          showRetry: true
        };
      case 'server':
        return {
          icon: '🔧',
          defaultTitle: 'Server Error',
          defaultMessage: 'The server encountered an error. Please try again later.',
          showRetry: true
        };
      default:
        return {
          icon: '❌',
          defaultTitle: 'Something went wrong',
          defaultMessage: 'An unexpected error occurred. Please try again.',
          showRetry: true
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className={styles.errorState}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>{config.icon}</div>
        <h3 className={styles.errorTitle}>
          {title || config.defaultTitle}
        </h3>
        <p className={styles.errorMessage}>
          {message || config.defaultMessage}
        </p>
        
        <div className={styles.errorActions}>
          {config.showRetry && onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              Try Again
            </button>
          )}
          {onGoBack && (
            <button onClick={onGoBack} className={styles.backButton}>
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
