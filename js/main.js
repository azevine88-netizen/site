/**
 * StreamMax - Netflix Clone JavaScript
 * İnteraktif özellikler ve animasyonlar
 */

class StreamMax {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadMovies();
        this.setupGlobalReference();
        this.initVideoPlayer();
    }

   

    bindEvents() {
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Navigation links - DOM yüklendikten sonra çalıştır
        setTimeout(() => {
            this.setupNavigationLinks();
        }, 100);

        // Hero buttons
        const heroPlayBtn = document.querySelector('.hero-play-btn');
        const heroInfoBtn = document.querySelector('.hero-info-btn');
        if (heroPlayBtn) {
            heroPlayBtn.addEventListener('click', () => this.handleHeroPlay());
        }
        if (heroInfoBtn) {
            heroInfoBtn.addEventListener('click', () => this.handleHeroInfo());
        }
        
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('focus', () => this.showSearchResults());
            searchInput.addEventListener('blur', () => this.hideSearchResults());
        }

        // Movie card interactions
        document.addEventListener('click', (e) => this.handleMovieCardClick(e));
        
        // User menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => this.toggleUserMenu(e));
        }
        
        // User dropdown items
        setTimeout(() => {
            this.setupUserDropdownItems();
            this.setupLanguageDropdown();
            this.loadSavedLanguage();
        }, 200);

        // Footer links
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleFooterLink(e));
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Event delegation for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                console.log('Event delegation ile navigasyon linki tıklandı:', e.target.textContent.trim());
                this.handleNavigation(e);
            }
        });
        
        // Event delegation for dropdown items
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                console.log('Event delegation ile dropdown öğesi tıklandı:', e.target.textContent.trim());
                this.handleDropdownItemClick(e);
            }
        });

        // Video player events
        this.setupVideoPlayerEvents();
        
        // Mobile menu events
        this.setupMobileMenu();
        
    // Accessibility features
    this.setupAccessibility();
}

    // Eksik fonksiyonları ekle
    setupNavigationLinks() {
        // button-activator.js zaten navigasyonu yönetiyor, bu yüzden burada sadece kontrol ediyoruz
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length > 0) {
            console.log(`${navLinks.length} adet navigasyon linki bulundu, button-activator.js tarafından yönetiliyor`);
        }
        // Event listener ekleme işlemi button-activator.js tarafından yapılıyor
    }

    setupUserDropdownItems() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDropdownItemClick(e);
            });
        });
    }

    setupLanguageDropdown() {
        const languageItem = document.getElementById('languageItem');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (languageItem && languageDropdown) {
            languageItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                languageDropdown.classList.toggle('show');
            });
            
            // Language options
            const languageOptions = languageDropdown.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = option.getAttribute('data-lang');
                    this.changeLanguage(lang);
                    languageDropdown.classList.remove('show');
                });
            });
        }
    }

    handleDropdownItemClick(e) {
        const item = e.target.closest('.dropdown-item');
        if (!item) return;
        
        const href = item.getAttribute('href');
        const text = item.textContent.trim();
        
        console.log(`Dropdown item clicked: ${text} (${href})`);
        
        // Handle different dropdown items
        if (href === '#login') {
            this.showLoginModal();
        } else if (href === '#profile') {
            this.showProfileModal();
        } else if (href === '#settings') {
            this.showSettingsModal();
        } else if (href === '#help') {
            this.showHelpModal();
        } else if (href === '#logout') {
            this.handleLogout();
        }
    }

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'loginModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="login.title">Giriş Yap</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="login-form">
                        <div class="form-group">
                            <label data-translate="login.email">E-posta</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label data-translate="login.password">Şifre</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary" data-translate="login.submit">Giriş Yap</button>
                    </form>
                    <div class="social-login">
                        <button class="btn btn-google" data-translate="login.google">Google ile Giriş</button>
                        <button class="btn btn-facebook" data-translate="login.facebook">Facebook ile Giriş</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.applyTranslationsToModal(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Form submission
        const form = modal.querySelector('.login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit(modal);
        });
    }

    showProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'profileModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="profile.title">Profil</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3 data-translate="profile.name">Kullanıcı Adı</h3>
                        <p data-translate="profile.email">user@example.com</p>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary" data-translate="profile.edit">Profili Düzenle</button>
                        <button class="btn btn-secondary" data-translate="profile.settings">Ayarlar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.applyTranslationsToModal(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'settingsModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="settings.title">Ayarlar</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h3 data-translate="settings.language">Dil</h3>
                        <select id="languageSelect">
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                    <div class="settings-section">
                        <h3 data-translate="settings.subtitles">Altyazılar</h3>
                        <select id="subtitleSelect">
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                    <div class="settings-section">
                        <h3 data-translate="settings.quality">Video Kalitesi</h3>
                        <select id="qualitySelect">
                            <option value="auto">Otomatik</option>
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                            <option value="480p">480p</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.applyTranslationsToModal(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'helpModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="help.title">Yardım</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="help-section">
                        <h3 data-translate="help.faq">Sık Sorulan Sorular</h3>
                        <div class="faq-item">
                            <h4 data-translate="help.faq1">Nasıl film izleyebilirim?</h4>
                            <p data-translate="help.faq1_answer">Film kartlarına tıklayarak veya oynat butonuna basarak filmleri izleyebilirsiniz.</p>
                        </div>
                        <div class="faq-item">
                            <h4 data-translate="help.faq2">Nasıl liste oluşturabilirim?</h4>
                            <p data-translate="help.faq2_answer">Film kartlarındaki + butonuna tıklayarak filmleri listenize ekleyebilirsiniz.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.applyTranslationsToModal(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    handleLogout() {
        this.showNotification('Çıkış yapılıyor...', 'info');
        // Simulate logout
        setTimeout(() => {
            this.showNotification('Başarıyla çıkış yapıldı!', 'success');
        }, 1000);
    }

    handleLoginSubmit(modal) {
        const email = modal.querySelector('#loginEmail').value;
        const password = modal.querySelector('#loginPassword').value;
        
        if (this.validateLoginForm(email, password)) {
            this.showNotification('Giriş başarılı!', 'success');
            this.closeModal(modal);
        } else {
            this.showNotification('Geçersiz bilgiler!', 'error');
        }
    }

    validateLoginForm(email, password) {
        // Basic validation
        if (!email || !password) {
            return false;
        }
        
        if (email.length < 5 || password.length < 6) {
            return false;
        }
        
        return true;
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    setupMovieCardEvents(card) {
        // Add event listeners to movie card buttons
        const playBtn = card.querySelector('.btn-play');
        const addBtn = card.querySelector('.btn-add');
        const likeBtn = card.querySelector('.btn-like');
        
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.playMovie(card);
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addToWatchlist(card);
            });
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleLike(card);
            });
        }
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    setupSearch() {
        // Create search results container
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            const searchResults = document.createElement('div');
            searchResults.className = 'search-results';
            searchResults.innerHTML = `
                <div class="search-results-content">
                    <div class="search-suggestions">
                        <h4>Popüler Aramalar</h4>
                        <div class="suggestion-tags">
                            <span class="tag" data-search="Stranger Things">Stranger Things</span>
                            <span class="tag" data-search="The Crown">The Crown</span>
                            <span class="tag" data-search="Bridgerton">Bridgerton</span>
                            <span class="tag" data-search="Ozark">Ozark</span>
                            <span class="tag" data-search="Money Heist">Money Heist</span>
                        </div>
                    </div>
                    <div class="search-results-list">
                        <!-- Search results will be populated here -->
                    </div>
                </div>
            `;
            searchContainer.appendChild(searchResults);

            // Add click handlers to suggestion tags
            const tags = searchResults.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.addEventListener('click', () => {
                    const searchTerm = tag.getAttribute('data-search');
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = searchTerm;
                        this.performSearch(searchTerm);
                    }
                });
            });
        }
    }

    setupMovieCards() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMovieHover(card));
            card.addEventListener('mouseleave', () => this.handleMovieLeave(card));
        });
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const searchResults = document.querySelector('.search-results-list');
        
        if (query.length > 2) {
            this.performSearch(query);
        } else {
            this.showSuggestions();
        }
    }

    performSearch(query) {
        const movieDatabase = this.getMovieDatabase();
        const allMovies = Object.values(movieDatabase);
        
        const filteredResults = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            movie.originalTitle.toLowerCase().includes(query) ||
            movie.genre.some(g => g.toLowerCase().includes(query)) ||
            movie.cast.some(actor => actor.toLowerCase().includes(query)) ||
            movie.director.toLowerCase().includes(query) ||
            movie.description.toLowerCase().includes(query)
        );

        this.displaySearchResults(filteredResults);
    }

    displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results-list');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">Arama sonucu bulunamadı</p>';
        } else {
            searchResults.innerHTML = results.map(movie => `
                <div class="search-result-item" data-movie-id="${movie.id}">
                    <div class="result-poster">
                        <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    </div>
                    <div class="result-info">
                        <h4>${movie.title}</h4>
                        <p>${movie.type === 'series' ? 'Dizi' : 'Film'} • ${movie.year} • ⭐ ${movie.rating}</p>
                        <p class="result-genre">${movie.genre.join(', ')}</p>
                        <p class="result-description">${movie.description.substring(0, 100)}...</p>
                    </div>
                    <div class="result-actions">
                        <button class="btn-play-small" data-movie-id="${movie.id}">
                        <i class="fas fa-play"></i>
                    </button>
                        <button class="btn-add-small" data-movie-id="${movie.id}">
                            <i class="fas fa-plus"></i>
                    </button>
                    </div>
                </div>
            `).join('');
            
            // Add click handlers to search results
            this.setupSearchResultHandlers();
        }
    }

    setupSearchResultHandlers() {
        const searchResults = document.querySelectorAll('.search-result-item');
        searchResults.forEach(result => {
            const playBtn = result.querySelector('.btn-play-small');
            const addBtn = result.querySelector('.btn-add-small');
            const movieId = result.getAttribute('data-movie-id');
            
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openVideoPlayer(movieId);
                });
            }
            
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.addToWatchlistFromSearch(movieId);
                });
            }
            
            // Click on result item
            result.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.showMovieDetailsFromSearch(movieId);
                }
            });
        });
    }

    addToWatchlistFromSearch(movieId) {
        const movieDatabase = this.getMovieDatabase();
        const movie = movieDatabase[movieId];
        if (movie) {
            this.showNotification(`${movie.title} izleme listesine eklendi!`, 'success');
        }
    }

    showMovieDetailsFromSearch(movieId) {
        const movieDatabase = this.getMovieDatabase();
        const movie = movieDatabase[movieId];
        if (movie) {
            this.showMovieModal(movie);
        }
    }

    showSuggestions() {
        const searchResults = document.querySelector('.search-results-list');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    showSearchResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'block';
        }
    }

    hideSearchResults() {
        // Delay hiding to allow clicking on results
        setTimeout(() => {
            const searchResults = document.querySelector('.search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }, 200);
    }

    handleMovieHover(card) {
        // Add hover effects
        card.style.transform = 'scale(1.05)';
        card.style.zIndex = '10';
        
        // Show movie info
        const overlay = card.querySelector('.movie-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    }

    handleMovieLeave(card) {
        // Remove hover effects
        card.style.transform = 'scale(1)';
        card.style.zIndex = '1';
        
        // Hide movie info
        const overlay = card.querySelector('.movie-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    }

    handleMovieCardClick(e) {
        const movieCard = e.target.closest('.movie-card');
        if (!movieCard) return;

        const btnPlay = e.target.closest('.btn-play');
        const btnAdd = e.target.closest('.btn-add');
        const btnLike = e.target.closest('.btn-like');

        if (btnPlay) {
            e.preventDefault();
            e.stopPropagation();
            this.playMovie(movieCard);
        } else if (btnAdd) {
            e.preventDefault();
            e.stopPropagation();
            this.addToWatchlist(movieCard);
        } else if (btnLike) {
            e.preventDefault();
            e.stopPropagation();
            this.toggleLike(movieCard);
        } else {
            // Click on movie card itself
            this.showMovieDetails(movieCard);
        }
    }

    playMovie(movieCard) {
        const movieTitle = movieCard.querySelector('h3').textContent;
        console.log(`Playing: ${movieTitle}`);
        
        // Show play animation
        const btnPlay = movieCard.querySelector('.btn-play');
        const originalHTML = btnPlay.innerHTML;
        btnPlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btnPlay.classList.add('btn-loading');
        btnPlay.disabled = true;
        
        // Map movie titles to video IDs
        const videoIdMap = {
            'Stranger Things': 'stranger-things',
            'The Crown': 'the-crown',
            'Bridgerton': 'bridgerton',
            'Ozark': 'ozark',
            'Money Heist': 'money-heist',
            'Extraction 2': 'stranger-things', // Fallback
            'Red Notice': 'the-crown', // Fallback
            'Don\'t Look Up': 'bridgerton', // Fallback
            'The Irishman': 'ozark', // Fallback
            'Bird Box': 'money-heist', // Fallback
            'Wednesday': 'stranger-things', // Fallback
            'Glass Onion': 'the-crown', // Fallback
            'Enola Holmes 2': 'bridgerton', // Fallback
            'All Quiet on the Western Front': 'ozark', // Fallback
            'Pinocchio': 'money-heist' // Fallback
        };
        
        const videoId = videoIdMap[movieTitle] || 'stranger-things';
        
        setTimeout(() => {
            btnPlay.innerHTML = originalHTML;
            btnPlay.classList.remove('btn-loading');
            btnPlay.disabled = false;
            
            // Open video player
            this.openVideoPlayer(videoId);
        }, 500);
    }

    addToWatchlist(movieCard) {
        const movieTitle = movieCard.querySelector('h3').textContent;
        const btnAdd = movieCard.querySelector('.btn-add');
        
        // Toggle add state
        if (btnAdd.classList.contains('btn-added')) {
            btnAdd.classList.remove('btn-added');
            btnAdd.innerHTML = '<i class="fas fa-plus"></i>';
            this.removeFromWatchlist(movieTitle);
        } else {
            btnAdd.classList.add('btn-added');
            btnAdd.innerHTML = '<i class="fas fa-check"></i>';
            this.addToWatchlistAction(movieTitle);
        }
    }

    toggleLike(movieCard) {
        const movieTitle = movieCard.querySelector('h3').textContent;
        const btnLike = movieCard.querySelector('.btn-like');
        
        // Toggle like state
        if (btnLike.classList.contains('btn-liked')) {
            btnLike.classList.remove('btn-liked');
            btnLike.innerHTML = '<i class="fas fa-thumbs-up"></i>';
            this.removeLike(movieTitle);
        } else {
            btnLike.classList.add('btn-liked');
            btnLike.innerHTML = '<i class="fas fa-heart"></i>';
            this.addLike(movieTitle);
        }
    }

    showMovieDetails(movieCard) {
        const movieTitle = movieCard.querySelector('h3').textContent;
        const movieGenre = movieCard.querySelector('p').textContent;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${movieTitle}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="movie-poster">
                        <img src="${movieCard.querySelector('img').src}" alt="${movieTitle}">
                    </div>
                    <div class="movie-details">
                        <p class="movie-genre">${movieGenre}</p>
                        <p class="movie-description">
                            Bu harika ${movieGenre.toLowerCase()} türündeki yapım, 
                            izleyicilere unutulmaz bir deneyim sunuyor.
                        </p>
                        <div class="movie-actions">
                            <button class="btn btn-primary">
                                <i class="fas fa-play"></i>
                                Oynat
                            </button>
                            <button class="btn btn-secondary">
                                <i class="fas fa-plus"></i>
                                Listeme Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    addToWatchlistAction(movieTitle) {
        console.log(`Added to watchlist: ${movieTitle}`);
        this.showNotification(`${movieTitle} izleme listesine eklendi!`, 'success');
    }

    removeFromWatchlist(movieTitle) {
        console.log(`Removed from watchlist: ${movieTitle}`);
        this.showNotification(`${movieTitle} izleme listesinden çıkarıldı!`);
    }

    addLike(movieTitle) {
        console.log(`Liked: ${movieTitle}`);
        this.showNotification(`${movieTitle} beğenildi!`, 'success');
    }

    removeLike(movieTitle) {
        console.log(`Unliked: ${movieTitle}`);
        this.showNotification(`${movieTitle} beğeni kaldırıldı!`, 'info');
    }

    showNotification(message, type = 'info') {
        // Button activator ile entegrasyon
        if (window.StreamMaxButtonActivator && window.StreamMaxButtonActivator.showNotification) {
            window.StreamMaxButtonActivator.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: var(--darker-bg);
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    toggleUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        userMenu.classList.toggle('active');
    }

    handleOutsideClick(e) {
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.querySelector('.user-dropdown');
        if (userMenu && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
            if (userDropdown) {
                userDropdown.classList.remove('show');
            }
        }
    }

    // Navigation handling
    handleNavigation(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const link = e.target.closest('.nav-link') || e.target;
        const section = link.getAttribute('data-section');
        const text = link.textContent.trim();
        
        console.log(`Navigasyon: ${text} (${section}) tıklandı`);
        
        // Visual feedback
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
        // Tüm nav linklerini bul ve aktif durumu güncelle
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // switchContentSection fonksiyonunu kullan (HTML'deki inline JavaScript'te tanımlı)
        if (section && typeof window.switchContentSection === 'function') {
            window.switchContentSection(section);
            this.showNotification(`${text} bölümüne geçiliyor...`, 'info');
        } else if (section) {
            // Yedek: manuel section geçişi
            this.switchContentSection(section);
            this.showNotification(`${text} bölümüne geçiliyor...`, 'info');
        } else {
            this.showNotification(`"${text}" menü öğesi tıklandı!`, 'info');
        }
        
        // Mobile menüyü kapat
        const nav = document.querySelector('.nav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (nav && mobileMenuBtn) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }
    
    // Yedek section geçiş fonksiyonu - Scale + Fade efekti ile
    switchContentSection(sectionName) {
        console.log('Content section geçişi:', sectionName);
        
        // Scroll to top fonksiyonu
        const scrollToTop = () => {
            if (window.scrollTo) {
                window.scrollTo(0, 0);
            }
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
            }
            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }
        };
        
        // Hemen scroll yap
        scrollToTop();
        
        // Hero section - Scale + Fade efekti
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            if (sectionName === 'home') {
                heroSection.classList.remove('exiting');
                heroSection.classList.add('entering');
                heroSection.style.display = 'flex';
                setTimeout(() => {
                    heroSection.classList.add('active');
                }, 10);
            } else {
                heroSection.classList.remove('entering', 'active');
                heroSection.classList.add('exiting');
                setTimeout(() => {
                    heroSection.style.display = 'none';
                    heroSection.classList.remove('exiting');
                }, 500);
            }
        }
        
        // Categories section - Scale + Fade efekti
        const categoriesSection = document.querySelector('.categories');
        if (categoriesSection) {
            if (sectionName === 'home') {
                categoriesSection.classList.remove('exiting');
                categoriesSection.classList.add('entering');
                categoriesSection.style.display = 'block';
                setTimeout(() => {
                    categoriesSection.classList.add('active');
                }, 10);
            } else {
                categoriesSection.classList.remove('entering', 'active');
                categoriesSection.classList.add('exiting');
                setTimeout(() => {
                    categoriesSection.style.display = 'none';
                    categoriesSection.classList.remove('exiting');
                }, 500);
            }
        }
        
        // Tüm content section'ları Scale + Fade ile gizle
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.remove('active', 'entering');
                section.classList.add('exiting');
                setTimeout(() => {
                    section.style.display = 'none';
                    section.classList.remove('exiting');
                }, 500);
            } else {
                section.classList.remove('active', 'entering', 'exiting');
                section.style.display = 'none';
            }
        });
        
        // İlgili section'ı Scale + Fade ile göster
        if (sectionName === 'home') {
            console.log('Ana sayfa gösteriliyor - hero ve categories görünür');
        } else {
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                console.log('Target section bulundu:', targetSection.id);
                targetSection.classList.remove('exiting');
                targetSection.classList.add('entering');
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 10);
            } else {
                console.log('Target section bulunamadı:', `${sectionName}-section`);
            }
        }
        
        // Smooth scroll için kısa bir gecikme
        setTimeout(() => {
            if (window.scrollTo) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    scrollToCategory(category) {
        console.log(`Kategoriye scroll yapılıyor: ${category}`);
        
        // Kategori section'larını bul
        const categorySections = {
            'series': '.category-section:nth-child(1)', // Trend Olanlar
            'movies': '.category-section:nth-child(2)', // Popüler Filmler  
            'trending': '.category-section:nth-child(3)', // Yeni Çıkanlar
            'mylist': '.categories' // Tüm kategoriler
        };
        
        const targetSelector = categorySections[category];
        if (targetSelector) {
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Hero button handlers
    handleHeroPlay() {
        console.log('Hero play button clicked');
        const heroPlayBtn = document.querySelector('.hero-play-btn');
        const movieId = heroPlayBtn?.getAttribute('data-movie-id') || 'stranger-things';
        // Open video player with featured content
        this.openVideoPlayer(movieId);
    }

    handleHeroInfo() {
        this.showNotification('Film detayları açılıyor...');
        // Create info modal
        this.showMovieModal({
            title: 'StreamMax Özel İçerik',
            genre: 'Drama, Aksiyon',
            description: 'Bu özel içerik, StreamMax platformunda sadece sizin için hazırlandı. Sınırsız eğlence ve kaliteli içerik deneyimi yaşayın.',
            image: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        });
    }

    // Footer link handler
    handleFooterLink(e) {
        e.preventDefault();
        const text = e.target.textContent.trim();
        const page = e.target.getAttribute('data-page');
        
        this.showNotification(`"${text}" sayfası açılıyor...`, 'info');
        
        // Simulate page loading
        const link = e.target;
        link.style.opacity = '0.7';
        link.style.pointerEvents = 'none';
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
        }, 1000);
    }

    // Enhanced user menu toggle
    toggleUserMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userDropdown) {
            userDropdown.classList.toggle('show');
            userMenu.classList.toggle('active');
        }
    }

    // Enhanced movie modal
    showMovieModal(movie) {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${movie.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="movie-poster">
                        <img src="${movie.image}" alt="${movie.title}">
                    </div>
                    <div class="movie-details">
                        <p class="movie-genre">${movie.genre}</p>
                        <p class="movie-description">${movie.description}</p>
                        <div class="movie-actions">
                            <button class="btn btn-primary modal-play-btn">
                                <i class="fas fa-play"></i>
                                Oynat
                            </button>
                            <button class="btn btn-secondary modal-add-btn">
                                <i class="fas fa-plus"></i>
                                Listeme Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Modal button handlers
        const modalPlayBtn = modal.querySelector('.modal-play-btn');
        const modalAddBtn = modal.querySelector('.modal-add-btn');
        
        modalPlayBtn.addEventListener('click', () => {
            this.showNotification(`"${movie.title}" oynatılıyor...`);
        });
        
        modalAddBtn.addEventListener('click', () => {
            this.showNotification(`"${movie.title}" izleme listesine eklendi!`);
        });
    }

    loadMovies() {
        // Simulate loading movies
        console.log('Loading movies...');
        
        // Render movie cards from database
        this.renderMovieCards();
        
        // Update hero section with featured content
        this.updateHeroSection();
        
        // Add loading animation to movie cards
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    updateHeroSection() {
        const movieDatabase = this.getMovieDatabase();
        const featuredMovies = Object.values(movieDatabase).filter(movie => movie.featured);
        
        if (featuredMovies.length > 0) {
            const randomMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)];
            this.setHeroContent(randomMovie);
            
            // Set up movie recommendations
            this.setupMovieRecommendations(randomMovie);
        }
    }

    setHeroContent(movie) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroTitle) {
            heroTitle.textContent = movie.title;
        }
        
        if (heroSubtitle) {
            heroSubtitle.textContent = movie.description.substring(0, 150) + '...';
        }
        
        if (heroBackground) {
            heroBackground.innerHTML = `
                <img src="${movie.backdrop}" alt="${movie.title}" loading="lazy">
            `;
        }
        
        // Update hero play button to play this movie
        const heroPlayBtn = document.querySelector('.hero-play-btn');
        if (heroPlayBtn) {
            heroPlayBtn.setAttribute('data-movie-id', movie.id);
        }
    }

    renderMovieCards() {
        const movieDatabase = this.getMovieDatabase();
        const categories = {
            'trending': Object.values(movieDatabase).filter(movie => movie.trending),
            'popular': Object.values(movieDatabase).filter(movie => movie.popular),
            'new': Object.values(movieDatabase).filter(movie => movie.newRelease),
            'featured': Object.values(movieDatabase).filter(movie => movie.featured)
        };

        // Her kategori için film kartlarını oluştur
        Object.keys(categories).forEach(categoryKey => {
            const categorySection = document.querySelector(`[data-category="${categoryKey}"]`);
            if (categorySection) {
                const movieRow = categorySection.querySelector('.movie-row');
                if (movieRow) {
                    movieRow.innerHTML = '';
                    categories[categoryKey].forEach(movie => {
                        const movieCard = this.createMovieCard(movie);
                        movieRow.appendChild(movieCard);
                    });
                }
            }
        });
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-movie-id', movie.id);
        
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy" data-src="${movie.poster}">
            <div class="movie-overlay">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre.join(', ')} • ${movie.year}</p>
                    <div class="movie-rating">
                        <span class="rating">⭐ ${movie.rating}</span>
                        <span class="age-rating">${movie.ageRating}</span>
                    </div>
                    <div class="movie-actions">
                        <button class="btn-play" data-action="play" data-movie-id="${movie.id}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-add" data-action="add" data-movie-id="${movie.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-like" data-action="like" data-movie-id="${movie.id}">
                            <i class="fas fa-thumbs-up"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Setup image optimization
        this.setupImageOptimization(card);

        return card;
    }

    // Image Optimization System
    setupImageOptimization(card) {
        const img = card.querySelector('img');
        if (!img) return;

        // Add image optimization attributes
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        
        // Add placeholder while loading
        img.style.backgroundColor = '#333';
        img.style.backgroundImage = 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)';
        img.style.backgroundSize = '20px 20px';
        img.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
        
        // Add error handling
        img.addEventListener('error', () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xNTAgMjAwTDEyMCAyMzBIMTgwTDE1MCAyMDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5SZXNpbSBZdWtsZW5lbWVkaQ==';
            img.alt = 'Resim yüklenemedi';
        });
        
        // Add load event
        img.addEventListener('load', () => {
            img.style.backgroundColor = 'transparent';
            img.style.backgroundImage = 'none';
        });
    }

    // Advanced Image Optimization
    optimizeImage(img, options = {}) {
        const {
            quality = 80,
            format = 'webp',
            width = 300,
            height = 450
        } = options;
        
        // Create optimized image URL
        const originalSrc = img.getAttribute('data-src') || img.src;
        const optimizedSrc = this.createOptimizedImageUrl(originalSrc, {
            quality,
            format,
            width,
            height
        });
        
        // Set optimized source
        img.src = optimizedSrc;
        
        // Add progressive loading
        this.setupProgressiveLoading(img);
    }

    createOptimizedImageUrl(originalUrl, options) {
        // This would typically use a service like Cloudinary, ImageKit, or similar
        // For now, we'll return the original URL
        return originalUrl;
    }

    setupProgressiveLoading(img) {
        // Add progressive loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }

    // Image Lazy Loading Enhancement
    setupAdvancedLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    }

    // CSS/JS Minification and Optimization
    setupMinification() {
        // Minify CSS
        this.minifyCSS();
        
        // Minify JS
        this.minifyJS();
        
        // Setup compression
        this.setupCompression();
    }

    minifyCSS() {
        // Remove comments and unnecessary whitespace from CSS
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.type === CSSRule.STYLE_RULE) {
                            // Optimize CSS rules
                            this.optimizeCSSRule(rule);
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets can't be accessed
                console.log('Cannot access stylesheet:', e);
            }
        }
    }

    optimizeCSSRule(rule) {
        // Remove unnecessary properties
        const style = rule.style;
        const propertiesToRemove = [
            'outline: none',
            'border: none',
            'margin: 0',
            'padding: 0'
        ];
        
        propertiesToRemove.forEach(prop => {
            if (style.cssText.includes(prop)) {
                style.cssText = style.cssText.replace(prop, '');
            }
        });
    }

    minifyJS() {
        // Remove console.log statements in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
        }
    }

    setupCompression() {
        // Enable gzip compression (would be handled server-side)
        // Add compression headers
        this.addCompressionHeaders();
    }

    addCompressionHeaders() {
        // This would typically be handled server-side
        // For client-side, we can optimize resource loading
        this.optimizeResourceLoading();
    }

    optimizeResourceLoading() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
    }

    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = 'css/style.css';
        criticalCSS.as = 'style';
        criticalCSS.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(criticalCSS);
        
        // Preload critical fonts
        const criticalFont = document.createElement('link');
        criticalFont.rel = 'preload';
        criticalFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        criticalFont.as = 'style';
        criticalFont.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(criticalFont);
    }

    deferNonCriticalResources() {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.setAttribute('defer', '');
            }
        });
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResourceLoading() {
        // Monitor resource loading times
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) {
                        console.warn('Slow resource:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    monitorUserInteractions() {
        // Track user interactions for performance insights
        let interactionCount = 0;
        const startTime = Date.now();
        
        document.addEventListener('click', () => {
            interactionCount++;
            const timeSinceStart = Date.now() - startTime;
            if (interactionCount === 1) {
                console.log('First interaction:', timeSinceStart + 'ms');
            }
        });
    }

    // Google Analytics Integration
    setupGoogleAnalytics() {
        // Google Analytics 4 (GA4) integration
        this.initializeGA4();
        
        // Track page views
        this.trackPageViews();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track video events
        this.trackVideoEvents();
    }

    initializeGA4() {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    trackPageViews() {
        // Track page views
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
        
        // Track navigation between pages
        this.trackNavigation();
    }

    trackNavigation() {
        // Track navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-section]');
            if (link) {
                const section = link.getAttribute('data-section');
                this.trackEvent('navigation_click', {
                    section: section,
                    link_text: link.textContent.trim()
                });
            }
        });
    }

    trackUserInteractions() {
        // Track movie card interactions
        document.addEventListener('click', (e) => {
            const movieCard = e.target.closest('.movie-card');
            if (movieCard) {
                const movieId = movieCard.getAttribute('data-movie-id');
                const action = e.target.getAttribute('data-action');
                
                if (action) {
                    this.trackEvent('movie_interaction', {
                        movie_id: movieId,
                        action: action,
                        movie_title: movieCard.querySelector('h3, h4')?.textContent || 'Unknown'
                    });
                }
            }
        });
        
        // Track search events
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length > 2) {
                    this.trackEvent('search_query', {
                        search_term: query,
                        query_length: query.length
                    });
                }
            });
        }
        
        // Track video player events
        this.trackVideoPlayerEvents();
    }

    trackVideoPlayerEvents() {
        // Track video play events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.play-btn') || e.target.closest('.hero-play-btn')) {
                const movieId = e.target.closest('[data-movie-id]')?.getAttribute('data-movie-id');
                this.trackEvent('video_play', {
                    movie_id: movieId,
                    video_title: e.target.closest('.movie-card')?.querySelector('h3, h4')?.textContent || 'Unknown'
                });
            }
        });
        
        // Track video completion
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.addEventListener('ended', () => {
                this.trackEvent('video_complete', {
                    video_title: document.getElementById('videoTitle')?.textContent || 'Unknown'
                });
            });
        }
    }

    trackVideoEvents() {
        // Track video-related events
        this.trackEvent('video_engagement', {
            engagement_type: 'video_player_loaded'
        });
    }

    trackEvent(eventName, parameters = {}) {
        // Send event to Google Analytics
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }
        
        // Also log to console for debugging
        console.log('Analytics Event:', eventName, parameters);
    }

    // User Behavior Tracking
    setupUserBehaviorTracking() {
        // Track user journey
        this.trackUserJourney();
        
        // Track engagement metrics
        this.trackEngagementMetrics();
        
        // Track conversion events
        this.trackConversionEvents();
    }

    trackUserJourney() {
        // Track user's path through the site
        this.userJourney = {
            startTime: Date.now(),
            pages: [],
            interactions: [],
            videosWatched: [],
            searches: []
        };
        
        // Track page visits
        this.trackPageVisit();
        
        // Track time spent on page
        this.trackTimeOnPage();
    }

    trackPageVisit() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer
        };
        
        this.userJourney.pages.push(pageData);
        
        // Track page view
        this.trackEvent('page_visit', pageData);
    }

    trackTimeOnPage() {
        let startTime = Date.now();
        
        // Track time when user leaves page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            this.trackEvent('time_on_page', {
                time_spent: timeSpent,
                page_url: window.location.href
            });
        });
    }

    trackEngagementMetrics() {
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track click patterns
        this.trackClickPatterns();
        
        // Track form interactions
        this.trackFormInteractions();
    }

    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scroll depths
                if (scrollPercent >= 25 && maxScroll < 25) {
                    this.trackEvent('scroll_depth', { depth: 25 });
                } else if (scrollPercent >= 50 && maxScroll < 50) {
                    this.trackEvent('scroll_depth', { depth: 50 });
                } else if (scrollPercent >= 75 && maxScroll < 75) {
                    this.trackEvent('scroll_depth', { depth: 75 });
                } else if (scrollPercent >= 90 && maxScroll < 90) {
                    this.trackEvent('scroll_depth', { depth: 90 });
                }
            }
        });
    }

    trackClickPatterns() {
        // Track click heatmap data
        document.addEventListener('click', (e) => {
            const clickData = {
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName,
                class: e.target.className,
                id: e.target.id,
                timestamp: Date.now()
            };
            
            this.userJourney.interactions.push(clickData);
        });
    }

    trackFormInteractions() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = {
                form_id: form.id,
                form_class: form.className,
                fields: Array.from(form.elements).map(el => ({
                    name: el.name,
                    type: el.type,
                    required: el.required
                }))
            };
            
            this.trackEvent('form_submit', formData);
        });
    }

    trackConversionEvents() {
        // Track sign-ups
        this.trackSignUps();
        
        // Track video completions
        this.trackVideoCompletions();
        
        // Track add to list events
        this.trackAddToListEvents();
    }

    trackSignUps() {
        // Track registration form submissions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.register-submit-btn')) {
                this.trackEvent('sign_up_attempt', {
                    method: 'email' // or 'phone' based on active tab
                });
            }
        });
    }

    trackVideoCompletions() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.addEventListener('ended', () => {
                this.trackEvent('video_completion', {
                    video_title: document.getElementById('videoTitle')?.textContent || 'Unknown',
                    completion_rate: 100
                });
            });
        }
    }

    trackAddToListEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add') || e.target.closest('.add-btn')) {
                const movieId = e.target.closest('[data-movie-id]')?.getAttribute('data-movie-id');
                this.trackEvent('add_to_list', {
                    movie_id: movieId,
                    movie_title: e.target.closest('.movie-card')?.querySelector('h3, h4')?.textContent || 'Unknown'
                });
            }
        });
    }

    // RTL Support
    setupRTLSupport() {
        // Detect RTL languages
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'dv'];
        
        // Check if current language is RTL
        const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
        const isRTL = this.rtlLanguages.includes(currentLang);
        
        if (isRTL) {
            this.enableRTL();
        }
        
        // Listen for language changes
        this.setupRTLListener();
    }

    enableRTL() {
        // Add RTL class to body
        document.body.classList.add('rtl');
        
        // Update document direction
        document.documentElement.setAttribute('dir', 'rtl');
        
        // Apply RTL styles
        this.applyRTLStyles();
        
        // Update navigation order
        this.updateRTLNavigation();
        
        // Update form layouts
        this.updateRTLForms();
    }

    applyRTLStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rtl {
                direction: rtl;
                text-align: right;
            }
            
            .rtl .nav {
                flex-direction: row-reverse;
            }
            
            .rtl .nav-links {
                flex-direction: row-reverse;
            }
            
            .rtl .user-menu {
                margin-left: 0;
                margin-right: auto;
            }
            
            .rtl .hero-content {
                text-align: right;
            }
            
            .rtl .movie-card {
                text-align: right;
            }
            
            .rtl .movie-info h3,
            .rtl .movie-info h4 {
                text-align: right;
            }
            
            .rtl .movie-info p {
                text-align: right;
            }
            
            .rtl .search-input {
                text-align: right;
            }
            
            .rtl .modal-content {
                text-align: right;
            }
            
            .rtl .form-group {
                text-align: right;
            }
            
            .rtl .form-group label {
                text-align: right;
            }
            
            .rtl .form-group input,
            .rtl .form-group select,
            .rtl .form-group textarea {
                text-align: right;
            }
            
            .rtl .breadcrumb {
                flex-direction: row-reverse;
            }
            
            .rtl .page-header {
                text-align: right;
            }
            
            .rtl .page-title {
                text-align: right;
            }
            
            .rtl .page-subtitle {
                text-align: right;
            }
            
            .rtl .categories h3 {
                text-align: right;
            }
            
            .rtl .footer {
                text-align: right;
            }
            
            .rtl .footer-links {
                flex-direction: row-reverse;
            }
            
            .rtl .social-links {
                flex-direction: row-reverse;
            }
            
            .rtl .movie-actions {
                flex-direction: row-reverse;
            }
            
            .rtl .video-controls {
                flex-direction: row-reverse;
            }
            
            .rtl .video-controls-left {
                order: 2;
            }
            
            .rtl .video-controls-right {
                order: 1;
            }
            
            .rtl .mobile-menu-btn span {
                transform-origin: right center;
            }
            
            .rtl .search-results {
                text-align: right;
            }
            
            .rtl .search-result-item {
                text-align: right;
            }
            
            .rtl .search-result-item h4 {
                text-align: right;
            }
            
            .rtl .search-result-item p {
                text-align: right;
            }
            
            .rtl .notification {
                right: auto;
                left: 20px;
            }
            
            .rtl .back-button {
                left: auto;
                right: 20px;
            }
            
            .rtl .trending-badge {
                right: auto;
                left: 8px;
            }
            
            .rtl .movie-rating {
                flex-direction: row-reverse;
            }
            
            .rtl .series-info {
                flex-direction: row-reverse;
            }
            
            .rtl .trending-score {
                text-align: right;
            }
            
            .rtl .empty-list {
                text-align: right;
            }
            
            .rtl .empty-list h4 {
                text-align: right;
            }
            
            .rtl .empty-list p {
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }

    updateRTLNavigation() {
        // Update navigation order for RTL
        const nav = document.querySelector('.nav');
        if (nav) {
            const navLinks = nav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.order = 'unset';
            });
        }
    }

    updateRTLForms() {
        // Update form layouts for RTL
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.add('rtl-form');
        });
    }

    setupRTLListener() {
        // Listen for language changes
        document.addEventListener('languageChanged', (e) => {
            const newLang = e.detail.language;
            const isRTL = this.rtlLanguages.includes(newLang);
            
            if (isRTL) {
                this.enableRTL();
            } else {
                this.disableRTL();
            }
        });
    }

    disableRTL() {
        // Remove RTL class from body
        document.body.classList.remove('rtl');
        
        // Update document direction
        document.documentElement.setAttribute('dir', 'ltr');
        
        // Remove RTL styles
        const rtlStyle = document.querySelector('style[data-rtl]');
        if (rtlStyle) {
            rtlStyle.remove();
        }
    }

    // Date Formatting
    setupDateFormatting() {
        // Set up date formatting based on locale
        this.dateFormats = {
            'tr': {
                short: 'DD.MM.YYYY',
                long: 'DD MMMM YYYY',
                time: 'HH:mm'
            },
            'en': {
                short: 'MM/DD/YYYY',
                long: 'MMMM DD, YYYY',
                time: 'h:mm A'
            },
            'ar': {
                short: 'YYYY/MM/DD',
                long: 'DD MMMM YYYY',
                time: 'HH:mm'
            },
            'he': {
                short: 'DD/MM/YYYY',
                long: 'DD MMMM YYYY',
                time: 'HH:mm'
            },
            'fa': {
                short: 'YYYY/MM/DD',
                long: 'DD MMMM YYYY',
                time: 'HH:mm'
            }
        };
        
        // Set up date formatting functions
        this.setupDateFunctions();
    }

    setupDateFunctions() {
        // Format date based on current language
        this.formatDate = (date, format = 'short') => {
            const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
            const dateFormat = this.dateFormats[currentLang] || this.dateFormats['en'];
            
            if (typeof date === 'string') {
                date = new Date(date);
            }
            
            if (format === 'short') {
                return this.formatShortDate(date, dateFormat.short);
            } else if (format === 'long') {
                return this.formatLongDate(date, dateFormat.long);
            } else if (format === 'time') {
                return this.formatTime(date, dateFormat.time);
            }
            
            return date.toLocaleDateString();
        };
        
        // Format relative time
        this.formatRelativeTime = (date) => {
            const now = new Date();
            const diff = now - date;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
            
            if (currentLang === 'tr') {
                if (days > 0) return `${days} gün önce`;
                if (hours > 0) return `${hours} saat önce`;
                if (minutes > 0) return `${minutes} dakika önce`;
                return 'Az önce';
            } else if (currentLang === 'ar') {
                if (days > 0) return `منذ ${days} أيام`;
                if (hours > 0) return `منذ ${hours} ساعات`;
                if (minutes > 0) return `منذ ${minutes} دقائق`;
                return 'الآن';
            } else {
                if (days > 0) return `${days} days ago`;
                if (hours > 0) return `${hours} hours ago`;
                if (minutes > 0) return `${minutes} minutes ago`;
                return 'Just now';
            }
        };
    }

    formatShortDate(date, format) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    formatLongDate(date, format) {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const monthNames = {
            'tr': ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            'ar': ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            'he': ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
            'fa': ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر']
        };
        
        const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
        const monthName = monthNames[currentLang] || monthNames['en'];
        
        return format
            .replace('DD', day)
            .replace('MMMM', monthName[month])
            .replace('YYYY', year);
    }

    formatTime(date, format) {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        if (format.includes('A')) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes} ${ampm}`;
        } else {
            return `${hours}:${minutes}`;
        }
    }

    // PWA Features
    setupPWAFeatures() {
        // Register service worker
        this.registerServiceWorker();
        
        // Setup app manifest
        this.setupAppManifest();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup app shortcuts
        this.setupAppShortcuts();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                    this.serviceWorkerRegistration = registration;
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    setupAppManifest() {
        // Create app manifest
        const manifest = {
            name: 'StreamMax - Premium Film ve Dizi Platformu',
            short_name: 'StreamMax',
            description: 'Sınırsız film, dizi ve çok daha fazlası',
            start_url: '/',
            display: 'standalone',
            background_color: '#000000',
            theme_color: '#e50914',
            orientation: 'portrait-primary',
            icons: [
                {
                    src: '/icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            categories: ['entertainment', 'video', 'streaming'],
            lang: 'tr',
            dir: 'ltr'
        };
        
        // Add manifest to page
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = 'data:application/json;base64,' + btoa(JSON.stringify(manifest));
        document.head.appendChild(manifestLink);
    }

    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Show install button
            this.showInstallButton();
        });
        
        // Listen for appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.trackEvent('pwa_installed', {});
        });
    }

    showInstallButton() {
        // Create install button
        const installButton = document.createElement('button');
        installButton.className = 'btn btn-primary install-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i> Uygulamayı Yükle';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        installButton.addEventListener('click', () => {
            this.installApp();
        });
        
        document.body.appendChild(installButton);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.style.opacity = '0';
                setTimeout(() => {
                    if (installButton.parentNode) {
                        installButton.remove();
                    }
                }, 300);
            }
        }, 10000);
    }

    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    this.trackEvent('pwa_install_accepted', {});
                } else {
                    console.log('User dismissed the install prompt');
                    this.trackEvent('pwa_install_dismissed', {});
                }
                this.deferredPrompt = null;
            });
        }
    }

    setupAppShortcuts() {
        // Setup app shortcuts for quick access
        if ('navigator' in window && 'setAppBadge' in navigator) {
            // Set app badge for notifications
            this.setupAppBadge();
        }
    }

    setupAppBadge() {
        // Set app badge when there are new notifications
        this.setBadge = (count) => {
            if ('navigator' in window && 'setAppBadge' in navigator) {
                navigator.setAppBadge(count);
            }
        };
        
        // Clear app badge
        this.clearBadge = () => {
            if ('navigator' in window && 'clearAppBadge' in navigator) {
                navigator.clearAppBadge();
            }
        };
    }

    // Offline Support
    setupOfflineSupport() {
        // Setup offline detection
        this.setupOfflineDetection();
        
        // Setup offline storage
        this.setupOfflineStorage();
        
        // Setup offline content
        this.setupOfflineContent();
    }

    setupOfflineDetection() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleOffline();
        });
        
        // Check initial status
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }

    handleOnline() {
        console.log('Connection restored');
        this.showNotification('İnternet bağlantısı yeniden kuruldu', 'success');
        
        // Sync offline data
        this.syncOfflineData();
        
        // Update UI
        this.updateOnlineStatus(true);
    }

    handleOffline() {
        console.log('Connection lost');
        this.showNotification('İnternet bağlantısı kesildi. Offline moda geçiliyor...', 'warning');
        
        // Update UI
        this.updateOnlineStatus(false);
    }

    updateOnlineStatus(isOnline) {
        const statusIndicator = document.querySelector('.connection-status');
        if (statusIndicator) {
            statusIndicator.textContent = isOnline ? 'Çevrimiçi' : 'Çevrimdışı';
            statusIndicator.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
        }
    }

    setupOfflineStorage() {
        // Setup IndexedDB for offline storage
        this.setupIndexedDB();
        
        // Setup offline data sync
        this.setupOfflineSync();
    }

    setupIndexedDB() {
        // Create IndexedDB database
        const request = indexedDB.open('StreamMaxOffline', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('movies')) {
                db.createObjectStore('movies', { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains('userData')) {
                db.createObjectStore('userData', { keyPath: 'key' });
            }
            
            if (!db.objectStoreNames.contains('searchHistory')) {
                db.createObjectStore('searchHistory', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('IndexedDB opened successfully');
        };
        
        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
        };
    }

    setupOfflineSync() {
        // Sync offline data when online
        this.syncOfflineData = () => {
            if (this.db) {
                // Sync movies data
                this.syncMoviesData();
                
                // Sync user data
                this.syncUserData();
                
                // Sync search history
                this.syncSearchHistory();
            }
        };
    }

    syncMoviesData() {
        // Sync movies data from offline storage
        const transaction = this.db.transaction(['movies'], 'readonly');
        const store = transaction.objectStore('movies');
        const request = store.getAll();
        
        request.onsuccess = (event) => {
            const movies = event.target.result;
            if (movies.length > 0) {
                console.log('Syncing movies data:', movies.length);
                // Update local storage with synced data
                localStorage.setItem('offlineMovies', JSON.stringify(movies));
            }
        };
    }

    syncUserData() {
        // Sync user data from offline storage
        const transaction = this.db.transaction(['userData'], 'readonly');
        const store = transaction.objectStore('userData');
        const request = store.getAll();
        
        request.onsuccess = (event) => {
            const userData = event.target.result;
            if (userData.length > 0) {
                console.log('Syncing user data:', userData.length);
                // Update local storage with synced data
                userData.forEach(item => {
                    localStorage.setItem(item.key, item.value);
                });
            }
        };
    }

    syncSearchHistory() {
        // Sync search history from offline storage
        const transaction = this.db.transaction(['searchHistory'], 'readonly');
        const store = transaction.objectStore('searchHistory');
        const request = store.getAll();
        
        request.onsuccess = (event) => {
            const searchHistory = event.target.result;
            if (searchHistory.length > 0) {
                console.log('Syncing search history:', searchHistory.length);
                // Update local storage with synced data
                const history = searchHistory.map(item => item.query);
                localStorage.setItem('searchHistory', JSON.stringify(history));
            }
        };
    }

    setupOfflineContent() {
        // Cache essential content for offline viewing
        this.cacheEssentialContent();
        
        // Setup offline fallbacks
        this.setupOfflineFallbacks();
    }

    cacheEssentialContent() {
        // Cache essential CSS and JS files
        const essentialFiles = [
            'css/style.css',
            'js/main.js',
            'index.html'
        ];
        
        essentialFiles.forEach(file => {
            this.cacheFile(file);
        });
    }

    cacheFile(url) {
        // Cache file using Cache API
        if ('caches' in window) {
            caches.open('streammax-cache-v1').then(cache => {
                cache.add(url).catch(error => {
                    console.log('Failed to cache file:', url, error);
                });
            });
        }
    }

    setupOfflineFallbacks() {
        // Setup offline fallback pages
        this.setupOfflinePage();
        
        // Setup offline movie data
        this.setupOfflineMovieData();
    }

    setupOfflinePage() {
        // Create offline page content
        const offlineContent = `
            <div class="offline-page">
                <div class="offline-content">
                    <i class="fas fa-wifi-slash"></i>
                    <h2>Çevrimdışısınız</h2>
                    <p>İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-refresh"></i>
                        Yeniden Dene
                    </button>
                </div>
            </div>
        `;
        
        // Store offline content
        localStorage.setItem('offlineContent', offlineContent);
    }

    setupOfflineMovieData() {
        // Store essential movie data for offline viewing
        const movieDatabase = this.getMovieDatabase();
        const essentialMovies = Object.values(movieDatabase).slice(0, 20); // First 20 movies
        
        localStorage.setItem('offlineMovies', JSON.stringify(essentialMovies));
    }

    // Push Notifications
    setupPushNotifications() {
        // Request notification permission
        this.requestNotificationPermission();
        
        // Setup notification handlers
        this.setupNotificationHandlers();
        
        // Setup notification display
        this.setupNotificationDisplay();
    }

    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    this.setupNotificationService();
                } else {
                    console.log('Notification permission denied');
                }
            });
        }
    }

    setupNotificationService() {
        // Setup service worker for push notifications
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // Subscribe to push notifications
                this.subscribeToPushNotifications(registration);
            });
        }
    }

    subscribeToPushNotifications(registration) {
        // Subscribe to push notifications
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
        }).then(subscription => {
            console.log('Push subscription:', subscription);
            this.pushSubscription = subscription;
            
            // Send subscription to server
            this.sendSubscriptionToServer(subscription);
        }).catch(error => {
            console.error('Push subscription failed:', error);
        });
    }

    sendSubscriptionToServer(subscription) {
        // Send subscription to server
        fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        }).catch(error => {
            console.error('Failed to send subscription to server:', error);
        });
    }

    setupNotificationHandlers() {
        // Handle notification clicks
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'NOTIFICATION_CLICK') {
                    this.handleNotificationClick(event.data);
                }
            });
        }
    }

    handleNotificationClick(data) {
        // Handle notification click
        if (data.action === 'open_movie') {
            this.openVideoPlayer(data.movieId);
        } else if (data.action === 'open_page') {
            this.navigateToPage(data.pageId);
        }
    }

    setupNotificationDisplay() {
        // Display local notifications
        this.showNotification = (message, type = 'info') => {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--gradient-primary);
                color: var(--darker-bg);
                padding: 15px 20px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        };
    }

    setupGlobalReference() {
        // Global referans oluştur
        window.streamMaxApp = this;
        console.log('StreamMax global referansı oluşturuldu');
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA labels
        this.setupARIALabels();
        
        // Skip links
        this.setupSkipLinks();
        
        // XSS Protection
        this.setupXSSProtection();
        
        // Search History
        this.setupSearchHistory();
    }

    handleKeyboardNavigation(e) {
        // Tab navigation
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
        
        // Enter/Space for buttons
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('btn') || activeElement.classList.contains('nav-link')) {
                e.preventDefault();
                activeElement.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            this.handleArrowNavigation(e);
        }
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    handleArrowNavigation(e) {
        const movieCards = document.querySelectorAll('.movie-card');
        const currentIndex = Array.from(movieCards).indexOf(document.activeElement);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            movieCards[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < movieCards.length - 1) {
            movieCards[currentIndex + 1].focus();
        }
    }

    setupFocusManagement() {
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.movie-modal.show, .video-player-modal.show');
                if (modal) {
                    this.trapFocus(modal, e);
                }
            }
        });
    }

    trapFocus(element, e) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupARIALabels() {
        // Add ARIA labels to interactive elements
        const playButtons = document.querySelectorAll('.btn-play');
        playButtons.forEach(btn => {
            btn.setAttribute('aria-label', 'Film oynat');
        });
        
        const addButtons = document.querySelectorAll('.btn-add');
        addButtons.forEach(btn => {
            btn.setAttribute('aria-label', 'Listeme ekle');
        });
        
        const likeButtons = document.querySelectorAll('.btn-like');
        likeButtons.forEach(btn => {
            btn.setAttribute('aria-label', 'Beğen');
        });
        
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Film, dizi, oyuncu ara');
        }
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-label', 'Menüyü aç/kapat');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    setupSkipLinks() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Ana içeriğe geç';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: var(--darker-bg);
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.movie-modal, .video-player-modal, .subtitle-settings-modal');
        modals.forEach(modal => {
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
        
        // Close mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.querySelector('.nav');
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupXSSProtection() {
        // Sanitize user input
        this.sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            // Remove script tags and event handlers
            return input
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/data:/gi, '');
        };
        
        // Override innerHTML to sanitize content
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                const sanitizedValue = this.sanitizeInput ? this.sanitizeInput(value) : value;
                originalInnerHTML.set.call(this, sanitizedValue);
            },
            get: originalInnerHTML.get
        });
        
        // Content Security Policy headers (would be set server-side)
        this.setupCSP();
    }

    setupCSP() {
        // Add Content Security Policy meta tag
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';";
        document.head.appendChild(cspMeta);
    }

    // Search History System
    setupSearchHistory() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.maxHistoryItems = 10;
    }

    addToSearchHistory(query) {
        if (!query || query.trim() === '') return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only max items
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    getSearchHistory() {
        return this.searchHistory;
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
    }

    showSearchHistory() {
        const searchInput = document.getElementById('searchInput');
        const historyContainer = document.getElementById('searchHistoryContainer');
        
        if (!searchInput || !historyContainer) return;
        
        const history = this.getSearchHistory();
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">Arama geçmişi yok</div>';
            return;
        }
        
        historyContainer.innerHTML = history.map(item => 
            `<div class="history-item" data-query="${item}">${item}</div>`
        ).join('');
        
        // Add click handlers
        historyContainer.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.dataset.query;
                this.performSearch(item.dataset.query);
                this.hideSearchHistory();
            });
        });
    }

    hideSearchHistory() {
        const historyContainer = document.getElementById('searchHistoryContainer');
        if (historyContainer) {
            historyContainer.style.display = 'none';
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                nav.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close mobile menu when clicking on nav links
            const navLinks = nav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupNavigationLinks() {
        console.log('Navigasyon linkleri kontrol ediliyor...');
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`${navLinks.length} adet navigasyon linki bulundu`);
        
        // button-activator.js zaten navigasyonu yönetiyor
        // Bu fonksiyon sadece kontrol amaçlı
        navLinks.forEach((link, index) => {
            console.log(`Link ${index + 1}: ${link.textContent.trim()} - button-activator.js tarafından yönetiliyor`);
        });
        
        console.log('Navigasyon linkleri button-activator.js tarafından yönetiliyor!');
        
        // Test navigasyon butonları (opsiyonel)
        // this.testNavigationButtons();
    }

    testNavigationButtons() {
        console.log('Navigasyon butonları test ediliyor...');
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            const text = link.textContent.trim();
            const hasClickListener = link.onclick !== null || link.addEventListener;
            console.log(`Test ${index + 1}: ${text} - Event listener: ${hasClickListener ? 'VAR' : 'YOK'}`);
        });
        
        // Manuel test butonu ekle (geliştirme için)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.addTestButton();
        }
    }

    addTestButton() {
        // Geliştirme için test butonu
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Test Nav';
        testBtn.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            background: red;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        
        testBtn.addEventListener('click', () => {
            console.log('Test butonu tıklandı - Navigasyon linklerini test ediyor...');
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                console.log(`Link ${index + 1}: ${link.textContent.trim()}`);
                // Simulate click
                link.click();
                setTimeout(() => {
                    console.log(`Link ${index + 1} tıklandı`);
                }, 100);
            });
        });
        
        document.body.appendChild(testBtn);
    }

    setupUserDropdownItems() {
        console.log('Kullanıcı dropdown öğeleri kuruluyor...');
        const dropdownItems = document.querySelectorAll('.dropdown-item:not(.language-item)');
        console.log(`${dropdownItems.length} adet dropdown öğesi bulundu`);
        
        dropdownItems.forEach((item, index) => {
            // Önce mevcut event listener'ları temizle
            item.removeEventListener('click', this.handleDropdownItemClick);
            
            // Yeni event listener ekle
            item.addEventListener('click', (e) => {
                console.log(`Dropdown öğesi tıklandı: ${item.textContent.trim()}`);
                this.handleDropdownItemClick(e);
            });
            
            // Debug için
            console.log(`Dropdown öğesi ${index + 1}: ${item.textContent.trim()} - Event listener eklendi`);
        });
        
        console.log('Kullanıcı dropdown öğeleri başarıyla kuruldu!');
    }

    setupLanguageDropdown() {
        const languageItem = document.querySelector('#languageItem');
        const languageDropdown = document.querySelector('#languageDropdown');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (languageItem && languageDropdown) {
            // Toggle language dropdown
            languageItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = languageItem.classList.contains('active');
                
                if (isActive) {
                    languageItem.classList.remove('active');
                    languageDropdown.classList.remove('show');
                } else {
                    // Close other dropdowns first
                    document.querySelectorAll('.language-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    document.querySelectorAll('.language-dropdown').forEach(dropdown => {
                        dropdown.classList.remove('show');
                    });
                    
                    languageItem.classList.add('active');
                    languageDropdown.classList.add('show');
                }
            });
            
            // Language option selection
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const lang = option.getAttribute('data-lang');
                    this.changeLanguage(lang);
                    
                    // Update active state
                    languageOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    // Close dropdown
                    languageItem.classList.remove('active');
                    languageDropdown.classList.remove('show');
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!languageItem.contains(e.target)) {
                    languageItem.classList.remove('active');
                    languageDropdown.classList.remove('show');
                }
            });
        }
    }

    changeLanguage(lang) {
        const languages = {
            'tr': {
                // Page title
                'title': 'StreamMax - Premium Film ve Dizi Platformu',
                
                // Navigation
                'nav.home': 'Ana Sayfa',
                'nav.series': 'Diziler',
                'nav.movies': 'Filmler',
                'nav.trending': 'Yeni & Popüler',
                'nav.mylist': 'Listem',
                
                // Search
                'search.placeholder': 'Film, dizi, oyuncu ara...',
                
                // Hero section
                'hero.title': 'Sınırsız Film, Dizi ve Çok Daha Fazlası',
                'hero.subtitle': 'İstediğiniz yerde izleyin. İstediğiniz zaman iptal edin.',
                'hero.play': 'Oynat',
                'hero.info': 'Daha Fazla Bilgi',
                
                // Categories
                'categories.trending': 'Trend Olanlar',
                'categories.new': 'Yeni Çıkanlar',
                
                // Footer
                'footer.tagline': 'Sınırsız eğlence, istediğiniz yerde.',
                'footer.about': 'Hakkında',
                'footer.about_us': 'Hakkımızda',
                'footer.careers': 'Kariyer',
                'footer.press': 'Basın',
                'footer.investors': 'Yatırımcılar',
                'footer.support': 'Destek',
                'footer.help': 'Yardım',
                'footer.contact': 'İletişim',
                'footer.legal': 'Yasal',
                'footer.terms': 'Kullanım Şartları',
                'footer.privacy': 'Gizlilik',
                'footer.cookies': 'Çerezler',
                'footer.copyright': '© 2024 StreamMax. Tüm hakları saklıdır.',
                
                // User menu
                'login': 'Giriş Yap',
                'profile': 'Profil',
                'settings': 'Ayarlar',
                'help': 'Yardım',
                'logout': 'Çıkış Yap',
                'language': 'Dil',
                
                // Modal translations
                'modal.login.title': 'Giriş Yap',
                'modal.login.email': 'E-posta Adresi',
                'modal.login.email_placeholder': 'ornek@email.com',
                'modal.login.password': 'Şifre',
                'modal.login.password_placeholder': 'Şifrenizi girin',
                'modal.login.remember': 'Beni hatırla',
                'modal.login.forgot': 'Şifremi unuttum',
                'modal.login.submit': 'Giriş Yap',
                'modal.login.register': 'Kayıt Ol',
                'modal.login.social_text': 'Veya sosyal medya ile giriş yap',
                'modal.login.google': 'Google',
                'modal.login.facebook': 'Facebook',
                'modal.login.vk': 'VK',
                'modal.login.apple': 'Apple',
                'modal.login.x': 'X',
                
                // Profile modal
                'modal.profile.title': 'Profil Bilgileri',
                'modal.profile.user_profile': 'Kullanıcı Profili',
                'modal.profile.email': 'Email:',
                'modal.profile.membership': 'Üyelik:',
                'modal.profile.premium': 'Premium',
                'modal.profile.last_login': 'Son Giriş:',
                'modal.profile.today': 'Bugün',
                'modal.profile.edit_profile': 'Profili Düzenle',
                'modal.profile.change_password': 'Şifre Değiştir',
                
                // Settings modal
                'modal.settings.title': 'Ayarlar',
                'modal.settings.display_settings': 'Görüntü Ayarları',
                'modal.settings.video_quality': 'Video Kalitesi:',
                'modal.settings.auto': 'Otomatik',
                'modal.settings.subtitles': 'Altyazı:',
                'modal.settings.turkish': 'Türkçe',
                'modal.settings.english': 'İngilizce',
                'modal.settings.off': 'Kapalı',
                'modal.settings.spanish': 'İspanyolca',
                'modal.settings.french': 'Fransızca',
                'modal.settings.german': 'Almanca',
                'modal.settings.italian': 'İtalyanca',
                'modal.settings.portuguese': 'Portekizce',
                'modal.settings.russian': 'Rusça',
                'modal.settings.chinese': 'Çince',
                'modal.settings.japanese': 'Japonca',
                'modal.settings.korean': 'Korece',
                'modal.settings.arabic': 'Arapça',
                'modal.settings.hindi': 'Hintçe',
                'modal.settings.dutch': 'Flemenkçe',
                'modal.settings.swedish': 'İsveççe',
                'modal.settings.norwegian': 'Norveççe',
                'modal.settings.danish': 'Danca',
                'modal.settings.finnish': 'Fince',
                'modal.settings.polish': 'Lehçe',
                'modal.settings.save': 'Kaydet',
                'modal.settings.reset': 'Sıfırla',
                
                // Help modal
                'modal.help.title': 'Yardım Merkezi',
                'modal.help.faq': 'Sık Sorulan Sorular',
                'modal.help.faq1_question': 'Nasıl film izleyebilirim?',
                'modal.help.faq1_answer': 'Film kartına tıklayarak veya oynat butonuna basarak filmi izleyebilirsiniz.',
                'modal.help.faq2_question': 'İzleme listeme nasıl eklerim?',
                'modal.help.faq2_answer': 'Film kartındaki + butonuna tıklayarak izleme listenize ekleyebilirsiniz.',
                'modal.help.faq3_question': 'Nasıl arama yapabilirim?',
                'modal.help.faq3_answer': 'Üst kısımdaki arama çubuğunu kullanarak film ve dizi arayabilirsiniz.',
                'modal.help.contact_support': 'Destek İletişim',
                'modal.help.live_support': 'Canlı Destek'
            },
            'en': {
                // Page title
                'title': 'StreamMax - Premium Movie and Series Platform',
                
                // Navigation
                'nav.home': 'Home',
                'nav.series': 'Series',
                'nav.movies': 'Movies',
                'nav.trending': 'New & Popular',
                'nav.mylist': 'My List',
                
                // Search
                'search.placeholder': 'Search movies, series, actors...',
                
                // Hero section
                'hero.title': 'Unlimited Movies, Series and Much More',
                'hero.subtitle': 'Watch anywhere. Cancel anytime.',
                'hero.play': 'Play',
                'hero.info': 'More Info',
                
                // Categories
                'categories.trending': 'Trending Now',
                'categories.new': 'New Releases',
                
                // Footer
                'footer.tagline': 'Unlimited entertainment, wherever you are.',
                'footer.about': 'About',
                'footer.about_us': 'About Us',
                'footer.careers': 'Careers',
                'footer.press': 'Press',
                'footer.investors': 'Investors',
                'footer.support': 'Support',
                'footer.help': 'Help',
                'footer.contact': 'Contact',
                'footer.legal': 'Legal',
                'footer.terms': 'Terms of Use',
                'footer.privacy': 'Privacy',
                'footer.cookies': 'Cookies',
                'footer.copyright': '© 2024 StreamMax. All rights reserved.',
                
                // User menu
                'login': 'Sign In',
                'profile': 'Profile',
                'settings': 'Settings',
                'help': 'Help',
                'logout': 'Sign Out',
                'language': 'Language',
                
                // Modal translations
                'modal.login.title': 'Sign In',
                'modal.login.email': 'Email Address',
                'modal.login.email_placeholder': 'example@email.com',
                'modal.login.password': 'Password',
                'modal.login.password_placeholder': 'Enter your password',
                'modal.login.remember': 'Remember me',
                'modal.login.forgot': 'Forgot password',
                'modal.login.submit': 'Sign In',
                'modal.login.register': 'Sign Up',
                'modal.login.social_text': 'Or sign in with social media',
                'modal.login.google': 'Google',
                'modal.login.facebook': 'Facebook',
                'modal.login.vk': 'VK',
                'modal.login.apple': 'Apple',
                'modal.login.x': 'X',
                
                // Profile modal
                'modal.profile.title': 'Profile Information',
                'modal.profile.user_profile': 'User Profile',
                'modal.profile.email': 'Email:',
                'modal.profile.membership': 'Membership:',
                'modal.profile.premium': 'Premium',
                'modal.profile.last_login': 'Last Login:',
                'modal.profile.today': 'Today',
                'modal.profile.edit_profile': 'Edit Profile',
                'modal.profile.change_password': 'Change Password',
                
                // Settings modal
                'modal.settings.title': 'Settings',
                'modal.settings.display_settings': 'Display Settings',
                'modal.settings.video_quality': 'Video Quality:',
                'modal.settings.auto': 'Auto',
                'modal.settings.subtitles': 'Subtitles:',
                'modal.settings.turkish': 'Turkish',
                'modal.settings.english': 'English',
                'modal.settings.off': 'Off',
                'modal.settings.spanish': 'Spanish',
                'modal.settings.french': 'French',
                'modal.settings.german': 'German',
                'modal.settings.italian': 'Italian',
                'modal.settings.portuguese': 'Portuguese',
                'modal.settings.russian': 'Russian',
                'modal.settings.chinese': 'Chinese',
                'modal.settings.japanese': 'Japanese',
                'modal.settings.korean': 'Korean',
                'modal.settings.arabic': 'Arabic',
                'modal.settings.hindi': 'Hindi',
                'modal.settings.dutch': 'Dutch',
                'modal.settings.swedish': 'Swedish',
                'modal.settings.norwegian': 'Norwegian',
                'modal.settings.danish': 'Danish',
                'modal.settings.finnish': 'Finnish',
                'modal.settings.polish': 'Polish',
                'modal.settings.save': 'Save',
                'modal.settings.reset': 'Reset',
                
                // Help modal
                'modal.help.title': 'Help Center',
                'modal.help.faq': 'Frequently Asked Questions',
                'modal.help.faq1_question': 'How can I watch movies?',
                'modal.help.faq1_answer': 'You can watch movies by clicking on the movie card or pressing the play button.',
                'modal.help.faq2_question': 'How do I add to my watchlist?',
                'modal.help.faq2_answer': 'You can add to your watchlist by clicking the + button on the movie card.',
                'modal.help.faq3_question': 'How can I search?',
                'modal.help.faq3_answer': 'You can search for movies and series using the search bar at the top.',
                'modal.help.contact_support': 'Contact Support',
                'modal.help.live_support': 'Live Support'
            },
            'es': {
                // Page title
                'title': 'StreamMax - Plataforma Premium de Películas y Series',
                
                // Navigation
                'nav.home': 'Inicio',
                'nav.series': 'Series',
                'nav.movies': 'Películas',
                'nav.trending': 'Nuevo y Popular',
                'nav.mylist': 'Mi Lista',
                
                // Search
                'search.placeholder': 'Buscar películas, series, actores...',
                
                // Hero section
                'hero.title': 'Películas, Series y Mucho Más Sin Límites',
                'hero.subtitle': 'Mira donde quieras. Cancela cuando quieras.',
                'hero.play': 'Reproducir',
                'hero.info': 'Más Información',
                
                // Categories
                'categories.trending': 'Tendencias',
                'categories.new': 'Nuevos Lanzamientos',
                
                // Footer
                'footer.tagline': 'Entretenimiento ilimitado, donde quieras.',
                'footer.about': 'Acerca de',
                'footer.about_us': 'Acerca de Nosotros',
                'footer.careers': 'Carreras',
                'footer.press': 'Prensa',
                'footer.investors': 'Inversores',
                'footer.support': 'Soporte',
                'footer.help': 'Ayuda',
                'footer.contact': 'Contacto',
                'footer.legal': 'Legal',
                'footer.terms': 'Términos de Uso',
                'footer.privacy': 'Privacidad',
                'footer.cookies': 'Cookies',
                'footer.copyright': '© 2024 StreamMax. Todos los derechos reservados.',
                
                // User menu
                'login': 'Iniciar Sesión',
                'profile': 'Perfil',
                'settings': 'Configuración',
                'help': 'Ayuda',
                'logout': 'Cerrar Sesión',
                'language': 'Idioma'
            },
            'fr': {
                // Page title
                'title': 'StreamMax - Plateforme Premium de Films et Séries',
                
                // Navigation
                'nav.home': 'Accueil',
                'nav.series': 'Séries',
                'nav.movies': 'Films',
                'nav.trending': 'Nouveau et Populaire',
                'nav.mylist': 'Ma Liste',
                
                // Search
                'search.placeholder': 'Rechercher films, séries, acteurs...',
                
                // Hero section
                'hero.title': 'Films, Séries et Bien Plus Sans Limite',
                'hero.subtitle': 'Regardez où vous voulez. Annulez quand vous voulez.',
                'hero.play': 'Lire',
                'hero.info': 'Plus d\'Informations',
                
                // Categories
                'categories.trending': 'Tendances',
                'categories.new': 'Nouveautés',
                
                // Footer
                'footer.tagline': 'Divertissement illimité, où vous voulez.',
                'footer.about': 'À Propos',
                'footer.about_us': 'À Propos de Nous',
                'footer.careers': 'Carrières',
                'footer.press': 'Presse',
                'footer.investors': 'Investisseurs',
                'footer.support': 'Support',
                'footer.help': 'Aide',
                'footer.contact': 'Contact',
                'footer.legal': 'Légal',
                'footer.terms': 'Conditions d\'Utilisation',
                'footer.privacy': 'Confidentialité',
                'footer.cookies': 'Cookies',
                'footer.copyright': '© 2024 StreamMax. Tous droits réservés.',
                
                // User menu
                'login': 'Se Connecter',
                'profile': 'Profil',
                'settings': 'Paramètres',
                'help': 'Aide',
                'logout': 'Se Déconnecter',
                'language': 'Langue'
            },
            'de': {
                // Page title
                'title': 'StreamMax - Premium Film- und Serienplattform',
                
                // Navigation
                'nav.home': 'Startseite',
                'nav.series': 'Serien',
                'nav.movies': 'Filme',
                'nav.trending': 'Neu & Beliebt',
                'nav.mylist': 'Meine Liste',
                
                // Search
                'search.placeholder': 'Filme, Serien, Schauspieler suchen...',
                
                // Hero section
                'hero.title': 'Unbegrenzte Filme, Serien und Vieles Mehr',
                'hero.subtitle': 'Schauen Sie, wo Sie wollen. Kündigen Sie, wann Sie wollen.',
                'hero.play': 'Abspielen',
                'hero.info': 'Weitere Informationen',
                
                // Categories
                'categories.trending': 'Trending',
                'categories.new': 'Neuerscheinungen',
                
                // Footer
                'footer.tagline': 'Unbegrenzte Unterhaltung, wo Sie wollen.',
                'footer.about': 'Über uns',
                'footer.about_us': 'Über uns',
                'footer.careers': 'Karriere',
                'footer.press': 'Presse',
                'footer.investors': 'Investoren',
                'footer.support': 'Support',
                'footer.help': 'Hilfe',
                'footer.contact': 'Kontakt',
                'footer.legal': 'Rechtliches',
                'footer.terms': 'Nutzungsbedingungen',
                'footer.privacy': 'Datenschutz',
                'footer.cookies': 'Cookies',
                'footer.copyright': '© 2024 StreamMax. Alle Rechte vorbehalten.',
                
                // User menu
                'login': 'Anmelden',
                'profile': 'Profil',
                'settings': 'Einstellungen',
                'help': 'Hilfe',
                'logout': 'Abmelden',
                'language': 'Sprache'
            },
            'it': {
                // Page title
                'title': 'StreamMax - Piattaforma Premium di Film e Serie',
                
                // Navigation
                'nav.home': 'Home',
                'nav.series': 'Serie',
                'nav.movies': 'Film',
                'nav.trending': 'Nuovo e Popolare',
                'nav.mylist': 'La Mia Lista',
                
                // Search
                'search.placeholder': 'Cerca film, serie, attori...',
                
                // Hero section
                'hero.title': 'Film, Serie e Molto Altro Senza Limiti',
                'hero.subtitle': 'Guarda dove vuoi. Annulla quando vuoi.',
                'hero.play': 'Riproduci',
                'hero.info': 'Maggiori Informazioni',
                
                // Categories
                'categories.trending': 'Tendenze',
                'categories.new': 'Nuove Uscite',
                
                // Footer
                'footer.tagline': 'Intrattenimento illimitato, dove vuoi.',
                'footer.about': 'Chi Siamo',
                'footer.about_us': 'Chi Siamo',
                'footer.careers': 'Carriere',
                'footer.press': 'Stampa',
                'footer.investors': 'Investitori',
                'footer.support': 'Supporto',
                'footer.help': 'Aiuto',
                'footer.contact': 'Contatto',
                'footer.legal': 'Legale',
                'footer.terms': 'Termini di Utilizzo',
                'footer.privacy': 'Privacy',
                'footer.cookies': 'Cookie',
                'footer.copyright': '© 2024 StreamMax. Tutti i diritti riservati.',
                
                // User menu
                'login': 'Accedi',
                'profile': 'Profilo',
                'settings': 'Impostazioni',
                'help': 'Aiuto',
                'logout': 'Disconnetti',
                'language': 'Lingua'
            },
            'pt': {
                // Page title
                'title': 'StreamMax - Plataforma Premium de Filmes e Séries',
                
                // Navigation
                'nav.home': 'Início',
                'nav.series': 'Séries',
                'nav.movies': 'Filmes',
                'nav.trending': 'Novo e Popular',
                'nav.mylist': 'Minha Lista',
                
                // Search
                'search.placeholder': 'Pesquisar filmes, séries, atores...',
                
                // Hero section
                'hero.title': 'Filmes, Séries e Muito Mais Sem Limites',
                'hero.subtitle': 'Assista onde quiser. Cancele quando quiser.',
                'hero.play': 'Reproduzir',
                'hero.info': 'Mais Informações',
                
                // Categories
                'categories.trending': 'Em Alta',
                'categories.new': 'Novos Lançamentos',
                
                // Footer
                'footer.tagline': 'Entretenimento ilimitado, onde você quiser.',
                'footer.about': 'Sobre',
                'footer.about_us': 'Sobre Nós',
                'footer.careers': 'Carreiras',
                'footer.press': 'Imprensa',
                'footer.investors': 'Investidores',
                'footer.support': 'Suporte',
                'footer.help': 'Ajuda',
                'footer.contact': 'Contato',
                'footer.legal': 'Legal',
                'footer.terms': 'Termos de Uso',
                'footer.privacy': 'Privacidade',
                'footer.cookies': 'Cookies',
                'footer.copyright': '© 2024 StreamMax. Todos os direitos reservados.',
                
                // User menu
                'login': 'Entrar',
                'profile': 'Perfil',
                'settings': 'Configurações',
                'help': 'Ajuda',
                'logout': 'Sair',
                'language': 'Idioma'
            },
            'ru': {
                // Page title
                'title': 'StreamMax - Премиум Платформа Фильмов и Сериалов',
                
                // Navigation
                'nav.home': 'Главная',
                'nav.series': 'Сериалы',
                'nav.movies': 'Фильмы',
                'nav.trending': 'Новое и Популярное',
                'nav.mylist': 'Мой Список',
                
                // Search
                'search.placeholder': 'Поиск фильмов, сериалов, актеров...',
                
                // Hero section
                'hero.title': 'Безлимитные Фильмы, Сериалы и Многое Другое',
                'hero.subtitle': 'Смотрите где угодно. Отменяйте когда угодно.',
                'hero.play': 'Играть',
                'hero.info': 'Больше Информации',
                
                // Categories
                'categories.trending': 'В Тренде',
                'categories.new': 'Новые Релизы',
                
                // Footer
                'footer.tagline': 'Безлимитные развлечения, где угодно.',
                'footer.about': 'О нас',
                'footer.about_us': 'О нас',
                'footer.careers': 'Карьера',
                'footer.press': 'Пресса',
                'footer.investors': 'Инвесторы',
                'footer.support': 'Поддержка',
                'footer.help': 'Помощь',
                'footer.contact': 'Контакты',
                'footer.legal': 'Правовая информация',
                'footer.terms': 'Условия использования',
                'footer.privacy': 'Конфиденциальность',
                'footer.cookies': 'Куки',
                'footer.copyright': '© 2024 StreamMax. Все права защищены.',
                
                // User menu
                'login': 'Войти',
                'profile': 'Профиль',
                'settings': 'Настройки',
                'help': 'Помощь',
                'logout': 'Выйти',
                'language': 'Язык'
            },
            'zh': {
                // Page title
                'title': 'StreamMax - 优质电影和剧集平台',
                
                // Navigation
                'nav.home': '首页',
                'nav.series': '剧集',
                'nav.movies': '电影',
                'nav.trending': '新片和热门',
                'nav.mylist': '我的列表',
                
                // Search
                'search.placeholder': '搜索电影、剧集、演员...',
                
                // Hero section
                'hero.title': '无限电影、剧集和更多内容',
                'hero.subtitle': '随时随地观看。随时取消。',
                'hero.play': '播放',
                'hero.info': '更多信息',
                
                // Categories
                'categories.trending': '热门趋势',
                'categories.new': '新片上映',
                
                // Footer
                'footer.tagline': '无限娱乐，随时随地。',
                'footer.about': '关于我们',
                'footer.about_us': '关于我们',
                'footer.careers': '职业机会',
                'footer.press': '新闻中心',
                'footer.investors': '投资者',
                'footer.support': '支持',
                'footer.help': '帮助',
                'footer.contact': '联系我们',
                'footer.legal': '法律信息',
                'footer.terms': '使用条款',
                'footer.privacy': '隐私政策',
                'footer.cookies': 'Cookie',
                'footer.copyright': '© 2024 StreamMax. 版权所有。',
                
                // User menu
                'login': '登录',
                'profile': '个人资料',
                'settings': '设置',
                'help': '帮助',
                'logout': '退出',
                'language': '语言'
            },
            'ja': {
                // Page title
                'title': 'StreamMax - プレミアム映画・ドラマプラットフォーム',
                
                // Navigation
                'nav.home': 'ホーム',
                'nav.series': 'ドラマ',
                'nav.movies': '映画',
                'nav.trending': '新着・人気',
                'nav.mylist': 'マイリスト',
                
                // Search
                'search.placeholder': '映画、ドラマ、俳優を検索...',
                
                // Hero section
                'hero.title': '無制限の映画、ドラマ、そしてもっと',
                'hero.subtitle': 'どこでも視聴。いつでもキャンセル。',
                'hero.play': '再生',
                'hero.info': '詳細情報',
                
                // Categories
                'categories.trending': 'トレンド',
                'categories.new': '新作',
                
                // Footer
                'footer.tagline': '無制限のエンターテイメント、どこでも。',
                'footer.about': '会社概要',
                'footer.about_us': '会社概要',
                'footer.careers': '採用情報',
                'footer.press': 'プレス',
                'footer.investors': '投資家',
                'footer.support': 'サポート',
                'footer.help': 'ヘルプ',
                'footer.contact': 'お問い合わせ',
                'footer.legal': '法的情報',
                'footer.terms': '利用規約',
                'footer.privacy': 'プライバシー',
                'footer.cookies': 'クッキー',
                'footer.copyright': '© 2024 StreamMax. 全著作権所有。',
                
                // User menu
                'login': 'ログイン',
                'profile': 'プロフィール',
                'settings': '設定',
                'help': 'ヘルプ',
                'logout': 'ログアウト',
                'language': '言語'
            },
            'ko': {
                // Page title
                'title': 'StreamMax - 프리미엄 영화 및 드라마 플랫폼',
                
                // Navigation
                'nav.home': '홈',
                'nav.series': '드라마',
                'nav.movies': '영화',
                'nav.trending': '신작 및 인기',
                'nav.mylist': '내 목록',
                
                // Search
                'search.placeholder': '영화, 드라마, 배우 검색...',
                
                // Hero section
                'hero.title': '무제한 영화, 드라마 그리고 더 많은 콘텐츠',
                'hero.subtitle': '언제 어디서나 시청하세요. 언제든지 취소하세요.',
                'hero.play': '재생',
                'hero.info': '더 많은 정보',
                
                // Categories
                'categories.trending': '트렌딩',
                'categories.new': '신작',
                
                // Footer
                'footer.tagline': '무제한 엔터테인먼트, 어디서나.',
                'footer.about': '회사 소개',
                'footer.about_us': '회사 소개',
                'footer.careers': '채용',
                'footer.press': '보도자료',
                'footer.investors': '투자자',
                'footer.support': '지원',
                'footer.help': '도움말',
                'footer.contact': '문의하기',
                'footer.legal': '법적 고지',
                'footer.terms': '이용약관',
                'footer.privacy': '개인정보처리방침',
                'footer.cookies': '쿠키',
                'footer.copyright': '© 2024 StreamMax. 모든 권리 보유.',
                
                // User menu
                'login': '로그인',
                'profile': '프로필',
                'settings': '설정',
                'help': '도움말',
                'logout': '로그아웃',
                'language': '언어'
            },
            'ar': {
                // Page title
                'title': 'StreamMax - منصة الأفلام والمسلسلات المميزة',
                
                // Navigation
                'nav.home': 'الرئيسية',
                'nav.series': 'المسلسلات',
                'nav.movies': 'الأفلام',
                'nav.trending': 'الجديد والشائع',
                'nav.mylist': 'قائمتي',
                
                // Search
                'search.placeholder': 'البحث عن أفلام، مسلسلات، ممثلين...',
                
                // Hero section
                'hero.title': 'أفلام ومسلسلات لا محدودة والمزيد',
                'hero.subtitle': 'شاهد في أي مكان. ألغ في أي وقت.',
                'hero.play': 'تشغيل',
                'hero.info': 'معلومات أكثر',
                
                // Categories
                'categories.trending': 'الرائج الآن',
                'categories.new': 'الإصدارات الجديدة',
                
                // Footer
                'footer.tagline': 'ترفيه لا محدود، في أي مكان.',
                'footer.about': 'حولنا',
                'footer.about_us': 'حولنا',
                'footer.careers': 'الوظائف',
                'footer.press': 'الصحافة',
                'footer.investors': 'المستثمرون',
                'footer.support': 'الدعم',
                'footer.help': 'المساعدة',
                'footer.contact': 'اتصل بنا',
                'footer.legal': 'المعلومات القانونية',
                'footer.terms': 'شروط الاستخدام',
                'footer.privacy': 'الخصوصية',
                'footer.cookies': 'ملفات تعريف الارتباط',
                'footer.copyright': '© 2024 StreamMax. جميع الحقوق محفوظة.',
                
                // User menu
                'login': 'تسجيل الدخول',
                'profile': 'الملف الشخصي',
                'settings': 'الإعدادات',
                'help': 'المساعدة',
                'logout': 'تسجيل الخروج',
                'language': 'اللغة'
            },
            'hi': {
                // Page title
                'title': 'StreamMax - प्रीमियम फिल्म और सीरीज़ प्लेटफॉर्म',
                
                // Navigation
                'nav.home': 'होम',
                'nav.series': 'सीरीज़',
                'nav.movies': 'फिल्में',
                'nav.trending': 'नया और लोकप्रिय',
                'nav.mylist': 'मेरी सूची',
                
                // Search
                'search.placeholder': 'फिल्में, सीरीज़, अभिनेता खोजें...',
                
                // Hero section
                'hero.title': 'असीमित फिल्में, सीरीज़ और बहुत कुछ',
                'hero.subtitle': 'कहीं भी देखें। कभी भी रद्द करें।',
                'hero.play': 'चलाएं',
                'hero.info': 'अधिक जानकारी',
                
                // Categories
                'categories.trending': 'ट्रेंडिंग',
                'categories.new': 'नई रिलीज़',
                
                // Footer
                'footer.tagline': 'असीमित मनोरंजन, कहीं भी।',
                'footer.about': 'हमारे बारे में',
                'footer.about_us': 'हमारे बारे में',
                'footer.careers': 'करियर',
                'footer.press': 'प्रेस',
                'footer.investors': 'निवेशक',
                'footer.support': 'सहायता',
                'footer.help': 'सहायता',
                'footer.contact': 'संपर्क',
                'footer.legal': 'कानूनी',
                'footer.terms': 'उपयोग की शर्तें',
                'footer.privacy': 'गोपनीयता',
                'footer.cookies': 'कुकीज़',
                'footer.copyright': '© 2024 StreamMax. सभी अधिकार सुरक्षित।',
                
                // User menu
                'login': 'लॉग इन करें',
                'profile': 'प्रोफ़ाइल',
                'settings': 'सेटिंग्स',
                'help': 'सहायता',
                'logout': 'लॉग आउट',
                'language': 'भाषा'
            }
        };
        
        const translations = languages[lang];
        if (translations) {
            // Update all elements with data-translate attribute
            const elementsToTranslate = document.querySelectorAll('[data-translate]');
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    if (element.tagName === 'INPUT' && element.type === 'text') {
                        element.placeholder = translations[key];
                    } else if (element.tagName === 'TITLE') {
                        element.textContent = translations[key];
                        document.title = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
            
            // Show notification
            this.showNotification(`Dil değiştirildi: ${translations.language}`, 'success');
            
            // Store language preference
            localStorage.setItem('selectedLanguage', lang);
            
            // Force update of profile menu specifically
            this.updateProfileMenuLanguage(translations);
            
            // Update all open modals
            this.updateOpenModals(translations);
        }
    }

    updateProfileMenuLanguage(translations) {
        // Update login item
        const loginItem = document.querySelector('.login-item span[data-translate="login"]');
        if (loginItem && translations.login) {
            loginItem.textContent = translations.login;
        }
        
        // Update profile item
        const profileItem = document.querySelector('.profile-item span[data-translate="profile"]');
        if (profileItem && translations.profile) {
            profileItem.textContent = translations.profile;
        }
        
        // Update settings item
        const settingsItem = document.querySelector('.settings-item span[data-translate="settings"]');
        if (settingsItem && translations.settings) {
            settingsItem.textContent = translations.settings;
        }
        
        // Update help item
        const helpItem = document.querySelector('.help-item span[data-translate="help"]');
        if (helpItem && translations.help) {
            helpItem.textContent = translations.help;
        }
        
        // Update logout item
        const logoutItem = document.querySelector('.logout-item span[data-translate="logout"]');
        if (logoutItem && translations.logout) {
            logoutItem.textContent = translations.logout;
        }
        
        // Update language item
        const languageItem = document.querySelector('.language-text[data-translate="language"]');
        if (languageItem && translations.language) {
            languageItem.textContent = translations.language;
        }
    }

    updateOpenModals(translations) {
        // Find all open modals
        const openModals = document.querySelectorAll('.movie-modal');
        openModals.forEach(modal => {
            // Apply translations to each open modal with the new translations
            this.applyTranslationsToModal(modal, translations);
        });
    }

    applyTranslationsToModal(modal, translations = null) {
        // If translations are not provided, get them from saved language
        if (!translations) {
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'tr';
            const languages = this.getLanguageTranslations();
            translations = languages[savedLanguage];
        }
        
        if (translations) {
            const elementsToTranslate = modal.querySelectorAll('[data-translate]');
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    if (element.tagName === 'INPUT' && element.type === 'text') {
                        element.placeholder = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });
        }
    }

    getLanguageTranslations() {
        // This function should return the same translations as the main changeLanguage function
        // For now, we'll use a simplified approach and get translations from the main function
        const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
        
        // Get the main language object from changeLanguage function
        const languages = {
            'tr': {
                // Modal translations
                'modal.login.title': 'Giriş Yap',
                'modal.login.email': 'E-posta Adresi',
                'modal.login.email_placeholder': 'ornek@email.com',
                'modal.login.password': 'Şifre',
                'modal.login.password_placeholder': 'Şifrenizi girin',
                'modal.login.remember': 'Beni hatırla',
                'modal.login.forgot': 'Şifremi unuttum',
                'modal.login.submit': 'Giriş Yap',
                'modal.login.register': 'Kayıt Ol',
                'modal.login.social_text': 'Veya sosyal medya ile giriş yap',
                'modal.login.google': 'Google',
                'modal.login.facebook': 'Facebook',
                'modal.login.vk': 'VK',
                'modal.login.apple': 'Apple',
                'modal.login.x': 'X',
                
                // Profile modal
                'modal.profile.title': 'Profil Bilgileri',
                'modal.profile.user_profile': 'Kullanıcı Profili',
                'modal.profile.email': 'Email:',
                'modal.profile.membership': 'Üyelik:',
                'modal.profile.premium': 'Premium',
                'modal.profile.last_login': 'Son Giriş:',
                'modal.profile.today': 'Bugün',
                'modal.profile.edit_profile': 'Profili Düzenle',
                'modal.profile.change_password': 'Şifre Değiştir',
                
                // Settings modal
                'modal.settings.title': 'Ayarlar',
                'modal.settings.display_settings': 'Görüntü Ayarları',
                'modal.settings.video_quality': 'Video Kalitesi:',
                'modal.settings.auto': 'Otomatik',
                'modal.settings.subtitles': 'Altyazı:',
                'modal.settings.turkish': 'Türkçe',
                'modal.settings.english': 'İngilizce',
                'modal.settings.off': 'Kapalı',
                'modal.settings.spanish': 'İspanyolca',
                'modal.settings.french': 'Fransızca',
                'modal.settings.german': 'Almanca',
                'modal.settings.italian': 'İtalyanca',
                'modal.settings.portuguese': 'Portekizce',
                'modal.settings.russian': 'Rusça',
                'modal.settings.chinese': 'Çince',
                'modal.settings.japanese': 'Japonca',
                'modal.settings.korean': 'Korece',
                'modal.settings.arabic': 'Arapça',
                'modal.settings.hindi': 'Hintçe',
                'modal.settings.dutch': 'Flemenkçe',
                'modal.settings.swedish': 'İsveççe',
                'modal.settings.norwegian': 'Norveççe',
                'modal.settings.danish': 'Danca',
                'modal.settings.finnish': 'Fince',
                'modal.settings.polish': 'Lehçe',
                'modal.settings.save': 'Kaydet',
                'modal.settings.reset': 'Sıfırla',
                
                // Help modal
                'modal.help.title': 'Yardım Merkezi',
                'modal.help.faq': 'Sık Sorulan Sorular',
                'modal.help.faq1_question': 'Nasıl film izleyebilirim?',
                'modal.help.faq1_answer': 'Film kartına tıklayarak veya oynat butonuna basarak filmi izleyebilirsiniz.',
                'modal.help.faq2_question': 'İzleme listeme nasıl eklerim?',
                'modal.help.faq2_answer': 'Film kartındaki + butonuna tıklayarak izleme listenize ekleyebilirsiniz.',
                'modal.help.faq3_question': 'Nasıl arama yapabilirim?',
                'modal.help.faq3_answer': 'Üst kısımdaki arama çubuğunu kullanarak film ve dizi arayabilirsiniz.',
                'modal.help.contact_support': 'Destek İletişim',
                'modal.help.live_support': 'Canlı Destek'
            },
            'en': {
                'modal.login.title': 'Sign In',
                'modal.login.email': 'Email Address',
                'modal.login.email_placeholder': 'example@email.com',
                'modal.login.password': 'Password',
                'modal.login.password_placeholder': 'Enter your password',
                'modal.login.remember': 'Remember me',
                'modal.login.forgot': 'Forgot password',
                'modal.login.submit': 'Sign In',
                'modal.login.register': 'Sign Up',
                'modal.login.social_text': 'Or sign in with social media',
                'modal.login.google': 'Google',
                'modal.login.facebook': 'Facebook',
                'modal.login.vk': 'VK',
                'modal.login.apple': 'Apple',
                'modal.login.x': 'X',
                
                // Profile modal
                'modal.profile.title': 'Profile Information',
                'modal.profile.user_profile': 'User Profile',
                'modal.profile.email': 'Email:',
                'modal.profile.membership': 'Membership:',
                'modal.profile.premium': 'Premium',
                'modal.profile.last_login': 'Last Login:',
                'modal.profile.today': 'Today',
                'modal.profile.edit_profile': 'Edit Profile',
                'modal.profile.change_password': 'Change Password',
                
                // Settings modal
                'modal.settings.title': 'Settings',
                'modal.settings.display_settings': 'Display Settings',
                'modal.settings.video_quality': 'Video Quality:',
                'modal.settings.auto': 'Auto',
                'modal.settings.subtitles': 'Subtitles:',
                'modal.settings.turkish': 'Turkish',
                'modal.settings.english': 'English',
                'modal.settings.off': 'Off',
                'modal.settings.spanish': 'Spanish',
                'modal.settings.french': 'French',
                'modal.settings.german': 'German',
                'modal.settings.italian': 'Italian',
                'modal.settings.portuguese': 'Portuguese',
                'modal.settings.russian': 'Russian',
                'modal.settings.chinese': 'Chinese',
                'modal.settings.japanese': 'Japanese',
                'modal.settings.korean': 'Korean',
                'modal.settings.arabic': 'Arabic',
                'modal.settings.hindi': 'Hindi',
                'modal.settings.dutch': 'Dutch',
                'modal.settings.swedish': 'Swedish',
                'modal.settings.norwegian': 'Norwegian',
                'modal.settings.danish': 'Danish',
                'modal.settings.finnish': 'Finnish',
                'modal.settings.polish': 'Polish',
                'modal.settings.save': 'Save',
                'modal.settings.reset': 'Reset',
                
                // Help modal
                'modal.help.title': 'Help Center',
                'modal.help.faq': 'Frequently Asked Questions',
                'modal.help.faq1_question': 'How can I watch movies?',
                'modal.help.faq1_answer': 'You can watch movies by clicking on the movie card or pressing the play button.',
                'modal.help.faq2_question': 'How do I add to my watchlist?',
                'modal.help.faq2_answer': 'You can add to your watchlist by clicking the + button on the movie card.',
                'modal.help.faq3_question': 'How can I search?',
                'modal.help.faq3_answer': 'You can search for movies and series using the search bar at the top.',
                'modal.help.contact_support': 'Contact Support',
                'modal.help.live_support': 'Live Support'
            }
        };
        
        return languages;
    }

    loadSavedLanguage() {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            // Update active language option
            const languageOptions = document.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === savedLanguage) {
                    option.classList.add('active');
                }
            });
            
            // Apply translations
            this.changeLanguage(savedLanguage);
        }
    }

    handleDropdownItemClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const item = e.target;
        const text = item.textContent.trim();
        const href = item.getAttribute('href');
        
        console.log(`Dropdown öğesi tıklandı: ${text} (${href})`);
        
        // Visual feedback
        item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        setTimeout(() => {
            item.style.backgroundColor = '';
        }, 200);
        
        // Dropdown'u kapat
        const userDropdown = document.querySelector('.user-dropdown');
        const userMenu = document.querySelector('.user-menu');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
        if (userMenu) {
            userMenu.classList.remove('active');
        }
        
        // Öğeye göre işlem yap
        switch(href) {
            case '#login':
                this.handleLoginClick();
                break;
            case '#profile':
                this.handleProfileClick();
                break;
            case '#settings':
                this.handleSettingsClick();
                break;
            case '#help':
                this.handleHelpClick();
                break;
            case '#logout':
                this.handleLogoutClick();
                break;
            default:
                this.showNotification(`"${text}" sayfası açılıyor...`, 'info');
        }
    }

    handleLoginClick() {
        this.showNotification('Giriş sayfası açılıyor...', 'info');
        // Giriş modal'ı aç
        this.showLoginModal();
    }

    handleProfileClick() {
        this.showNotification('Profil sayfası açılıyor...', 'info');
        // Profil modal'ı aç
        this.showProfileModal();
    }

    handleSettingsClick() {
        this.showNotification('Ayarlar sayfası açılıyor...', 'info');
        // Ayarlar modal'ı aç
        this.showSettingsModal();
    }

    handleHelpClick() {
        this.showNotification('Yardım sayfası açılıyor...', 'info');
        // Yardım modal'ı aç
        this.showHelpModal();
    }

    handleLogoutClick() {
        this.showNotification('Çıkış yapılıyor...', 'warning');
        // Çıkış onayı
        if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            this.showNotification('Başarıyla çıkış yapıldı!', 'success');
            // UI'yi giriş yapmamış duruma döndür
            this.updateLoggedOutState();
        }
    }

    updateLoggedOutState() {
        // Update user menu to show logged out state
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.remove('logged-in');
        }
        
        console.log('Kullanıcı çıkış yaptı - Profil menüsü güncellendi');
    }

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="modal.login.title">Giriş Yap</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="login-form">
                        <div class="form-group">
                            <label for="email" data-translate="modal.login.email">E-posta Adresi</label>
                            <input type="email" id="email" placeholder="ornek@email.com" data-translate="modal.login.email_placeholder" required>
                        </div>
                        <div class="form-group">
                            <label for="password" data-translate="modal.login.password">Şifre</label>
                            <input type="password" id="password" placeholder="Şifrenizi girin" data-translate="modal.login.password_placeholder" required>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="remember">
                                <span class="checkmark"></span>
                                <span data-translate="modal.login.remember">Beni hatırla</span>
                            </label>
                            <a href="#forgot" class="forgot-link" data-translate="modal.login.forgot">Şifremi unuttum</a>
                        </div>
                        <div class="login-actions">
                            <button class="btn btn-primary login-btn">
                                <i class="fas fa-sign-in-alt"></i>
                                <span data-translate="modal.login.submit">Giriş Yap</span>
                            </button>
                            <button class="btn btn-secondary register-btn">
                                <i class="fas fa-user-plus"></i>
                                <span data-translate="modal.login.register">Kayıt Ol</span>
                            </button>
                        </div>
                        <div class="social-login">
                            <p data-translate="modal.login.social_text">Veya sosyal medya ile giriş yap</p>
                            <div class="social-buttons">
                                <button class="btn btn-social google-btn">
                                    <i class="fab fa-google"></i>
                                    <span data-translate="modal.login.google">Google</span>
                                </button>
                                <button class="btn btn-social facebook-btn">
                                    <i class="fab fa-facebook-f"></i>
                                    <span data-translate="modal.login.facebook">Facebook</span>
                                </button>
                                <button class="btn btn-social vk-btn">
                                    <i class="fab fa-vk"></i>
                                    <span data-translate="modal.login.vk">VK</span>
                                </button>
                                <button class="btn btn-social apple-btn">
                                    <i class="fab fa-apple"></i>
                                    <span data-translate="modal.login.apple">Apple</span>
                                </button>
                                <button class="btn btn-social x-btn">
                                    <i class="fab fa-x-twitter"></i>
                                    <span data-translate="modal.login.x">X</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modal);
        
        // Apply translations to modal
        this.applyTranslationsToModal(modal);
        
        // Login form event listeners
        this.setupLoginFormEvents(modal);
    }

    showRegisterModal() {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Kayıt Ol</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="register-form">
                        <div class="register-tabs">
                            <button class="tab-btn active" data-tab="email">
                                <i class="fas fa-envelope"></i>
                                E-posta ile
                            </button>
                            <button class="tab-btn" data-tab="phone">
                                <i class="fas fa-phone"></i>
                                Telefon ile
                            </button>
                        </div>
                        
                        <div class="tab-content active" id="email-tab">
                            <div class="form-group">
                                <label for="reg-email">E-posta Adresi</label>
                                <input type="email" id="reg-email" placeholder="ornek@email.com" required>
                            </div>
                            <div class="form-group">
                                <label for="reg-password">Şifre</label>
                                <input type="password" id="reg-password" placeholder="En az 6 karakter" required>
                            </div>
                            <div class="form-group">
                                <label for="reg-confirm-password">Şifre Tekrar</label>
                                <input type="password" id="reg-confirm-password" placeholder="Şifrenizi tekrar girin" required>
                            </div>
                            <div class="form-group">
                                <label for="reg-name">Ad Soyad</label>
                                <input type="text" id="reg-name" placeholder="Adınız ve soyadınız" required>
                            </div>
                        </div>
                        
                        <div class="tab-content" id="phone-tab">
                            <div class="form-group">
                                <label for="reg-phone">Telefon Numarası</label>
                                <div class="phone-input-group">
                                    <div class="country-selector">
                                        <input type="text" id="country-search" class="country-search" placeholder="Ülke ara..." autocomplete="off">
                                        <div class="country-dropdown" id="country-dropdown">
                                        </div>
                                        <div class="selected-country" id="selected-country">
                                            <span class="flag">🇹🇷</span>
                                            <span class="name">Türkiye</span>
                                            <span class="code">+90</span>
                                            <i class="fas fa-chevron-down"></i>
                                        </div>
                                    </div>
                                    <input type="tel" id="reg-phone" placeholder="5XX XXX XX XX" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="reg-password-phone">Şifre</label>
                                <input type="password" id="reg-password-phone" placeholder="En az 6 karakter" required>
                            </div>
                            <div class="form-group">
                                <label for="reg-confirm-password-phone">Şifre Tekrar</label>
                                <input type="password" id="reg-confirm-password-phone" placeholder="Şifrenizi tekrar girin" required>
                            </div>
                            <div class="form-group">
                                <label for="reg-name-phone">Ad Soyad</label>
                                <input type="text" id="reg-name-phone" placeholder="Adınız ve soyadınız" required>
                            </div>
                        </div>
                        
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="terms" required>
                                <span class="checkmark"></span>
                                <a href="#terms" class="terms-link">Kullanım şartlarını</a> ve <a href="#privacy" class="privacy-link">gizlilik politikasını</a> kabul ediyorum
                            </label>
                        </div>
                        
                        <div class="register-actions">
                            <button class="btn btn-primary register-submit-btn">
                                <i class="fas fa-user-plus"></i>
                                Kayıt Ol
                            </button>
                            <button class="btn btn-secondary back-to-login-btn">
                                <i class="fas fa-arrow-left"></i>
                                Giriş Yap
                            </button>
                        </div>
                        
                        <div class="social-register">
                            <p>Veya sosyal medya ile kayıt ol</p>
                            <div class="social-buttons">
                                <button class="btn btn-social google-btn">
                                    <i class="fab fa-google"></i>
                                    Google
                                </button>
                                <button class="btn btn-social facebook-btn">
                                    <i class="fab fa-facebook-f"></i>
                                    Facebook
                                </button>
                                <button class="btn btn-social vk-btn">
                                    <i class="fab fa-vk"></i>
                                    VK
                                </button>
                                <button class="btn btn-social apple-btn">
                                    <i class="fab fa-apple"></i>
                                    Apple
                                </button>
                                <button class="btn btn-social x-btn">
                                    <i class="fab fa-x-twitter"></i>
                                    X
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modal);
        
        // Register form event listeners
        this.setupRegisterFormEvents(modal);
        
        // Setup phone number formatting
        this.setupPhoneFormatting(modal);
    }

    showProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="modal.profile.title">Profil Bilgileri</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="profile-details">
                            <h3 data-translate="modal.profile.user_profile">Kullanıcı Profili</h3>
                            <p><span data-translate="modal.profile.email">Email:</span> user@streammax.com</p>
                            <p><span data-translate="modal.profile.membership">Üyelik:</span> <span data-translate="modal.profile.premium">Premium</span></p>
                            <p><span data-translate="modal.profile.last_login">Son Giriş:</span> <span data-translate="modal.profile.today">Bugün</span></p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary" data-translate="modal.profile.edit_profile">Profili Düzenle</button>
                        <button class="btn btn-secondary" data-translate="modal.profile.change_password">Şifre Değiştir</button>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modal);
        
        // Apply translations to modal
        this.applyTranslationsToModal(modal);
    }

    showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="modal.settings.title">Ayarlar</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h3 data-translate="modal.settings.display_settings">Görüntü Ayarları</h3>
                        <div class="setting-item">
                            <label data-translate="modal.settings.video_quality">Video Kalitesi:</label>
                            <select>
                                <option data-translate="modal.settings.auto">Otomatik</option>
                                <option>1080p</option>
                                <option>720p</option>
                                <option>480p</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label data-translate="modal.settings.subtitles">Altyazı:</label>
                            <select>
                                <option data-translate="modal.settings.off">Kapalı</option>
                                <option data-translate="modal.settings.turkish">Türkçe</option>
                                <option data-translate="modal.settings.english">İngilizce</option>
                                <option data-translate="modal.settings.spanish">İspanyolca</option>
                                <option data-translate="modal.settings.french">Fransızca</option>
                                <option data-translate="modal.settings.german">Almanca</option>
                                <option data-translate="modal.settings.italian">İtalyanca</option>
                                <option data-translate="modal.settings.portuguese">Portekizce</option>
                                <option data-translate="modal.settings.russian">Rusça</option>
                                <option data-translate="modal.settings.chinese">Çince</option>
                                <option data-translate="modal.settings.japanese">Japonca</option>
                                <option data-translate="modal.settings.korean">Korece</option>
                                <option data-translate="modal.settings.arabic">Arapça</option>
                                <option data-translate="modal.settings.hindi">Hintçe</option>
                                <option data-translate="modal.settings.dutch">Flemenkçe</option>
                                <option data-translate="modal.settings.swedish">İsveççe</option>
                                <option data-translate="modal.settings.norwegian">Norveççe</option>
                                <option data-translate="modal.settings.danish">Danca</option>
                                <option data-translate="modal.settings.finnish">Fince</option>
                                <option data-translate="modal.settings.polish">Lehçe</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-actions">
                        <button class="btn btn-primary" data-translate="modal.settings.save">Kaydet</button>
                        <button class="btn btn-secondary" data-translate="modal.settings.reset">Sıfırla</button>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modal);
        
        // Apply translations to modal
        this.applyTranslationsToModal(modal);
    }

    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-translate="modal.help.title">Yardım Merkezi</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="help-section">
                        <h3 data-translate="modal.help.faq">Sık Sorulan Sorular</h3>
                        <div class="faq-item">
                            <h4 data-translate="modal.help.faq1_question">Nasıl film izleyebilirim?</h4>
                            <p data-translate="modal.help.faq1_answer">Film kartına tıklayarak veya oynat butonuna basarak filmi izleyebilirsiniz.</p>
                        </div>
                        <div class="faq-item">
                            <h4 data-translate="modal.help.faq2_question">İzleme listeme nasıl eklerim?</h4>
                            <p data-translate="modal.help.faq2_answer">Film kartındaki + butonuna tıklayarak izleme listenize ekleyebilirsiniz.</p>
                        </div>
                        <div class="faq-item">
                            <h4 data-translate="modal.help.faq3_question">Nasıl arama yapabilirim?</h4>
                            <p data-translate="modal.help.faq3_answer">Üst kısımdaki arama çubuğunu kullanarak film ve dizi arayabilirsiniz.</p>
                        </div>
                    </div>
                    <div class="help-actions">
                        <button class="btn btn-primary" data-translate="modal.help.contact_support">Destek İletişim</button>
                        <button class="btn btn-secondary" data-translate="modal.help.live_support">Canlı Destek</button>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modal);
        
        // Apply translations to modal
        this.applyTranslationsToModal(modal);
    }

    setupLoginFormEvents(modal) {
        const loginBtn = modal.querySelector('.login-btn');
        const registerBtn = modal.querySelector('.register-btn');
        const googleBtn = modal.querySelector('.google-btn');
        const facebookBtn = modal.querySelector('.facebook-btn');
        const forgotLink = modal.querySelector('.forgot-link');
        
        // Giriş yap butonu
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLoginSubmit(modal);
            });
        }
        
        // Kayıt ol butonu
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                // Mevcut modal'ı kapat
                document.body.removeChild(modal);
                // Kayıt modal'ını aç
                this.showRegisterModal();
            });
        }
        
        // Google ile giriş
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('Google');
            });
        }
        
        // Facebook ile giriş
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialLogin('Facebook');
            });
        }
        
        // VK ile giriş
        const vkBtn = modal.querySelector('.vk-btn');
        if (vkBtn) {
            vkBtn.addEventListener('click', () => {
                this.handleSocialLogin('VK');
            });
        }
        
        // Apple ile giriş
        const appleBtn = modal.querySelector('.apple-btn');
        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleSocialLogin('Apple');
            });
        }
        
        // X ile giriş
        const xBtn = modal.querySelector('.x-btn');
        if (xBtn) {
            xBtn.addEventListener('click', () => {
                this.handleSocialLogin('X');
            });
        }
        
        // Şifremi unuttum
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Şifre sıfırlama sayfası açılıyor...', 'info');
            });
        }
    }

    setupRegisterFormEvents(modal) {
        const registerSubmitBtn = modal.querySelector('.register-submit-btn');
        const backToLoginBtn = modal.querySelector('.back-to-login-btn');
        const googleBtn = modal.querySelector('.google-btn');
        const facebookBtn = modal.querySelector('.facebook-btn');
        const tabBtns = modal.querySelectorAll('.tab-btn');
        const termsLink = modal.querySelector('.terms-link');
        const privacyLink = modal.querySelector('.privacy-link');
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchRegisterTab(modal, tab);
            });
        });
        
        // Kayıt ol butonu
        if (registerSubmitBtn) {
            registerSubmitBtn.addEventListener('click', () => {
                this.handleRegisterSubmit(modal);
            });
        }
        
        // Giriş yap'a dön
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => {
                // Mevcut modal'ı kapat
                document.body.removeChild(modal);
                // Giriş modal'ını aç
                this.showLoginModal();
            });
        }
        
        // Google ile kayıt
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialRegister('Google');
            });
        }
        
        // Facebook ile kayıt
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialRegister('Facebook');
            });
        }
        
        // VK ile kayıt
        const vkBtn = modal.querySelector('.vk-btn');
        if (vkBtn) {
            vkBtn.addEventListener('click', () => {
                this.handleSocialRegister('VK');
            });
        }
        
        // Apple ile kayıt
        const appleBtn = modal.querySelector('.apple-btn');
        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleSocialRegister('Apple');
            });
        }
        
        // X ile kayıt
        const xBtn = modal.querySelector('.x-btn');
        if (xBtn) {
            xBtn.addEventListener('click', () => {
                this.handleSocialRegister('X');
            });
        }
        
        // Kullanım şartları
        if (termsLink) {
            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Kullanım şartları sayfası açılıyor...', 'info');
            });
        }
        
        // Gizlilik politikası
        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Gizlilik politikası sayfası açılıyor...', 'info');
            });
        }
    }

    handleLoginSubmit(modal) {
        const email = modal.querySelector('#email').value;
        const password = modal.querySelector('#password').value;
        const remember = modal.querySelector('#remember').checked;
        
        // Form validation
        const validation = this.validateLoginForm(email, password);
        if (!validation.isValid) {
            this.showNotification(validation.message, 'error');
            return;
        }
        
        // Loading state
        const loginBtn = modal.querySelector('.login-btn');
        const originalHTML = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';
        loginBtn.disabled = true;
        
        // Simulate login
        setTimeout(() => {
            loginBtn.innerHTML = originalHTML;
            loginBtn.disabled = false;
            
            // Close modal
            document.body.removeChild(modal);
            
            // Success notification
            this.showNotification('Başarıyla giriş yapıldı!', 'success');
            
            // Update UI to show logged in state
            this.updateLoggedInState();
        }, 2000);
    }

    validateLoginForm(email, password) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return {
                isValid: false,
                message: 'Geçerli bir e-posta adresi girin!'
            };
        }
        
        // Password validation
        if (!password || password.length < 6) {
            return {
                isValid: false,
                message: 'Şifre en az 6 karakter olmalıdır!'
            };
        }
        
        return { isValid: true };
    }

    handleSocialLogin(provider) {
        this.showNotification(`${provider} ile giriş yapılıyor...`, 'info');
        
        // Simulate social login
        setTimeout(() => {
            this.showNotification(`${provider} ile başarıyla giriş yapıldı!`, 'success');
            this.updateLoggedInState();
        }, 1500);
    }

    switchRegisterTab(modal, tab) {
        const tabBtns = modal.querySelectorAll('.tab-btn');
        const tabContents = modal.querySelectorAll('.tab-content');
        
        // Remove active class from all tabs
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab
        const selectedBtn = modal.querySelector(`[data-tab="${tab}"]`);
        const selectedContent = modal.querySelector(`#${tab}-tab`);
        
        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
        
        console.log(`Kayıt sekmesi değiştirildi: ${tab}`);
    }

    handleRegisterSubmit(modal) {
        const activeTab = modal.querySelector('.tab-btn.active').getAttribute('data-tab');
        let email, phone, countryCode, fullPhone, password, confirmPassword, name, terms;
        
        if (activeTab === 'email') {
            email = modal.querySelector('#reg-email').value;
            password = modal.querySelector('#reg-password').value;
            confirmPassword = modal.querySelector('#reg-confirm-password').value;
            name = modal.querySelector('#reg-name').value;
        } else {
            phone = modal.querySelector('#reg-phone').value;
            countryCode = modal.querySelector('#selected-country .code').textContent;
            fullPhone = countryCode + phone;
            password = modal.querySelector('#reg-password-phone').value;
            confirmPassword = modal.querySelector('#reg-confirm-password-phone').value;
            name = modal.querySelector('#reg-name-phone').value;
        }
        
        terms = modal.querySelector('#terms').checked;
        
        // Validation
        if (!name || !password || !confirmPassword || !terms) {
            this.showNotification('Lütfen tüm alanları doldurun ve şartları kabul edin!', 'error');
            return;
        }
        
        if (activeTab === 'email' && !email) {
            this.showNotification('Lütfen e-posta adresinizi girin!', 'error');
            return;
        }
        
        if (activeTab === 'phone' && !phone) {
            this.showNotification('Lütfen telefon numaranızı girin!', 'error');
            return;
        }
        
        if (activeTab === 'phone' && !this.validatePhoneNumber(phone)) {
            this.showNotification('Lütfen geçerli bir telefon numarası girin!', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Şifre en az 6 karakter olmalıdır!', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Şifreler eşleşmiyor!', 'error');
            return;
        }
        
        // Loading state
        const registerBtn = modal.querySelector('.register-submit-btn');
        const originalHTML = registerBtn.innerHTML;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt yapılıyor...';
        registerBtn.disabled = true;
        
        // Simulate registration
        setTimeout(() => {
            registerBtn.innerHTML = originalHTML;
            registerBtn.disabled = false;
            
            // Close modal
            document.body.removeChild(modal);
            
            // Success notification
            const registerMethod = activeTab === 'email' ? 'E-posta' : 'Telefon';
            const phoneInfo = activeTab === 'phone' ? ` (${fullPhone})` : '';
            this.showNotification(`${registerMethod} ile başarıyla kayıt olundu!${phoneInfo}`, 'success');
            
            // Update UI to show logged in state
            this.updateLoggedInState();
        }, 2000);
    }

    validatePhoneNumber(phone) {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Check if phone number is between 7 and 15 digits (international standard)
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            return false;
        }
        
        // Check if it contains only digits
        return /^\d+$/.test(cleanPhone);
    }

    setupPhoneFormatting(modal) {
        const phoneInput = modal.querySelector('#reg-phone');
        const countrySearch = modal.querySelector('#country-search');
        const countryDropdown = modal.querySelector('#country-dropdown');
        const selectedCountry = modal.querySelector('#selected-country');
        
        // Initialize countries data
        this.initializeCountries(modal);
        
        if (phoneInput) {
            // Format phone number as user types
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                // Limit to 15 digits (international standard)
                if (value.length > 15) {
                    value = value.substring(0, 15);
                }
                
                // Format based on selected country code
                const countryCode = selectedCountry.querySelector('.code').textContent;
                const formattedValue = this.formatPhoneNumber(value, countryCode);
                e.target.value = formattedValue;
            });
        }
        
        if (countrySearch && countryDropdown) {
            // Country search functionality
            countrySearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterCountries(searchTerm, countryDropdown);
            });
            
            // Show/hide dropdown
            countrySearch.addEventListener('focus', () => {
                countryDropdown.style.display = 'block';
                countrySearch.style.display = 'block';
                selectedCountry.style.display = 'none';
            });
            
            // Show selected country when search loses focus
            countrySearch.addEventListener('blur', () => {
                setTimeout(() => {
                    countryDropdown.style.display = 'none';
                    countrySearch.style.display = 'none';
                    selectedCountry.style.display = 'flex';
                }, 200);
            });
            
            // Toggle search on selected country click
            selectedCountry.addEventListener('click', () => {
                countrySearch.style.display = 'block';
                selectedCountry.style.display = 'none';
                countrySearch.focus();
                countryDropdown.style.display = 'block';
            });
            
            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!modal.contains(e.target)) {
                    countryDropdown.style.display = 'none';
                    countrySearch.style.display = 'none';
                    selectedCountry.style.display = 'flex';
                }
            });
        }
    }

    initializeCountries(modal) {
        const countries = [
            { code: '+1', flag: '🇺🇸', name: 'ABD' },
            { code: '+1', flag: '🇨🇦', name: 'Kanada' },
            { code: '+44', flag: '🇬🇧', name: 'İngiltere' },
            { code: '+44', flag: '🇬🇬', name: 'Guernsey' },
            { code: '+44', flag: '🇯🇪', name: 'Jersey' },
            { code: '+44', flag: '🇮🇲', name: 'Man Adası' },
            { code: '+49', flag: '🇩🇪', name: 'Almanya' },
            { code: '+33', flag: '🇫🇷', name: 'Fransa' },
            { code: '+39', flag: '🇮🇹', name: 'İtalya' },
            { code: '+39', flag: '🇻🇦', name: 'Vatikan' },
            { code: '+39', flag: '🇸🇲', name: 'San Marino' },
            { code: '+34', flag: '🇪🇸', name: 'İspanya' },
            { code: '+90', flag: '🇹🇷', name: 'Türkiye' },
            { code: '+90', flag: '🇹🇷', name: 'Kuzey Kıbrıs' },
            { code: '+7', flag: '🇷🇺', name: 'Rusya' },
            { code: '+7', flag: '🇰🇿', name: 'Kazakistan' },
            { code: '+86', flag: '🇨🇳', name: 'Çin' },
            { code: '+86', flag: '🇭🇰', name: 'Hong Kong' },
            { code: '+86', flag: '🇲🇴', name: 'Makao' },
            { code: '+81', flag: '🇯🇵', name: 'Japonya' },
            { code: '+82', flag: '🇰🇷', name: 'Güney Kore' },
            { code: '+91', flag: '🇮🇳', name: 'Hindistan' },
            { code: '+55', flag: '🇧🇷', name: 'Brezilya' },
            { code: '+52', flag: '🇲🇽', name: 'Meksika' },
            { code: '+61', flag: '🇦🇺', name: 'Avustralya' },
            { code: '+61', flag: '🇨🇨', name: 'Cocos Adaları' },
            { code: '+61', flag: '🇨🇽', name: 'Christmas Adası' },
            { code: '+27', flag: '🇿🇦', name: 'Güney Afrika' },
            { code: '+20', flag: '🇪🇬', name: 'Mısır' },
            { code: '+966', flag: '🇸🇦', name: 'Suudi Arabistan' },
            { code: '+971', flag: '🇦🇪', name: 'BAE' },
            { code: '+98', flag: '🇮🇷', name: 'İran' },
            { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
            { code: '+880', flag: '🇧🇩', name: 'Bangladeş' },
            { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
            { code: '+977', flag: '🇳🇵', name: 'Nepal' },
            { code: '+93', flag: '🇦🇫', name: 'Afganistan' },
            { code: '+996', flag: '🇰🇬', name: 'Kırgızistan' },
            { code: '+998', flag: '🇺🇿', name: 'Özbekistan' },
            { code: '+374', flag: '🇦🇲', name: 'Ermenistan' },
            { code: '+995', flag: '🇬🇪', name: 'Gürcistan' },
            { code: '+994', flag: '🇦🇿', name: 'Azerbaycan' },
            { code: '+373', flag: '🇲🇩', name: 'Moldova' },
            { code: '+380', flag: '🇺🇦', name: 'Ukrayna' },
            { code: '+375', flag: '🇧🇾', name: 'Belarus' },
            { code: '+370', flag: '🇱🇹', name: 'Litvanya' },
            { code: '+371', flag: '🇱🇻', name: 'Letonya' },
            { code: '+372', flag: '🇪🇪', name: 'Estonya' },
            { code: '+358', flag: '🇫🇮', name: 'Finlandiya' },
            { code: '+46', flag: '🇸🇪', name: 'İsveç' },
            { code: '+47', flag: '🇳🇴', name: 'Norveç' },
            { code: '+45', flag: '🇩🇰', name: 'Danimarka' },
            { code: '+31', flag: '🇳🇱', name: 'Hollanda' },
            { code: '+32', flag: '🇧🇪', name: 'Belçika' },
            { code: '+41', flag: '🇨🇭', name: 'İsviçre' },
            { code: '+43', flag: '🇦🇹', name: 'Avusturya' },
            { code: '+48', flag: '🇵🇱', name: 'Polonya' },
            { code: '+420', flag: '🇨🇿', name: 'Çekya' },
            { code: '+421', flag: '🇸🇰', name: 'Slovakya' },
            { code: '+36', flag: '🇭🇺', name: 'Macaristan' },
            { code: '+40', flag: '🇷🇴', name: 'Romanya' },
            { code: '+359', flag: '🇧🇬', name: 'Bulgaristan' },
            { code: '+385', flag: '🇭🇷', name: 'Hırvatistan' },
            { code: '+386', flag: '🇸🇮', name: 'Slovenya' },
            { code: '+387', flag: '🇧🇦', name: 'Bosna Hersek' },
            { code: '+382', flag: '🇲🇪', name: 'Karadağ' },
            { code: '+381', flag: '🇷🇸', name: 'Sırbistan' },
            { code: '+389', flag: '🇲🇰', name: 'Kuzey Makedonya' },
            { code: '+355', flag: '🇦🇱', name: 'Arnavutluk' },
            { code: '+30', flag: '🇬🇷', name: 'Yunanistan' },
            { code: '+357', flag: '🇨🇾', name: 'Kıbrıs' },
            { code: '+351', flag: '🇵🇹', name: 'Portekiz' },
            { code: '+351', flag: '🇵🇹', name: 'Azorlar' },
            { code: '+351', flag: '🇵🇹', name: 'Madeira' },
            { code: '+353', flag: '🇮🇪', name: 'İrlanda' },
            { code: '+354', flag: '🇮🇸', name: 'İzlanda' },
            { code: '+356', flag: '🇲🇹', name: 'Malta' },
            { code: '+350', flag: '🇬🇮', name: 'Cebelitarık' },
            { code: '+376', flag: '🇦🇩', name: 'Andorra' },
            { code: '+377', flag: '🇲🇨', name: 'Monako' },
            { code: '+378', flag: '🇸🇲', name: 'San Marino' },
            { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
            { code: '+352', flag: '🇱🇺', name: 'Lüksemburg' }
        ];
        
        const countryDropdown = modal.querySelector('#country-dropdown');
        if (countryDropdown) {
            countryDropdown.innerHTML = '';
            countries.forEach(country => {
                const option = document.createElement('div');
                option.className = 'country-option';
                option.setAttribute('data-code', country.code);
                option.setAttribute('data-flag', country.flag);
                option.setAttribute('data-name', country.name);
                option.innerHTML = `
                    <span class="flag">${country.flag}</span>
                    <span class="name">${country.name}</span>
                    <span class="code">${country.code}</span>
                `;
                
                option.addEventListener('click', () => {
                    this.selectCountry(country, modal);
                });
                
                countryDropdown.appendChild(option);
            });
        }
    }

    filterCountries(searchTerm, countryDropdown) {
        const options = countryDropdown.querySelectorAll('.country-option');
        options.forEach(option => {
            const name = option.getAttribute('data-name').toLowerCase();
            const code = option.getAttribute('data-code');
            if (name.includes(searchTerm) || code.includes(searchTerm)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    selectCountry(country, modal) {
        const selectedCountry = modal.querySelector('#selected-country');
        const countrySearch = modal.querySelector('#country-search');
        const countryDropdown = modal.querySelector('#country-dropdown');
        const phoneInput = modal.querySelector('#reg-phone');
        
        // Update selected country display
        selectedCountry.innerHTML = `
            <span class="flag">${country.flag}</span>
            <span class="name">${country.name}</span>
            <span class="code">${country.code}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        // Clear search and hide dropdown
        countrySearch.value = '';
        countryDropdown.style.display = 'none';
        
        // Update phone placeholder
        if (phoneInput) {
            const placeholder = this.getPhonePlaceholder(country.code);
            phoneInput.placeholder = placeholder;
        }
        
        console.log(`Ülke seçildi: ${country.name} (${country.code})`);
    }

    formatPhoneNumber(phone, countryCode) {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Format based on country code
        switch (countryCode) {
            case '+1': // US/Canada
                if (cleanPhone.length <= 3) return cleanPhone;
                if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3)}`;
                return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
            
            case '+44': // UK
                if (cleanPhone.length <= 4) return cleanPhone;
                if (cleanPhone.length <= 7) return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4)}`;
                return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
            
            case '+90': // Turkey
                if (cleanPhone.length <= 3) return cleanPhone;
                if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
                if (cleanPhone.length <= 8) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
                return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
            
            case '+49': // Germany
                if (cleanPhone.length <= 3) return cleanPhone;
                if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
                return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
            
            case '+33': // France
                if (cleanPhone.length <= 2) return cleanPhone;
                if (cleanPhone.length <= 4) return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2)}`;
                if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4)}`;
                return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6)}`;
            
            case '+86': // China
                if (cleanPhone.length <= 3) return cleanPhone;
                if (cleanPhone.length <= 7) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
                return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
            
            default:
                // Default formatting for other countries
                if (cleanPhone.length <= 3) return cleanPhone;
                if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
                if (cleanPhone.length <= 9) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
                return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
        }
    }

    getPhonePlaceholder(countryCode) {
        switch (countryCode) {
            case '+1': return '555-123-4567';
            case '+44': return '20 7946 0958';
            case '+90': return '5XX XXX XX XX';
            case '+49': return '30 12345678';
            case '+33': return '1 23 45 67 89';
            case '+86': return '138 0013 8000';
            case '+81': return '90-1234-5678';
            case '+82': return '10-1234-5678';
            case '+91': return '98765 43210';
            case '+55': return '11 99999-9999';
            case '+52': return '55 1234 5678';
            case '+61': return '412 345 678';
            case '+7': return '912 345-67-89';
            default: return 'XXX XXX XXXX';
        }
    }

    handleSocialRegister(provider) {
        this.showNotification(`${provider} ile kayıt yapılıyor...`, 'info');
        
        // Simulate social registration
        setTimeout(() => {
            this.showNotification(`${provider} ile başarıyla kayıt olundu!`, 'success');
            this.updateLoggedInState();
        }, 1500);
    }

    updateLoggedInState() {
        // Update user menu to show logged in state
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.add('logged-in');
        }
        
        console.log('Kullanıcı giriş yaptı - Profil menüsü aktif edildi');
    }

    showModal(modal) {
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StreamMax();
    
    // Ek güvenlik için navigasyon linklerini yeniden kur
    setTimeout(() => {
        if (window.streamMaxApp) {
            window.streamMaxApp.setupNavigationLinks();
        }
    }, 500);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card-bg);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: none;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .search-results-content {
        padding: 20px;
    }
    
    .search-suggestions h4 {
        color: var(--text-primary);
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
    
    .suggestion-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .tag {
        background: var(--gradient-primary);
        color: var(--darker-bg);
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .tag:hover {
        transform: scale(1.05);
    }
    
    .search-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: background 0.2s ease;
    }
    
    .search-result-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .result-info h4 {
        color: var(--text-primary);
        margin-bottom: 5px;
    }
    
    .result-info p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .btn-play-small {
        width: 35px;
        height: 35px;
        border: none;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: var(--darker-bg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    }
    
    .btn-play-small:hover {
        transform: scale(1.1);
    }
    
    .no-results {
        text-align: center;
        color: var(--text-secondary);
        padding: 20px;
    }
    
    .movie-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: var(--card-bg);
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h2 {
        color: var(--text-primary);
        font-size: 1.8rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 2rem;
        cursor: pointer;
        transition: color 0.2s ease;
    }
    
    .modal-close:hover {
        color: var(--primary-color);
    }
    
    .modal-body {
        display: flex;
        gap: 20px;
        padding: 20px;
    }
    
    .movie-poster {
        flex: 0 0 300px;
    }
    
    .movie-poster img {
        width: 100%;
        border-radius: 8px;
    }
    
    .movie-details {
        flex: 1;
    }
    
    .movie-genre {
        color: var(--primary-color);
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .movie-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .movie-actions {
        display: flex;
        gap: 15px;
    }
    
    .added {
        background: var(--gradient-secondary) !important;
        color: var(--darker-bg) !important;
    }
    
    .liked {
        background: var(--gradient-secondary) !important;
        color: var(--darker-bg) !important;
    }
    
    @media (max-width: 768px) {
        .modal-body {
            flex-direction: column;
        }
        
        .movie-poster {
            flex: none;
        }
        
        .movie-actions {
            flex-direction: column;
        }
    }
`;
        document.head.appendChild(style);
    

    // Video Player Functions
    initVideoPlayer() {
        this.videoPlayer = null;
        this.isPlaying = false;
        this.currentVideo = null;
        this.videoData = this.getVideoData();
    }

    getVideoData() {
        return {
            'stranger-things': {
                title: 'Stranger Things',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/stranger-things-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/stranger-things-en.vtt'
                },
                duration: '00:50:00',
                description: 'Hawkins kasabasında garip olaylar yaşanıyor...'
            },
            'the-crown': {
                title: 'The Crown',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-crown-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-crown-en.vtt'
                },
                duration: '01:20:00',
                description: 'Kraliçe II. Elizabeth\'in hayatı...'
            },
            'bridgerton': {
                title: 'Bridgerton',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/bridgerton-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/bridgerton-en.vtt'
                },
                duration: '01:10:00',
                description: 'Regency döneminde aşk ve entrika...'
            },
            'ozark': {
                title: 'Ozark',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/ozark-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/ozark-en.vtt'
                },
                duration: '01:00:00',
                description: 'Para aklama ve suç dünyası...'
            },
            'money-heist': {
                title: 'Money Heist',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/money-heist-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/money-heist-en.vtt'
                },
                duration: '01:15:00',
                description: 'İspanya Kraliyet Darphanesi soygunu...'
            }
        };
    }

    // Comprehensive Movie Database
    getMovieDatabase() {
        return {
            'stranger-things': {
                id: 'stranger-things',
                title: 'Stranger Things',
                originalTitle: 'Stranger Things',
                year: 2016,
                duration: 50,
                rating: 8.7,
                imdbRating: 8.7,
                genre: ['Drama', 'Fantasy', 'Horror', 'Mystery', 'Sci-Fi'],
                director: 'The Duffer Brothers',
                cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
                description: 'Hawkins kasabasında garip olaylar yaşanıyor. Will Byers kaybolduğunda, annesi Joyce ve polis şefi Hopper onu aramaya başlar. Aynı zamanda Will\'in arkadaşları da kendi araştırmalarını yürütür ve garip bir kız olan Eleven ile karşılaşırlar.',
                plot: '1980\'lerde geçen bu dizi, küçük bir kasabada yaşanan doğaüstü olayları ve bir grup çocuğun bu olaylarla mücadelesini anlatıyor.',
                country: 'USA',
                language: 'English',
                type: 'series',
                seasons: 4,
                episodes: 34,
                status: 'Ongoing',
                ageRating: '16+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/stranger-things-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/stranger-things-en.vtt'
                },
                tags: ['netflix', 'sci-fi', 'horror', 'teen', 'supernatural'],
                featured: true,
                trending: true,
                newRelease: false,
                popular: true
            },
            'the-crown': {
                id: 'the-crown',
                title: 'The Crown',
                originalTitle: 'The Crown',
                year: 2016,
                duration: 60,
                rating: 8.6,
                imdbRating: 8.6,
                genre: ['Biography', 'Drama', 'History'],
                director: 'Peter Morgan',
                cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton', 'Matt Smith'],
                description: 'Kraliçe II. Elizabeth\'in hayatı ve saltanatı, 1940\'lardan günümüze kadar olan dönemi kapsayan epik bir drama.',
                plot: 'İngiliz Kraliyet Ailesi\'nin iç dünyasını ve Kraliçe Elizabeth\'in tahta çıkışından itibaren yaşadığı zorlukları anlatıyor.',
                country: 'UK',
                language: 'English',
                type: 'series',
                seasons: 5,
                episodes: 50,
                status: 'Completed',
                ageRating: '16+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-crown-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-crown-en.vtt'
                },
                tags: ['netflix', 'royal', 'drama', 'history', 'biography'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            },
            'bridgerton': {
                id: 'bridgerton',
                title: 'Bridgerton',
                originalTitle: 'Bridgerton',
                year: 2020,
                duration: 60,
                rating: 7.3,
                imdbRating: 7.3,
                genre: ['Drama', 'Romance', 'Period'],
                director: 'Chris Van Dusen',
                cast: ['Phoebe Dynevor', 'Regé-Jean Page', 'Nicola Coughlan', 'Jonathan Bailey'],
                description: 'Regency döneminde geçen bu romantik drama, Bridgerton ailesinin sekiz kardeşinin aşk hayatlarını anlatıyor.',
                plot: '1813 yılında Londra\'da geçen dizi, yüksek sosyete içindeki aşk, entrika ve skandalları işliyor.',
                country: 'USA',
                language: 'English',
                type: 'series',
                seasons: 2,
                episodes: 16,
                status: 'Ongoing',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/bridgerton-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/bridgerton-en.vtt'
                },
                tags: ['netflix', 'romance', 'period', 'drama', 'regency'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            },
            'ozark': {
                id: 'ozark',
                title: 'Ozark',
                originalTitle: 'Ozark',
                year: 2017,
                duration: 60,
                rating: 8.2,
                imdbRating: 8.2,
                genre: ['Crime', 'Drama', 'Thriller'],
                director: 'Bill Dubuque',
                cast: ['Jason Bateman', 'Laura Linney', 'Julia Garner', 'Sofia Hublitz'],
                description: 'Para aklama uzmanı Marty Byrde, ailesiyle birlikte Missouri\'deki Ozark Gölü\'ne taşınır ve burada yeni bir hayat kurmaya çalışır.',
                plot: 'Meksikalı uyuşturucu karteli için para aklayan bir finansal danışmanın hikayesi.',
                country: 'USA',
                language: 'English',
                type: 'series',
                seasons: 4,
                episodes: 44,
                status: 'Completed',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/ozark-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/ozark-en.vtt'
                },
                tags: ['netflix', 'crime', 'drama', 'thriller', 'money-laundering'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            },
            'money-heist': {
                id: 'money-heist',
                title: 'Money Heist',
                originalTitle: 'La Casa de Papel',
                year: 2017,
                duration: 70,
                rating: 8.2,
                imdbRating: 8.2,
                genre: ['Action', 'Crime', 'Drama', 'Thriller'],
                director: 'Álex Pina',
                cast: ['Úrsula Corberó', 'Álvaro Morte', 'Itziar Ituño', 'Pedro Alonso'],
                description: 'İspanya Kraliyet Darphanesi\'ni soymak için toplanan sekiz kişilik bir grup ve onların lideri "Profesör"ün hikayesi.',
                plot: 'Darphane soygunu sırasında rehineler alınır ve polis ile soyguncular arasında psikolojik savaş başlar.',
                country: 'Spain',
                language: 'Spanish',
                type: 'series',
                seasons: 5,
                episodes: 41,
                status: 'Completed',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/money-heist-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/money-heist-en.vtt'
                },
                tags: ['netflix', 'heist', 'crime', 'thriller', 'spanish'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            },
            'extraction-2': {
                id: 'extraction-2',
                title: 'Extraction 2',
                originalTitle: 'Extraction 2',
                year: 2023,
                duration: 123,
                rating: 6.8,
                imdbRating: 6.8,
                genre: ['Action', 'Thriller', 'Crime'],
                director: 'Sam Hargrave',
                cast: ['Chris Hemsworth', 'Golshifteh Farahani', 'Adam Bessa', 'Tornike Gogrichiani'],
                description: 'Tyler Rake, ölümden döndükten sonra yeni bir görev alır. Bu sefer bir hapishaneden kaçırma operasyonu yapacaktır.',
                plot: 'Eski asker Tyler Rake, tehlikeli bir hapishaneden kaçırma operasyonu için geri döner.',
                country: 'USA',
                language: 'English',
                type: 'movie',
                seasons: 0,
                episodes: 1,
                status: 'Released',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/extraction-2-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/extraction-2-en.vtt'
                },
                tags: ['netflix', 'action', 'thriller', 'chris-hemsworth', 'extraction'],
                featured: true,
                trending: true,
                newRelease: true,
                popular: true
            },
            'squid-game': {
                id: 'squid-game',
                title: 'Squid Game',
                originalTitle: '오징어 게임',
                year: 2021,
                duration: 60,
                rating: 8.1,
                imdbRating: 8.1,
                genre: ['Drama', 'Thriller', 'Mystery'],
                director: 'Hwang Dong-hyuk',
                cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-joon', 'Jung Ho-yeon'],
                description: 'Borçlu insanların hayatlarını riske atarak oynadıkları ölümcül oyunlar.',
                plot: 'Maddi sıkıntıda olan 456 kişi, büyük para ödülü için tehlikeli oyunlara katılır.',
                country: 'South Korea',
                language: 'Korean',
                type: 'series',
                seasons: 1,
                episodes: 9,
                status: 'Ongoing',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/squid-game-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/squid-game-en.vtt'
                },
                tags: ['netflix', 'korean', 'thriller', 'survival', 'drama'],
                featured: true,
                trending: true,
                newRelease: false,
                popular: true
            },
            'wednesday': {
                id: 'wednesday',
                title: 'Wednesday',
                originalTitle: 'Wednesday',
                year: 2022,
                duration: 50,
                rating: 8.1,
                imdbRating: 8.1,
                genre: ['Comedy', 'Crime', 'Fantasy', 'Mystery'],
                director: 'Tim Burton',
                cast: ['Jenna Ortega', 'Catherine Zeta-Jones', 'Luis Guzmán', 'Gwendoline Christie'],
                description: 'Wednesday Addams, Nevermore Akademisi\'ne gider ve burada gizemli cinayetleri çözmeye çalışır.',
                plot: 'Addams Ailesi\'nin kızı Wednesday, yeni okulunda doğaüstü yeteneklerini keşfeder.',
                country: 'USA',
                language: 'English',
                type: 'series',
                seasons: 1,
                episodes: 8,
                status: 'Ongoing',
                ageRating: '16+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/wednesday-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/wednesday-en.vtt'
                },
                tags: ['netflix', 'comedy', 'mystery', 'fantasy', 'addams-family'],
                featured: false,
                trending: true,
                newRelease: true,
                popular: true
            },
            'the-witcher': {
                id: 'the-witcher',
                title: 'The Witcher',
                originalTitle: 'The Witcher',
                year: 2019,
                duration: 60,
                rating: 8.2,
                imdbRating: 8.2,
                genre: ['Action', 'Adventure', 'Drama', 'Fantasy'],
                director: 'Lauren Schmidt Hissrich',
                cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan', 'Joey Batey'],
                description: 'Geralt of Rivia, canavarları avlayan bir büyücü. Ciri ile tanıştığında hayatı değişir.',
                plot: 'Fantastik dünyada geçen bu dizi, büyücü Geralt\'ın maceralarını anlatıyor.',
                country: 'USA',
                language: 'English',
                type: 'series',
                seasons: 3,
                episodes: 24,
                status: 'Ongoing',
                ageRating: '18+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-witcher-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/the-witcher-en.vtt'
                },
                tags: ['netflix', 'fantasy', 'action', 'adventure', 'henry-cavill'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            },
            'lupin': {
                id: 'lupin',
                title: 'Lupin',
                originalTitle: 'Lupin',
                year: 2021,
                duration: 50,
                rating: 7.5,
                imdbRating: 7.5,
                genre: ['Crime', 'Drama', 'Mystery', 'Thriller'],
                director: 'George Kay',
                cast: ['Omar Sy', 'Ludivine Sagnier', 'Clotilde Hesme', 'Vincent Londez'],
                description: 'Assane Diop, babasının intikamını almak için Arsène Lupin\'in hikayelerinden ilham alır.',
                plot: 'Modern Paris\'te geçen bu dizi, hırsız Assane\'nin maceralarını anlatıyor.',
                country: 'France',
                language: 'French',
                type: 'series',
                seasons: 3,
                episodes: 17,
                status: 'Ongoing',
                ageRating: '16+',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                backdrop: 'https://images.unsplash.com/photo-1489599808660-0b8b4b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                subtitles: {
                    tr: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/lupin-tr.vtt',
                    en: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/subtitles/lupin-en.vtt'
                },
                tags: ['netflix', 'french', 'crime', 'mystery', 'thriller'],
                featured: false,
                trending: true,
                newRelease: false,
                popular: true
            }
        };
    }

    setupVideoPlayerEvents() {
        // Video player modal events
        const videoModal = document.getElementById('videoPlayerModal');
        const videoCloseBtn = document.getElementById('videoCloseBtn');
        const videoPlayer = document.getElementById('videoPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const subtitleBtn = document.getElementById('subtitleBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const progressBar = document.querySelector('.video-progress-bar');
        const progressFilled = document.getElementById('videoProgressFilled');
        const progressHandle = document.getElementById('videoProgressHandle');
        const currentTimeEl = document.getElementById('currentTime');
        const totalTimeEl = document.getElementById('totalTime');

        // Close video player
        if (videoCloseBtn) {
            videoCloseBtn.addEventListener('click', () => this.closeVideoPlayer());
        }

        // Close on background click
        if (videoModal) {
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    this.closeVideoPlayer();
                }
            });
        }

        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Volume controls
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleMute());
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        // Fullscreen button
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Subtitle button
        if (subtitleBtn) {
            subtitleBtn.addEventListener('click', () => this.showSubtitleSettings());
        }

        // Settings button
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showVideoSettings());
        }

        // Progress bar
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekTo(e));
        }

        // Video events
        if (videoPlayer) {
            videoPlayer.addEventListener('loadedmetadata', () => this.updateVideoInfo());
            videoPlayer.addEventListener('timeupdate', () => this.updateProgress());
            videoPlayer.addEventListener('play', () => this.onPlay());
            videoPlayer.addEventListener('pause', () => this.onPause());
            videoPlayer.addEventListener('ended', () => this.onEnded());
            videoPlayer.addEventListener('waiting', () => this.showLoading());
            videoPlayer.addEventListener('canplay', () => this.hideLoading());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleVideoKeyboard(e));
    }

    openVideoPlayer(videoId) {
        const videoData = this.videoData[videoId];
        if (!videoData) {
            this.showNotification('Video bulunamadı!', 'error');
            return;
        }

        this.currentVideo = videoData;
        const videoModal = document.getElementById('videoPlayerModal');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoSource = document.getElementById('videoSource');
        const videoTitle = document.getElementById('videoTitle');
        const subtitleTrack = document.getElementById('subtitleTrack');

        if (videoModal && videoPlayer && videoSource && videoTitle) {
            // Set video data
            videoTitle.textContent = videoData.title;
            videoSource.src = videoData.videoUrl;
            videoPlayer.load();

            // Set subtitles
            if (subtitleTrack && videoData.subtitles) {
                const currentLang = localStorage.getItem('selectedLanguage') || 'tr';
                const subtitleUrl = videoData.subtitles[currentLang] || videoData.subtitles.tr;
                if (subtitleUrl) {
                    subtitleTrack.src = subtitleUrl;
                    subtitleTrack.srclang = currentLang;
                }
            }

            // Show modal
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Auto play after a short delay
            setTimeout(() => {
                this.playVideo();
            }, 500);
        }
    }

    closeVideoPlayer() {
        const videoModal = document.getElementById('videoPlayerModal');
        const videoPlayer = document.getElementById('videoPlayer');

        if (videoModal) {
            videoModal.classList.remove('show');
            document.body.style.overflow = '';
        }

        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        }

        this.currentVideo = null;
        this.isPlaying = false;
    }

    togglePlayPause() {
        const videoPlayer = document.getElementById('videoPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn?.querySelector('i');

        if (!videoPlayer) return;

        if (videoPlayer.paused) {
            this.playVideo();
        } else {
            this.pauseVideo();
        }
    }

    playVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn?.querySelector('i');

        if (videoPlayer && playIcon) {
            videoPlayer.play();
            this.isPlaying = true;
            playIcon.className = 'fas fa-pause';
        }
    }

    pauseVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn?.querySelector('i');

        if (videoPlayer && playIcon) {
            videoPlayer.pause();
            this.isPlaying = false;
            playIcon.className = 'fas fa-play';
        }
    }

    toggleMute() {
        const videoPlayer = document.getElementById('videoPlayer');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeIcon = volumeBtn?.querySelector('i');

        if (videoPlayer && volumeIcon) {
            if (videoPlayer.muted) {
                videoPlayer.muted = false;
                volumeIcon.className = 'fas fa-volume-up';
            } else {
                videoPlayer.muted = true;
                volumeIcon.className = 'fas fa-volume-mute';
            }
        }
    }

    setVolume(value) {
        const videoPlayer = document.getElementById('videoPlayer');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeIcon = volumeBtn?.querySelector('i');

        if (videoPlayer && volumeIcon) {
            videoPlayer.volume = value / 100;
            
            if (value == 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (value < 50) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
    }

    toggleFullscreen() {
        const videoPlayer = document.getElementById('videoPlayer');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const fullscreenIcon = fullscreenBtn?.querySelector('i');

        if (!videoPlayer) return;

        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen().then(() => {
                if (fullscreenIcon) {
                    fullscreenIcon.className = 'fas fa-compress';
                }
            });
        } else {
            document.exitFullscreen().then(() => {
                if (fullscreenIcon) {
                    fullscreenIcon.className = 'fas fa-expand';
                }
            });
        }
    }

    showSubtitleSettings() {
        const subtitleModal = document.getElementById('subtitleSettingsModal');
        if (subtitleModal) {
            subtitleModal.classList.add('show');
        }
    }

    showVideoSettings() {
        this.showNotification('Video ayarları yakında eklenecek!', 'info');
    }

    seekTo(e) {
        const videoPlayer = document.getElementById('videoPlayer');
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const duration = videoPlayer.duration;

        if (videoPlayer && duration) {
            videoPlayer.currentTime = pos * duration;
        }
    }

    updateVideoInfo() {
        const videoPlayer = document.getElementById('videoPlayer');
        const totalTimeEl = document.getElementById('totalTime');

        if (videoPlayer && totalTimeEl) {
            const duration = this.formatTime(videoPlayer.duration);
            totalTimeEl.textContent = duration;
        }
    }

    updateProgress() {
        const videoPlayer = document.getElementById('videoPlayer');
        const progressFilled = document.getElementById('videoProgressFilled');
        const progressHandle = document.getElementById('videoProgressHandle');
        const currentTimeEl = document.getElementById('currentTime');

        if (videoPlayer && progressFilled && progressHandle && currentTimeEl) {
            const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
            progressFilled.style.width = progress + '%';
            progressHandle.style.left = progress + '%';
            currentTimeEl.textContent = this.formatTime(videoPlayer.currentTime);
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.hideLoading();
    }

    onPause() {
        this.isPlaying = false;
    }

    onEnded() {
        this.isPlaying = false;
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn?.querySelector('i');
        
        if (playIcon) {
            playIcon.className = 'fas fa-play';
        }
    }

    showLoading() {
        const loading = document.getElementById('videoLoading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    hideLoading() {
        const loading = document.getElementById('videoLoading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleVideoKeyboard(e) {
        const videoModal = document.getElementById('videoPlayerModal');
        if (!videoModal || !videoModal.classList.contains('show')) return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'Escape':
                this.closeVideoPlayer();
                break;
            case 'KeyF':
                this.toggleFullscreen();
                break;
            case 'KeyM':
                this.toggleMute();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.seekRelative(-10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.seekRelative(10);
                break;
        }
    }

    seekRelative(seconds) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime + seconds);
        }
    }

    // Touch Gesture System
    setupTouchGestures() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
        this.touchEndTime = 0;
        this.touchStartDistance = 0;
        this.touchStartScale = 1;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (!this.isTouchDevice) return;
        
        // Add touch event listeners to document
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Add touch events to video player
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.addEventListener('touchstart', (e) => this.handleVideoTouchStart(e), { passive: false });
            videoPlayer.addEventListener('touchmove', (e) => this.handleVideoTouchMove(e), { passive: false });
            videoPlayer.addEventListener('touchend', (e) => this.handleVideoTouchEnd(e), { passive: false });
        }
        
        // Add touch events to movie cards for swipe navigation
        this.setupMovieCardTouchGestures();
        
        console.log('Touch gesture system initialized');
    }

    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        
        if (e.touches.length === 1) {
            // Single touch
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            // Multi-touch (pinch)
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            this.touchStartDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            this.touchStartScale = 1;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 2) {
            // Pinch gesture
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (this.touchStartDistance > 0) {
                const scale = currentDistance / this.touchStartDistance;
                this.handlePinchZoom(scale);
            }
        }
    }

    handleTouchEnd(e) {
        this.touchEndTime = Date.now();
        const touchDuration = this.touchEndTime - this.touchStartTime;
        
        if (e.changedTouches.length === 1) {
            // Single touch end
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            // Only process if touch was short (not a long press)
            if (touchDuration < 500) {
                this.handleSwipeGesture();
            }
        }
    }

    handleSwipeGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 50;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right
                this.handleSwipeRight();
            } else {
                // Swipe left
                this.handleSwipeLeft();
            }
        }
        // Check if it's a vertical swipe
        else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // Swipe down
                this.handleSwipeDown();
            } else {
                // Swipe up
                this.handleSwipeUp();
            }
        }
    }

    handleSwipeLeft() {
        // Navigate to next movie in carousel
        const movieCarousel = document.querySelector('.movie-carousel');
        if (movieCarousel) {
            const scrollAmount = movieCarousel.clientWidth;
            movieCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        
        // Close mobile menu if open
        const nav = document.querySelector('.nav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleSwipeRight() {
        // Navigate to previous movie in carousel
        const movieCarousel = document.querySelector('.movie-carousel');
        if (movieCarousel) {
            const scrollAmount = movieCarousel.clientWidth;
            movieCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }

    handleSwipeUp() {
        // Show search suggestions or open search
        const searchInput = document.getElementById('searchInput');
        if (searchInput && !searchInput.value) {
            searchInput.focus();
            this.showSearchHistory();
        }
    }

    handleSwipeDown() {
        // Close modals or go back
        const openModal = document.querySelector('.movie-modal.show');
        if (openModal) {
            this.closeModal(openModal);
        } else {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    handlePinchZoom(scale) {
        // Handle pinch-to-zoom for video player
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer && videoPlayer.closest('.video-player-modal.show')) {
            const currentScale = this.touchStartScale * scale;
            videoPlayer.style.transform = `scale(${Math.min(Math.max(currentScale, 0.5), 2)})`;
        }
    }

    setupMovieCardTouchGestures() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            
            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            card.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                touchEndY = e.changedTouches[0].clientY;
                
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const minSwipeDistance = 30;
                
                // Check if it's a tap (not a swipe)
                if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
                    // Handle tap on movie card
                    this.handleMovieCardTap(card);
                }
            }, { passive: true });
        });
    }

    handleMovieCardTap(card) {
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Play movie
        this.playMovie(card);
    }

    handleVideoTouchStart(e) {
        this.videoTouchStartX = e.touches[0].clientX;
        this.videoTouchStartY = e.touches[0].clientY;
        this.videoTouchStartTime = Date.now();
    }

    handleVideoTouchMove(e) {
        // Prevent default to avoid scrolling while touching video
        e.preventDefault();
    }

    handleVideoTouchEnd(e) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer) return;
        
        const deltaX = e.changedTouches[0].clientX - this.videoTouchStartX;
        const deltaY = e.changedTouches[0].clientY - this.videoTouchStartY;
        const touchDuration = Date.now() - this.videoTouchStartTime;
        const minSwipeDistance = 50;
        
        // Handle video controls based on touch gestures
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            // Horizontal swipe - seek video
            if (deltaX > 0) {
                // Swipe right - seek forward
                this.seekRelative(10);
                this.showVideoFeedback('+10s');
            } else {
                // Swipe left - seek backward
                this.seekRelative(-10);
                this.showVideoFeedback('-10s');
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            // Vertical swipe - volume control
            if (deltaY > 0) {
                // Swipe down - decrease volume
                this.adjustVolume(-10);
            } else {
                // Swipe up - increase volume
                this.adjustVolume(10);
            }
        } else if (touchDuration < 300) {
            // Tap - toggle play/pause
            this.togglePlayPause();
        }
    }

    adjustVolume(change) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            const newVolume = Math.min(100, Math.max(0, (videoPlayer.volume * 100) + change));
            this.setVolume(newVolume);
            this.showVideoFeedback(`Volume: ${Math.round(newVolume)}%`);
        }
    }

    showVideoFeedback(message) {
        // Create or update feedback element
        let feedback = document.getElementById('videoTouchFeedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'videoTouchFeedback';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.style.opacity = '1';
        
        // Hide after 1 second
        setTimeout(() => {
            feedback.style.opacity = '0';
        }, 1000);
    }

    // Mobile Video Player Optimization
    optimizeMobileVideoPlayer() {
        if (!this.isTouchDevice) return;
        
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer) return;
        
        // Add mobile-specific video controls
        videoPlayer.setAttribute('playsinline', 'true');
        videoPlayer.setAttribute('webkit-playsinline', 'true');
        
        // Add touch-friendly controls
        this.addMobileVideoControls();
        
        // Optimize video loading for mobile
        videoPlayer.addEventListener('loadstart', () => {
            this.showLoading();
        });
        
        videoPlayer.addEventListener('canplay', () => {
            this.hideLoading();
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }

    addMobileVideoControls() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer) return;
        
        // Add double-tap to play/pause
        let lastTap = 0;
        videoPlayer.addEventListener('touchend', (e) => {
            const currentTime = Date.now();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap
                this.togglePlayPause();
            }
            
            lastTap = currentTime;
        });
        
        // Add long press for settings
        let longPressTimer;
        videoPlayer.addEventListener('touchstart', () => {
            longPressTimer = setTimeout(() => {
                this.showVideoSettings();
            }, 800);
        });
        
        videoPlayer.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
        
        videoPlayer.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });
    }

    handleOrientationChange() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer && videoPlayer.closest('.video-player-modal.show')) {
            // Reset video scale on orientation change
            videoPlayer.style.transform = '';
            
            // Adjust video size for new orientation
            setTimeout(() => {
                videoPlayer.style.width = '100%';
                videoPlayer.style.height = '100%';
            }, 100);
        }
    }

    // Movie Recommendation System
    setupMovieRecommendations(currentMovie) {
        const movieDatabase = this.getMovieDatabase();
        const recommendations = this.getMovieRecommendations(currentMovie, movieDatabase);
        
        // Update recommendation sections
        this.updateRecommendationSection('trending', recommendations.trending);
        this.updateRecommendationSection('popular', recommendations.popular);
        this.updateRecommendationSection('new', recommendations.new);
        this.updateRecommendationSection('featured', recommendations.featured);
        
        console.log('Movie recommendations updated based on:', currentMovie.title);
    }

    getMovieRecommendations(currentMovie, movieDatabase) {
        const allMovies = Object.values(movieDatabase);
        
        // Filter out current movie
        const otherMovies = allMovies.filter(movie => movie.id !== currentMovie.id);
        
        // Get movies with similar genres
        const similarGenres = otherMovies.filter(movie => 
            movie.genre.some(genre => currentMovie.genre.includes(genre))
        );
        
        // Get movies with similar rating range
        const similarRating = otherMovies.filter(movie => 
            Math.abs(movie.rating - currentMovie.rating) <= 1.0
        );
        
        // Get movies from same director
        const sameDirector = otherMovies.filter(movie => 
            movie.director === currentMovie.director
        );
        
        // Get movies with same cast members
        const sameCast = otherMovies.filter(movie => 
            movie.cast.some(actor => currentMovie.cast.includes(actor))
        );
        
        // Combine recommendations with weights
        const recommendations = {
            trending: this.getWeightedRecommendations(similarGenres, similarRating, 0.6, 0.4),
            popular: this.getWeightedRecommendations(sameDirector, sameCast, 0.7, 0.3),
            new: this.getWeightedRecommendations(similarGenres, similarRating, 0.5, 0.5),
            featured: this.getWeightedRecommendations(sameCast, similarRating, 0.8, 0.2)
        };
        
        // Ensure each category has at least 6 movies
        Object.keys(recommendations).forEach(category => {
            if (recommendations[category].length < 6) {
                const additionalMovies = otherMovies
                    .filter(movie => !recommendations[category].includes(movie))
                    .slice(0, 6 - recommendations[category].length);
                recommendations[category] = [...recommendations[category], ...additionalMovies];
            }
        });
        
        return recommendations;
    }

    getWeightedRecommendations(primary, secondary, primaryWeight, secondaryWeight) {
        const combined = [...primary, ...secondary];
        const unique = combined.filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id)
        );
        
        // Sort by rating and return top movies
        return unique
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 12);
    }

    updateRecommendationSection(category, movies) {
        const categorySection = document.querySelector(`[data-category="${category}"]`);
        if (!categorySection) return;
        
        const movieRow = categorySection.querySelector('.movie-row');
        if (!movieRow) return;
        
        // Clear existing movies
        movieRow.innerHTML = '';
        
        // Add new movies
        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            movieRow.appendChild(movieCard);
        });
        
        // Add fade-in animation
        const movieCards = movieRow.querySelectorAll('.movie-card');
        movieCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    // Trending Content System
    setupTrendingContent() {
        const movieDatabase = this.getMovieDatabase();
        const trendingMovies = this.getTrendingMovies(movieDatabase);
        
        // Update trending section
        this.updateTrendingSection(trendingMovies);
        
        // Set up trending rotation
        this.setupTrendingRotation(trendingMovies);
    }

    getTrendingMovies(movieDatabase) {
        const allMovies = Object.values(movieDatabase);
        
        // Calculate trending score based on multiple factors
        const trendingMovies = allMovies.map(movie => {
            let score = 0;
            
            // Base rating score
            score += movie.rating * 2;
            
            // IMDB rating bonus
            score += movie.imdbRating * 1.5;
            
            // New release bonus
            if (movie.newRelease) score += 5;
            
            // Popular bonus
            if (movie.popular) score += 3;
            
            // Featured bonus
            if (movie.featured) score += 2;
            
            // Recent year bonus
            const currentYear = new Date().getFullYear();
            const yearDiff = currentYear - movie.year;
            if (yearDiff <= 2) score += 2;
            else if (yearDiff <= 5) score += 1;
            
            return { ...movie, trendingScore: score };
        });
        
        // Sort by trending score and return top movies
        return trendingMovies
            .sort((a, b) => b.trendingScore - a.trendingScore)
            .slice(0, 20);
    }

    updateTrendingSection(trendingMovies) {
        const trendingSection = document.querySelector('[data-category="trending"]');
        if (!trendingSection) return;
        
        const movieRow = trendingSection.querySelector('.movie-row');
        if (!movieRow) return;
        
        // Clear existing movies
        movieRow.innerHTML = '';
        
        // Add trending movies
        trendingMovies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            movieRow.appendChild(movieCard);
        });
        
        // Add trending badge to first 3 movies
        const movieCards = movieRow.querySelectorAll('.movie-card');
        movieCards.forEach((card, index) => {
            if (index < 3) {
                const badge = document.createElement('div');
                badge.className = 'trending-badge';
                badge.textContent = '🔥 TRENDING';
                badge.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    z-index: 2;
                `;
                card.appendChild(badge);
            }
        });
    }

    setupTrendingRotation(trendingMovies) {
        // Rotate trending content every 30 seconds
        setInterval(() => {
            const shuffled = [...trendingMovies].sort(() => Math.random() - 0.5);
            this.updateTrendingSection(shuffled);
        }, 30000);
    }

    // Page Navigation System
    setupPageNavigation() {
        this.currentPage = 'home';
        this.pageHistory = [];
        this.setupPageTransitions();
        this.setupPageRoutes();
    }

    setupPageTransitions() {
        // Add page transition styles
        const style = document.createElement('style');
        style.textContent = `
            .page-transition {
                transition: all 0.3s ease-in-out;
            }
            
            .page-enter {
                opacity: 0;
                transform: translateX(100%);
            }
            
            .page-enter-active {
                opacity: 1;
                transform: translateX(0);
            }
            
            .page-exit {
                opacity: 1;
                transform: translateX(0);
            }
            
            .page-exit-active {
                opacity: 0;
                transform: translateX(-100%);
            }
            
            .page-content {
                min-height: 100vh;
                padding-top: 80px;
            }
            
            .page-header {
                background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
                padding: 20px 0;
                margin-bottom: 30px;
            }
            
            .page-title {
                font-size: 2.5rem;
                font-weight: bold;
                color: white;
                text-align: center;
                margin-bottom: 10px;
            }
            
            .page-subtitle {
                font-size: 1.2rem;
                color: #ccc;
                text-align: center;
                margin-bottom: 20px;
            }
            
            .breadcrumb {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                color: #999;
                font-size: 0.9rem;
            }
            
            .breadcrumb a {
                color: #999;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .breadcrumb a:hover {
                color: var(--primary-color);
            }
            
            .breadcrumb-separator {
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }

    setupPageRoutes() {
        // Define page routes
        this.routes = {
            'home': {
                title: 'Ana Sayfa',
                subtitle: 'Sınırsız eğlence, istediğiniz yerde',
                content: this.getHomePageContent.bind(this)
            },
            'movies': {
                title: 'Filmler',
                subtitle: 'En iyi filmler ve yeni çıkanlar',
                content: this.getMoviesPageContent.bind(this)
            },
            'series': {
                title: 'Diziler',
                subtitle: 'Popüler diziler ve yeni sezonlar',
                content: this.getSeriesPageContent.bind(this)
            },
            'trending': {
                title: 'Trend Olanlar',
                subtitle: 'Şu anda en çok izlenen içerikler',
                content: this.getTrendingPageContent.bind(this)
            },
            'mylist': {
                title: 'Listem',
                subtitle: 'İzleme listenizdeki içerikler',
                content: this.getMyListPageContent.bind(this)
            }
        };
    }

    navigateToPage(pageId, addToHistory = true) {
        if (this.routes[pageId]) {
            // Add to history if requested
            if (addToHistory) {
                this.pageHistory.push(this.currentPage);
            }
            
            // Update current page
            this.currentPage = pageId;
            
            // Get page content
            const page = this.routes[pageId];
            const content = page.content();
            
            // Create page container
            const pageContainer = document.createElement('div');
            pageContainer.className = 'page-content page-transition';
            pageContainer.innerHTML = `
                <div class="page-header">
                    <div class="container">
                        <h1 class="page-title">${page.title}</h1>
                        <p class="page-subtitle">${page.subtitle}</p>
                        <div class="breadcrumb">
                            <a href="#" data-page="home">Ana Sayfa</a>
                            <span class="breadcrumb-separator">></span>
                            <span>${page.title}</span>
                        </div>
                    </div>
                </div>
                <div class="container">
                    ${content}
                </div>
            `;
            
            // Hide current content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            
            // Add page to body
            document.body.appendChild(pageContainer);
            
            // Add back button functionality
            this.setupBackButton(pageContainer);
            
            // Update navigation active state
            this.updateNavigationActiveState(pageId);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log(`Navigated to page: ${pageId}`);
        }
    }

    setupBackButton(pageContainer) {
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Geri';
        backButton.style.cssText = `
            position: fixed;
            top: 100px;
            left: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        backButton.addEventListener('click', () => {
            this.goBack();
        });
        
        pageContainer.appendChild(backButton);
    }

    goBack() {
        if (this.pageHistory.length > 0) {
            const previousPage = this.pageHistory.pop();
            this.navigateToPage(previousPage, false);
        } else {
            this.navigateToPage('home', false);
        }
    }

    updateNavigationActiveState(pageId) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        const currentLink = document.querySelector(`[data-section="${pageId}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    getHomePageContent() {
        return `
            <div class="hero-section">
                <div class="hero-content">
                    <h2>Sınırsız Film, Dizi ve Çok Daha Fazlası</h2>
                    <p>İstediğiniz yerde izleyin. İstediğiniz zaman iptal edin.</p>
                    <div class="hero-buttons">
                        <button class="btn btn-primary hero-play-btn">
                            <i class="fas fa-play"></i>
                            Oynat
                        </button>
                        <button class="btn btn-secondary hero-info-btn">
                            <i class="fas fa-info-circle"></i>
                            Daha Fazla Bilgi
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="categories">
                <div class="category-section" data-category="trending">
                    <h3>Trend Olanlar</h3>
                    <div class="movie-row"></div>
                </div>
                
                <div class="category-section" data-category="popular">
                    <h3>Popüler Filmler</h3>
                    <div class="movie-row"></div>
                </div>
                
                <div class="category-section" data-category="new">
                    <h3>Yeni Çıkanlar</h3>
                    <div class="movie-row"></div>
                </div>
            </div>
        `;
    }

    getMoviesPageContent() {
        const movieDatabase = this.getMovieDatabase();
        const movies = Object.values(movieDatabase).filter(movie => movie.type === 'movie');
        
        return `
            <div class="movies-grid">
                <div class="movies-header">
                    <h3>Tüm Filmler</h3>
                    <div class="movies-filters">
                        <select class="filter-select" id="genreFilter">
                            <option value="">Tüm Türler</option>
                            <option value="Action">Aksiyon</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedy">Komedi</option>
                            <option value="Thriller">Gerilim</option>
                            <option value="Romance">Romantik</option>
                        </select>
                        <select class="filter-select" id="yearFilter">
                            <option value="">Tüm Yıllar</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                        </select>
                    </div>
                </div>
                <div class="movies-list">
                    ${movies.map(movie => this.createMovieCard(movie).outerHTML).join('')}
                </div>
            </div>
        `;
    }

    getSeriesPageContent() {
        const movieDatabase = this.getMovieDatabase();
        const series = Object.values(movieDatabase).filter(movie => movie.type === 'series');
        
        return `
            <div class="series-grid">
                <div class="series-header">
                    <h3>Tüm Diziler</h3>
                    <div class="series-filters">
                        <select class="filter-select" id="statusFilter">
                            <option value="">Tüm Durumlar</option>
                            <option value="Ongoing">Devam Eden</option>
                            <option value="Completed">Tamamlanan</option>
                        </select>
                        <select class="filter-select" id="seasonsFilter">
                            <option value="">Tüm Sezonlar</option>
                            <option value="1">1 Sezon</option>
                            <option value="2">2 Sezon</option>
                            <option value="3+">3+ Sezon</option>
                        </select>
                    </div>
                </div>
                <div class="series-list">
                    ${series.map(series => this.createSeriesCard(series).outerHTML).join('')}
                </div>
            </div>
        `;
    }

    getTrendingPageContent() {
        const movieDatabase = this.getMovieDatabase();
        const trendingMovies = this.getTrendingMovies(movieDatabase);
        
        return `
            <div class="trending-grid">
                <div class="trending-header">
                    <h3>Şu Anda Trend Olanlar</h3>
                    <p>En çok izlenen ve beğenilen içerikler</p>
                </div>
                <div class="trending-list">
                    ${trendingMovies.map(movie => this.createTrendingCard(movie).outerHTML).join('')}
                </div>
            </div>
        `;
    }

    getMyListPageContent() {
        return `
            <div class="mylist-grid">
                <div class="mylist-header">
                    <h3>İzleme Listem</h3>
                    <p>Daha sonra izlemek için eklediğiniz içerikler</p>
                </div>
                <div class="mylist-list">
                    <div class="empty-list">
                        <i class="fas fa-list"></i>
                        <h4>Liste Boş</h4>
                        <p>Henüz hiçbir içerik eklemediniz. Film ve dizi kartlarındaki + butonuna tıklayarak içerik ekleyebilirsiniz.</p>
                    </div>
                </div>
            </div>
        `;
    }

    createSeriesCard(series) {
        const card = document.createElement('div');
        card.className = 'series-card movie-card';
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${series.poster}" alt="${series.title}" loading="lazy">
                <div class="movie-overlay">
                    <button class="play-btn" data-movie-id="${series.id}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="add-btn" data-movie-id="${series.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h4>${series.title}</h4>
                <p class="movie-year">${series.year}</p>
                <p class="movie-genre">${series.genre.join(', ')}</p>
                <div class="movie-rating">
                    <span class="rating">${series.rating}/10</span>
                    <span class="age-rating">${series.ageRating}</span>
                </div>
                <div class="series-info">
                    <span class="seasons">${series.seasons} Sezon</span>
                    <span class="episodes">${series.episodes} Bölüm</span>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.setupMovieCardEvents(card);
        
        return card;
    }

    createTrendingCard(movie) {
        const card = document.createElement('div');
        card.className = 'trending-card movie-card';
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                <div class="movie-overlay">
                    <button class="play-btn" data-movie-id="${movie.id}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="add-btn" data-movie-id="${movie.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="trending-badge">
                    <i class="fas fa-fire"></i>
                    TRENDING
                </div>
            </div>
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-genre">${movie.genre.join(', ')}</p>
                <div class="movie-rating">
                    <span class="rating">${movie.rating}/10</span>
                    <span class="age-rating">${movie.ageRating}</span>
                </div>
                <div class="trending-score">
                    <span class="score">Trend Skoru: ${Math.round(movie.trendingScore || 0)}</span>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.setupMovieCardEvents(card);
        
        return card;
    }


// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new StreamMax();
});
