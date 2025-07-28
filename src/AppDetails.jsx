import { useState, useEffect } from 'react';
import { getAppDetails } from './api';
import ErrorState from './ErrorState';
import styles from './AppDetails.module.css';

/**
 * AppDetails component for displaying detailed information about a specific application
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.app - The app object to display details for
 * @param {Function} props.onClose - Function to call when closing the details view
 * @param {Function} props.onInstall - Function to call when installing the app
 * @returns {JSX.Element} The app details interface
 */
function AppDetails({ app, onClose, onInstall }) {
  const [appDetails, setAppDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch detailed information about the app
   */
  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch real app details from Flathub API
        const details = await getAppDetails(app.id);
        
        // Transform the API response to match our component's expectations
        const transformedDetails = {
          ...details,
          iconUrl: details.iconUrl,
          rating: 4.5, // Mock rating since it's not in the API
          downloads: '10,000+', // Mock downloads since it's not in the API
          size: '45.2 MB', // Mock size since it's not in the API
          permissions: [
            'Access to your files',
            'Network access',
            'Display notifications'
          ]
        };
        
        setAppDetails(transformedDetails);
      } catch (err) {
        console.error('Failed to fetch app details:', err);
        setError({
          type: 'network',
          message: err.message || 'Failed to load app details'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (app) {
      fetchAppDetails();
    }
  }, [app]);

  /**
   * Handle install button click
   */
  const handleInstall = () => {
    if (onInstall) {
      onInstall(app);
    }
  };

  /**
   * Handle back button click
   */
  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <h3>Loading app details...</h3>
          <p>Please wait while we fetch the information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailsContainer}>
        <ErrorState 
          type={error.type}
          message={error.message}
          onRetry={() => window.location.reload()}
          onGoBack={handleBack}
        />
      </div>
    );
  }

  if (!appDetails) {
    return null;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsContent}>
        {/* Header */}
        <header className={styles.detailsHeader}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back to Search
          </button>
          <div className={styles.appHeaderInfo}>
            <img 
              src={appDetails.iconUrl} 
              alt={`${appDetails.name} icon`}
              className={styles.appIconLarge}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
              }}
            />
            <div className={styles.appTitleSection}>
              <h1 className={styles.appTitle}>{appDetails.name}</h1>
              <p className={styles.appDeveloper}>by {appDetails.developer}</p>
              <p className={styles.appSummary}>{appDetails.summary}</p>
              <div className={styles.appMeta}>
                <span className={styles.appRating}>★ {appDetails.rating}</span>
                <span className={styles.appDownloads}>{appDetails.downloads} downloads</span>
                <span className={styles.appCategory}>{appDetails.category}</span>
              </div>
            </div>
            <div className={styles.installSection}>
              <button className={styles.installButtonLarge} onClick={handleInstall}>
                Install
              </button>
              <div className={styles.appInfo}>
                <span className={styles.appSize}>{appDetails.size}</span>
                <span className={styles.appVersion}>v{appDetails.version}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Screenshots */}
        {appDetails.screenshots && appDetails.screenshots.length > 0 && (
          <section className={styles.screenshotsSection}>
            <h2 className={styles.sectionTitle}>Screenshots</h2>
            <div className={styles.screenshotsGrid}>
              {appDetails.screenshots.map((screenshot, index) => (
                <img 
                  key={index}
                  src={screenshot}
                  alt={`${appDetails.name} screenshot ${index + 1}`}
                  className={styles.screenshot}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        <section className={styles.descriptionSection}>
          <h2 className={styles.sectionTitle}>About {appDetails.name}</h2>
          <div className={styles.description}>
            {appDetails.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Information */}
        <section className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Version</span>
              <span className={styles.infoValue}>{appDetails.version}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Updated</span>
              <span className={styles.infoValue}>{appDetails.updatedDate || 'Unknown'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Size</span>
              <span className={styles.infoValue}>{appDetails.size}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>License</span>
              <span className={styles.infoValue}>{appDetails.license}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>App ID</span>
              <span className={styles.infoValue}>{appDetails.id}</span>
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section className={styles.permissionsSection}>
          <h2 className={styles.sectionTitle}>Permissions</h2>
          <ul className={styles.permissionsList}>
            {appDetails.permissions.map((permission, index) => (
              <li key={index} className={styles.permissionItem}>
                🔒 {permission}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AppDetails;
