/**
 * Button Activator - StreamMax Netflix Clone
 * Tüm Butonları Aktif Hale Getir
 */

class StreamMaxButtonActivator {
    constructor() {
        this.init();
        this.bindEvents();
        this.activateAllButtons();
    }

    init() {
        console.log('StreamMax Button Activator initialized');
        this.setupNotifications();
    }

    bindEvents() {
        this.activateAllButtons();
        
        // Dinamik butonlar için observer
        const observer = new MutationObserver(() => {
            this.activateAllButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    activateAllButtons() {
        this.activateNavigationButtons();
        this.activateHeroButtons();
        this.activateMovieCards();
        this.activateSearchButton();
        // activateUserMenu'yu streamMaxApp hazır olduktan sonra çağır
        this.activateUserMenuWithDelay();
        this.activateFooterLinks();
    }
    
    activateUserMenuWithDelay() {
        // streamMaxApp hazır olana kadar bekle
        if (window.streamMaxApp) {
            console.log('streamMaxApp hazır, activateUserMenu çağrılıyor');
            this.activateUserMenu();
        } else {
            // En fazla 5 saniye bekle
            let attempts = 0;
            const maxAttempts = 50; // 50 * 100ms = 5 saniye
            const interval = setInterval(() => {
                attempts++;
                if (window.streamMaxApp) {
                    clearInterval(interval);
                    console.log('streamMaxApp hazır, activateUserMenu çağrılıyor');
                    this.activateUserMenu();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.warn('streamMaxApp 5 saniye içinde hazır olmadı, activateUserMenu yine de çağrılıyor');
                    this.activateUserMenu();
                }
            }, 100);
        }
    }

    activateNavigationButtons() {
        // Sadece .nav-link class'ına sahip link'leri seç (header'daki navigasyon butonları)
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`button-activator.js: ${navLinks.length} adet navigasyon linki bulundu`);
        
        // Önce tüm mevcut event listener'ları temizlemek için data attribute kullan
        navLinks.forEach((link, index) => {
            // Eğer zaten işaretlenmişse atla
            if (link.dataset.buttonActivatorHandled === 'true') {
                console.log(`button-activator.js: Link ${index + 1} zaten işlenmiş, atlanıyor`);
                return;
            }
            
            // İşaretle
            link.dataset.buttonActivatorHandled = 'true';
            
            // Yeni event listener ekle (capture phase'de çalıştır ki diğer listener'lardan önce çalışsın)
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`button-activator.js: Nav link tıklandı: ${link.textContent.trim()}, section: ${link.getAttribute('data-section')}`);
                this.handleNavigationClick(link);
            }, true); // capture phase
            
            console.log(`button-activator.js: Link ${index + 1} (${link.textContent.trim()}) için event listener eklendi`);
        });
        
        console.log('button-activator.js: Navigasyon butonları aktifleştirildi!');
    }

    activateHeroButtons() {
        const heroButtons = document.querySelectorAll('.hero .btn');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleHeroButtonClick(button);
            });
        });
    }

    activateMovieCards() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMovieCardClick(card, e);
            });
        });

        // Movie action buttons
        const actionButtons = document.querySelectorAll('.btn-play, .btn-add, .btn-like');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMovieActionClick(button);
            });
        });
    }

    activateSearchButton() {
        const searchButton = document.querySelector('.search-switch');
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearch();
            });
        }

        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
        }
    }

    activateUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenu && userDropdown) {
            // Duplicate listener kontrolü
            if (userMenu.dataset.buttonActivatorHandled === 'true') {
                return;
            }
            userMenu.dataset.buttonActivatorHandled = 'true';
            
            // Dropdown'ı başlangıçta gizle
            userDropdown.style.display = 'none';
            userDropdown.classList.remove('show');
            
            // Profil menü butonuna click event
            userMenu.addEventListener('click', (e) => {
                // Eğer dropdown içindeki bir öğeye tıklandıysa, bu event'i işleme
                if (userDropdown.contains(e.target)) {
                    return;
                }
                e.stopPropagation();
                this.toggleUserMenu();
            }, true); // capture phase
            
            // Dropdown menü öğelerine direkt event listener ekle
            const setupDropdownItems = () => {
                const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');
                console.log(`activateUserMenu: ${dropdownItems.length} adet dropdown item bulundu`);
                
                dropdownItems.forEach((item, index) => {
                    // Duplicate listener kontrolü
                    if (item.dataset.buttonActivatorHandled === 'true') {
                        console.log(`Dropdown item ${index + 1} zaten işlenmiş, atlanıyor`);
                        return;
                    }
                    item.dataset.buttonActivatorHandled = 'true';
                    
                    const href = item.getAttribute('href');
                    const action = href ? href.substring(1) : '';
                    console.log(`Dropdown item ${index + 1} için event listener ekleniyor: ${action}`);
                    
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Dropdown item tıklandı:', action, item);
                        
                        // Dropdown'ı kapat
                        userDropdown.style.display = 'none';
                        userDropdown.classList.remove('show');
                        
                        // StreamMax instance'ını bekle veya direkt çağır
                        const executeAction = () => {
                            if (!window.streamMaxApp) {
                                console.error('window.streamMaxApp bulunamadı!');
                                return;
                            }
                            
                            console.log('executeAction çağrılıyor, action:', action);
                            
                            // Dropdown item işlemleri - Gerçek işlevleri çağır
                            if (action === 'login') {
                                if (typeof window.streamMaxApp.showLoginModal === 'function') {
                                    console.log('showLoginModal çağrılıyor');
                                    try {
                                        window.streamMaxApp.showLoginModal();
                                    } catch (error) {
                                        console.error('showLoginModal hatası:', error);
                                    }
                                } else {
                                    console.error('showLoginModal metodu bulunamadı', {
                                        availableMethods: Object.keys(window.streamMaxApp).filter(key => typeof window.streamMaxApp[key] === 'function')
                                    });
                                }
                            } else if (action === 'profile') {
                                if (typeof window.streamMaxApp.showProfileModal === 'function') {
                                    console.log('showProfileModal çağrılıyor');
                                    try {
                                        window.streamMaxApp.showProfileModal();
                                    } catch (error) {
                                        console.error('showProfileModal hatası:', error);
                                    }
                                } else {
                                    console.error('showProfileModal metodu bulunamadı');
                                }
                            } else if (action === 'settings') {
                                if (typeof window.streamMaxApp.showSettingsModal === 'function') {
                                    console.log('showSettingsModal çağrılıyor');
                                    try {
                                        window.streamMaxApp.showSettingsModal();
                                    } catch (error) {
                                        console.error('showSettingsModal hatası:', error);
                                    }
                                } else {
                                    console.error('showSettingsModal metodu bulunamadı');
                                }
                            } else if (action === 'help') {
                                if (typeof window.streamMaxApp.showHelpModal === 'function') {
                                    console.log('showHelpModal çağrılıyor');
                                    try {
                                        window.streamMaxApp.showHelpModal();
                                    } catch (error) {
                                        console.error('showHelpModal hatası:', error);
                                    }
                                } else {
                                    console.error('showHelpModal metodu bulunamadı');
                                }
                            } else if (action === 'logout') {
                                if (typeof window.streamMaxApp.handleLogoutClick === 'function') {
                                    console.log('handleLogoutClick çağrılıyor');
                                    try {
                                        window.streamMaxApp.handleLogoutClick();
                                    } catch (error) {
                                        console.error('handleLogoutClick hatası:', error);
                                    }
                                } else {
                                    console.error('handleLogoutClick metodu bulunamadı');
                                }
                            } else {
                                console.warn('Bilinmeyen action:', action);
                            }
                        };
                        
                        // Eğer streamMaxApp henüz hazır değilse, hazır olana kadar bekle
                        if (!window.streamMaxApp) {
                            console.log('streamMaxApp henüz hazır değil, bekleniyor...');
                            let attempts = 0;
                            const maxAttempts = 100; // 100 * 100ms = 10 saniye
                            const checkInterval = setInterval(() => {
                                attempts++;
                                if (window.streamMaxApp) {
                                    clearInterval(checkInterval);
                                    console.log('streamMaxApp hazır oldu, işlem yapılıyor');
                                    executeAction();
                                } else if (attempts >= maxAttempts) {
                                    clearInterval(checkInterval);
                                    console.error('streamMaxApp 10 saniye içinde hazır olmadı, işlem yapılamıyor');
                                }
                            }, 100);
                        } else {
                            executeAction();
                        }
                    }, true); // capture phase
                    
                    console.log(`Dropdown item ${index + 1} (${action}) için event listener eklendi`);
                });
            };
            
            // Dropdown item'ları hemen kur
            setupDropdownItems();
            
            // Eğer dropdown item'lar henüz yoksa, MutationObserver ile bekle
            if (userDropdown.querySelectorAll('.dropdown-item').length === 0) {
                console.log('Dropdown item\'lar henüz yok, MutationObserver ile bekleniyor...');
                const observer = new MutationObserver(() => {
                    if (userDropdown.querySelectorAll('.dropdown-item').length > 0) {
                        observer.disconnect();
                        console.log('Dropdown item\'lar bulundu, event listener\'lar ekleniyor...');
                        setupDropdownItems();
                    }
                });
                observer.observe(userDropdown, { childList: true, subtree: true });
            }
            
            // Dışarı tıklayınca kapat (sadece bir kez ekle)
            if (!document.userDropdownCloseHandlerAdded) {
                document.addEventListener('click', (e) => {
                    const currentUserMenu = document.querySelector('.user-menu');
                    const currentUserDropdown = document.getElementById('userDropdown');
                    if (currentUserMenu && currentUserDropdown) {
                        if (!currentUserMenu.contains(e.target) && !currentUserDropdown.contains(e.target)) {
                            currentUserDropdown.style.display = 'none';
                            currentUserDropdown.classList.remove('show');
                        }
                    }
                });
                document.userDropdownCloseHandlerAdded = true;
            }
        }
    }

    activateFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFooterLinkClick(link);
            });
        });
    }

    handleNavigationClick(link) {
        const text = link.textContent.trim();
        const section = link.getAttribute('data-section');
        
        // data-section attribute'unu kontrol et
        if (section) {
            // Manuel navigasyon işareti
            window.isManualNavigation = true;
            setTimeout(() => {
                window.isManualNavigation = false;
            }, 1000); // 1 saniye sonra otomatik geçişi tekrar aktif et
            
            // Tüm nav linklerini bul ve aktif durumu güncelle
            const allNavLinks = document.querySelectorAll('.nav-link');
            allNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Global switchContentSection fonksiyonunu çağır (HTML'deki inline JavaScript'te tanımlı)
            if (typeof window.switchContentSection === 'function') {
                window.switchContentSection(section);
            } else {
                // Eğer global fonksiyon yoksa, manuel olarak section geçişi yap
                this.switchContentSection(section);
            }
            
            this.showNotification(`${text} bölümüne geçiliyor...`);
            
            // Mobile menüyü kapat
            const nav = document.querySelector('.nav');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (nav && mobileMenuBtn) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        } else {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href !== 'javascript:void(0)') {
                this.showNotification(`"${text}" sayfasına yönlendiriliyorsunuz...`);
        } else {
            this.showNotification(`"${text}" menü öğesi tıklandı!`);
            }
        }
    }
    
    // Content section geçiş fonksiyonu - Scale + Fade efekti ile
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

    handleHeroButtonClick(button) {
        const text = button.textContent.trim();
        
        if (text.includes('Oynat')) {
            this.handlePlayButton();
        } else if (text.includes('Daha Fazla Bilgi')) {
            this.handleMoreInfoButton();
        } else {
            this.showNotification(`"${text}" butonu tıklandı!`);
        }
    }

    handleMovieCardClick(card, e) {
        const title = card.querySelector('h3')?.textContent.trim() || 'Bilinmeyen Film';
        this.showNotification(`"${title}" filmi seçildi!`);
        this.showMovieDetailsModal(title);
    }

    handleMovieActionClick(button) {
        const card = button.closest('.movie-card');
        const title = card?.querySelector('h3')?.textContent.trim() || 'Bilinmeyen Film';
        
        if (button.classList.contains('btn-play')) {
            this.handlePlayMovie(title);
        } else if (button.classList.contains('btn-add')) {
            this.handleAddToWatchlist(title, button);
        } else if (button.classList.contains('btn-like')) {
            this.handleLikeMovie(title, button);
        }
    }

    handlePlayButton() {
        this.showNotification('Film oynatılıyor...');
        this.showModal('Film Oynatılıyor', 'Seçilen film oynatılıyor. Video oynatıcı açılacak.');
    }

    handleMoreInfoButton() {
        this.showNotification('Film detayları açılıyor...');
        this.showModal('Film Detayları', 'Film hakkında detaylı bilgiler açılıyor.');
    }

    handlePlayMovie(title) {
        this.showNotification(`"${title}" oynatılıyor...`);
        this.showModal('Film Oynatılıyor', `${title} filmi oynatılıyor.`);
    }

    handleAddToWatchlist(title, button) {
        if (button.classList.contains('added')) {
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-plus"></i>';
            this.showNotification(`"${title}" izleme listesinden çıkarıldı!`);
        } else {
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i>';
            this.showNotification(`"${title}" izleme listesine eklendi!`);
        }
    }

    handleLikeMovie(title, button) {
        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            button.innerHTML = '<i class="fas fa-thumbs-up"></i>';
            this.showNotification(`"${title}" beğeni kaldırıldı!`);
        } else {
            button.classList.add('liked');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            this.showNotification(`"${title}" beğenildi!`);
        }
    }

    toggleSearch() {
        this.showNotification('Arama çubuğu açılıyor...');
        this.showModal('Arama', 'Film arama özelliği aktif ediliyor.');
    }

    showSearchSuggestions() {
        this.showNotification('Arama önerileri yükleniyor...');
    }

    toggleUserMenu() {
        const userDropdown = document.getElementById('userDropdown');
        if (!userDropdown) return;
        
        if (userDropdown.style.display === 'none' || !userDropdown.classList.contains('show')) {
            userDropdown.style.display = 'block';
            userDropdown.classList.add('show');
        } else {
            userDropdown.style.display = 'none';
            userDropdown.classList.remove('show');
        }
    }

    handleFooterLinkClick(link) {
        const text = link.textContent.trim();
        this.showNotification(`"${text}" sayfası açılıyor...`);
    }

    showMovieDetailsModal(title) {
        this.showModal('Film Detayları', `${title} filminin detayları açılıyor.`);
    }

    showModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'streammax-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary modal-ok">Tamam</button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(modal);

        // Kapatma işlevleri
        const closeBtn = modal.querySelector('.modal-close');
        const okBtn = modal.querySelector('.modal-ok');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        okBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    setupNotifications() {
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message) {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            background: linear-gradient(135deg, #00d4ff 0%, #ff6b35 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// CSS animasyonları ekle
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
    
    .streammax-modal .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .streammax-modal .modal-content {
        background: var(--card-bg);
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .streammax-modal .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .streammax-modal .modal-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.5rem;
    }
    
    .streammax-modal .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .streammax-modal .modal-body {
        padding: 20px;
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .streammax-modal .modal-footer {
        padding: 20px;
        border-top: 1px solid var(--border-color);
        text-align: right;
    }
    
    .streammax-modal .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .streammax-modal .btn-primary {
        background: var(--gradient-primary);
        color: var(--darker-bg);
    }
    
    .streammax-modal .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
    }
    
    .added {
        background: var(--gradient-secondary) !important;
        color: var(--darker-bg) !important;
    }
    
    .liked {
        background: var(--gradient-secondary) !important;
        color: var(--darker-bg) !important;
    }
`;
document.head.appendChild(style);

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new StreamMaxButtonActivator();
});
