import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { searchApps } from "./api";
import ErrorState from "./ErrorState";
import AppDetails from "./AppDetails";
import styles from "./App.module.css";

/**
 * Main App component for the Tauri + React application.
 * Provides a greeting interface with logos and form input.
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 * 
 * @example
 * ```jsx
 * import App from './App';
 * 
 * function Root() {
 *   return <App />;
 * }
 * ```
 */
function App() {
  /** 
   * State for greeting message 
   * @type {string} 
   */
  const [greetMsg, setGreetMsg] = useState("");
  
  /** 
   * State for user input name 
   * @type {string} 
   */
  const [name, setName] = useState("");

  /** 
   * State for selected app details view
   * @type {Object|null} 
   */
  const [selectedApp, setSelectedApp] = useState(null);

  /** 
   * State for active category 
   * @type {string} 
   */
  const [activeCategory, setActiveCategory] = useState("all");

  /** 
   * State for search query 
   * @type {string} 
   */
  const [searchQuery, setSearchQuery] = useState("");

  /** 
   * State for search results 
   * @type {Array} 
   */
  const [searchResults, setSearchResults] = useState([]);

  /** 
   * State for loading indicator 
   * @type {boolean} 
   */
  const [isLoading, setIsLoading] = useState(false);

  /** 
   * State for error handling 
   * @type {Object|null} 
   */
  const [error, setError] = useState(null);

  /** 
   * State for tracking if a search has been performed 
   * @type {boolean} 
   */
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Invokes the Tauri backend greet command with the current name.
   * Updates the greeting message state with the response.
   * 
   * @async
   * @function
   * @returns {Promise<void>} Promise that resolves when the greeting is complete
   * 
   * @example
   * ```js
   * await greet(); // Calls backend with current name state
   * ```
   */
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  /**
   * Search for apps using the Flathub API
   * @async
   * @function
   * @returns {Promise<void>}
   */
  async function handleSearch() {
    console.log('handleSearch called with query:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('Empty query, returning');
      return;
    }
    
    console.log('Starting search...');
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const results = await searchApps(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
      
      // If no results found, set a specific error state
      if (results.length === 0) {
        setError({
          type: 'notFound',
          title: 'No Apps Found',
          message: `No applications found for "${searchQuery}". Try different keywords or check the spelling.`
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      
      // Determine error type based on error message
      let errorType = 'generic';
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorType = 'network';
      } else if (err.message.includes('timeout')) {
        errorType = 'timeout';
      } else if (err.message.includes('500') || err.message.includes('server')) {
        errorType = 'server';
      }
      
      setError({
        type: errorType,
        message: err.message
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      console.log('Search completed');
    }
  }

  /**
   * Handle app card click to show details
   * @param {Object} app - The app object to show details for
   */
  const handleAppClick = (app) => {
    setSelectedApp(app);
  };

  /**
   * Handle closing app details view
   */
  const handleCloseDetails = () => {
    setSelectedApp(null);
  };

  /**
   * Handle app installation
   * @param {Object} app - The app to install
   */
  const handleInstallApp = (app) => {
    console.log('Installing app:', app.name);
    // TODO: Implement actual installation logic
    alert(`Installing ${app.name}...`);
  };

  /**
   * Clear error state and retry the search
   */
  const handleRetry = () => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  /**
   * Clear all search-related state
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className={styles.storeApp}>
      {/* Header */}
      <header className={styles.storeHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.storeTitle}>
            <span className={styles.storeLogo}>📦</span>
            Tinted Linux Store
          </h1>
          <p className={styles.storeSubtitle}>Discover and install Flatpak applications</p>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <h3 className={styles.navTitle}>Browse</h3>
            <ul className={styles.navList}>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'all' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  🏠 All Applications
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'featured' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('featured')}
                >
                  ⭐ Featured
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'recent' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('recent')}
                >
                  🆕 Recently Added
                </button>
              </li>
            </ul>
            
            <h3 className={styles.navTitle}>Categories</h3>
            <ul className={styles.navList}>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'development' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('development')}
                >
                  👨‍💻 Development
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'graphics' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('graphics')}
                >
                  🎨 Graphics & Design
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'games' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('games')}
                >
                  🎮 Games
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'office' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('office')}
                >
                  📄 Office & Productivity
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'multimedia' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('multimedia')}
                >
                  🎵 Audio & Video
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'internet' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('internet')}
                >
                  🌐 Internet
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'education' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('education')}
                >
                  📚 Education & Science
                </button>
              </li>
              <li>
                <button 
                  className={`${styles.navItem} ${activeCategory === 'utilities' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveCategory('utilities')}
                >
                  🔧 System & Utilities
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Section */}
          <section className={styles.searchSection}>
            <form
              className={styles.searchForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className={styles.searchInputGroup}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for applications..."
                  className={styles.searchInput}
                />
                <button type="submit" disabled={isLoading} className={styles.searchButton}>
                  {isLoading ? "Searching..." : "🔍 Search"}
                </button>
              </div>
            </form>
          </section>

          {/* Search Results */}
          {searchResults.length > 0 && !error && (
            <section className={styles.resultsSection}>
              <h2 className={styles.sectionTitle}>
                Search Results ({searchResults.length})
              </h2>
              <div className={styles.appGrid}>
                {searchResults.map(app => (
                  <div 
                    key={app.id} 
                    className={styles.appCard}
                    onClick={() => handleAppClick(app)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.appIconContainer}>
                      <img 
                        src={app.iconUrl} 
                        alt={`${app.name} icon`}
                        className={styles.appIcon}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                        }}
                      />
                    </div>
                    <div className={styles.appInfo}>
                      <h3 className={styles.appName}>{app.name}</h3>
                      <p className={styles.appSummary}>{app.summary}</p>
                      <div className={styles.appMeta}>
                        <span className={styles.appId}>{app.id}</span>
                      </div>
                    </div>
                    <button 
                      className={styles.installButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstallApp(app);
                      }}
                    >
                      Install
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Error State */}
          {error && (
            <ErrorState 
              type={error.type}
              title={error.title}
              message={error.message}
              onRetry={handleRetry}
              onGoBack={handleClearSearch}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <section className={styles.loadingSection}>
              <div className={styles.loadingContent}>
                <div className={styles.loadingSpinner}></div>
                <h3>Searching for apps...</h3>
                <p>Please wait while we find the best applications for you.</p>
              </div>
            </section>
          )}

          {/* Welcome State */}
          {!hasSearched && !isLoading && (
            <section className={styles.welcomeSection}>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeIcon}>🚀</div>
                <h2>Welcome to Tinted Linux Store</h2>
                <p>Search for thousands of Flatpak applications available on Flathub</p>
                <div className={styles.featuresGrid}>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>🔒</div>
                    <h4>Secure</h4>
                    <p>Sandboxed applications</p>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>🔄</div>
                    <h4>Updated</h4>
                    <p>Always latest versions</p>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>🌐</div>
                    <h4>Universal</h4>
                    <p>Works on all Linux distros</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* App Details Modal */}
      {selectedApp && (
        <AppDetails 
          app={selectedApp}
          onClose={handleCloseDetails}
          onInstall={handleInstallApp}
        />
      )}
    </div>
  );
}

export default App;
