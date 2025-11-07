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
        this.activateUserMenu();
        this.activateFooterLinks();
    }

    activateNavigationButtons() {
        const navLinks = document.querySelectorAll('.nav a, .header__menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(link);
            });
        });
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
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleUserMenu();
            });
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
        const href = link.getAttribute('href');
        
        if (href && href !== '#') {
            this.showNotification(`"${text}" sayfasına yönlendiriliyorsunuz...`);
            // Gerçek sayfa yönlendirmesi burada yapılabilir
            // window.location.href = href;
        } else {
            this.showNotification(`"${text}" menü öğesi tıklandı!`);
        }
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
        this.showNotification('Kullanıcı menüsü açılıyor...');
        this.showModal('Kullanıcı Menüsü', 'Profil ayarları ve çıkış seçenekleri açılıyor.');
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
