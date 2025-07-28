# Tinted Linux Store

A modern, cross-platform application store for Linux built with Tauri and React. Discover, browse, and manage Flatpak applications with a beautiful, native interface.

![Tinted Linux Store](https://img.shields.io/badge/Platform-Linux-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-GPL%20v3-green?style=for-the-badge)
![Tauri](https://img.shields.io/badge/Tauri-2.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)

## ✨ Features

- 🔍 **Fast Search** - Search thousands of Flatpak applications from Flathub
- 📱 **Modern UI** - Clean, OS-neutral design inspired by contemporary app stores
- 🖼️ **Rich App Details** - View screenshots, descriptions, and metadata
- 🏷️ **Category Browsing** - Explore apps by categories (Development, Graphics, Games, etc.)
- ⚡ **Native Performance** - Built with Rust backend for speed and efficiency
- 🛡️ **Error Handling** - Robust error boundaries and user-friendly error states
- 📦 **Real Data** - Powered by Flathub's official API

## 🖥️ Screenshots

*App search and browsing interface*
*Detailed app information with real screenshots*
*Modern sidebar navigation*

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tinted-linux-store.git
   cd tinted-linux-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

## 🏗️ Architecture

### Frontend (React)
- **Modern React 18** with functional components and hooks
- **CSS Modules** for scoped styling
- **Error Boundaries** for graceful error handling
- **Responsive Design** that works across different screen sizes

### Backend (Rust/Tauri)
- **Tauri Commands** for secure API communication
- **Reqwest HTTP Client** for Flathub API integration
- **Serde JSON** for data serialization
- **Async/Await** for non-blocking operations

### API Integration
- **Flathub API v1** for app search and metadata
- **Real-time search** with error handling and timeouts
- **Image handling** for app icons and screenshots

## 🛠️ Development

### Project Structure
```
src/
├── App.jsx              # Main application component
├── AppDetails.jsx       # App details modal
├── ErrorBoundary.jsx    # Error handling
├── ErrorState.jsx       # Error display component
├── api.js              # API functions
└── *.module.css        # CSS modules

src-tauri/
├── src/
│   ├── main.rs         # Tauri app entry point
│   └── lib.rs          # API commands and logic
├── Cargo.toml          # Rust dependencies
└── tauri.conf.json     # Tauri configuration
```

### Available Commands

- `npm run dev` - Start Vite development server
- `npm run tauri dev` - Start Tauri development app
- `npm run build` - Build frontend for production
- `npm run tauri build` - Build complete application

### Code Quality

- **JSDoc Documentation** - Comprehensive code documentation
- **Error Handling** - Robust error management throughout
- **Type Safety** - Proper data validation and type checking
- **Modular Design** - Clean separation of concerns

## 🎯 Current Features

- ✅ **App Search** - Search Flathub's application database
- ✅ **App Details** - View comprehensive app information
- ✅ **Modern UI** - Professional app store interface
- ✅ **Error Handling** - Graceful error recovery
- ✅ **Real Screenshots** - Actual app screenshots from Flathub

## 🔮 Planned Features

- 🔄 **Flatpak Integration** - Actual app installation and management
- 📊 **Installation Status** - Track installed applications
- ⭐ **Featured Apps** - Curated app recommendations
- 🆕 **Recently Added** - Latest apps on Flathub
- 🏷️ **Category Filtering** - Filter apps by category
- 📈 **Progress Tracking** - Installation progress indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Flathub](https://flathub.org/) for the comprehensive Flatpak application database
- [Tauri](https://tauri.app/) for the amazing cross-platform framework
- [React](https://reactjs.org/) for the powerful frontend library
- The open source community for inspiration and tools

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [Tauri documentation](https://tauri.app/)
- Visit the [Flathub website](https://flathub.org/)

---

**Made with ❤️ for the Linux community**