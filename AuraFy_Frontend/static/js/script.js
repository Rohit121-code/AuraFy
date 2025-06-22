// Enhanced AuraFy JavaScript with Mobile Support and Interactivity (Audio Removed)

/**
 * A utility function for navigating after a fade-out effect.
 * @param {string} url - The URL to navigate to.
 */
function fadeOutAndNavigate(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500); // Match this to your CSS animation duration
}


class AuraFy {
    constructor() {
        this.isLoading = true;
        this.isMobile = this.detectMobile();
        this.animationFrameId = null; // To control animation loops

        // DOM element references
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            loadingText: document.querySelector('.loading-text'),
            particlesContainer: document.getElementById('particlesContainer'),
            startButton: document.getElementById('startButton'),
            toastContainer: document.getElementById('toastContainer'),
            statNumbers: document.querySelectorAll('.stat-number'),
            exitButton: document.querySelector('.exit-button'),
        };

        this.init();
    }

    /**
     * Initializes the application.
     */
    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.createParticleSystem();
        this.preloadAssets();

        // Simulate asset loading and start the app
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2500);
    }

    /**
     * Detects if the user is on a mobile device.
     * @returns {boolean} - True if mobile, false otherwise.
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
    }

    // --- Loading Screen ---
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'flex';
            this.animateLoadingText();
        }
    }

    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
                this.isLoading = false;
                document.body.classList.add('page-fade-in');
                this.startAnimations();
                this.showToast('Welcome to AuraFy! ✨', 'success');
            }, 800);
        }
    }

    animateLoadingText() {
        const loadingTexts = [
            'Preparing your aura journey...',
            'Analyzing cosmic energies...',
            'Calibrating vibe sensors...',
            'Almost ready...'
        ];
        if (!this.elements.loadingText) return;

        let index = 0;
        this.elements.loadingText.textContent = loadingTexts[index];
        const interval = setInterval(() => {
            index++;
            if (!this.isLoading || index >= loadingTexts.length) {
                clearInterval(interval);
                return;
            }
            this.elements.loadingText.textContent = loadingTexts[index];
        }, 600);
    }

    /**
     * Preloads essential assets.
     */
    preloadAssets() {
        // This is a placeholder for preloading images or other assets.
        console.log('Assets preloading initiated.');
    }

    // --- Event Listeners ---
    setupEventListeners() {
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', this.handleStartClick.bind(this));
        }
        if (this.elements.exitButton) {
            // The exit button uses an inline onclick, but adding a listener here is also fine.
            // this.elements.exitButton.addEventListener('click', () => fadeOutAndNavigate('exit.html'));
        }

        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
    
    // --- Event Handlers ---
    handleStartClick() {
        this.showToast('Your journey begins...', 'info');
        const ripple = this.elements.startButton.querySelector('.button-ripple');
        if (ripple) {
            // This is a simple visual effect, no audio needed
            ripple.style.animation = 'ripple-effect 0.6s linear';
            ripple.addEventListener('animationend', () => {
                ripple.style.animation = '';
            });
        }
        fadeOutAndNavigate('/user-info');
    }

    handleResize() {
        // Placeholder for any logic needed on window resize.
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleStartClick();
        }
        if (e.key === 'Escape') {
             fadeOutAndNavigate('/exit');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when the tab is not active to save resources
            this.elements.particlesContainer.style.animationPlayState = 'paused';
        } else {
            // Resume animations when the tab becomes active
             this.elements.particlesContainer.style.animationPlayState = 'running';
        }
    }

    // --- Core Animations & Effects ---
    
    /**
     * Creates and animates floating particles in the background.
     */
    createParticleSystem() {
        const container = this.elements.particlesContainer;
        if (!container) return;
        
        const particleCount = this.isMobile ? 20 : 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(particle);
        }
    }
    
    /**
     * Starts animations that should begin after the loading screen is gone.
     */
    startAnimations() {
        this.animateStats();
        document.body.style.opacity = '1';
    }

    animateStats() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = entry.target;
                    const target = +numberElement.getAttribute('data-target');
                    
                    let current = 0;
                    const increment = target / 100;
                    
                    const updateCount = () => {
                        if (current < target) {
                            current += increment;
                            numberElement.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCount);
                        } else {
                            numberElement.innerText = target.toLocaleString();
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(numberElement);
                }
            });
        }, { threshold: 0.5 });

        this.elements.statNumbers.forEach(number => observer.observe(number));
    }


    // --- UI Utilities ---

    /**
     * Shows a toast notification.
     * @param {string} message - The message to display.
     * @param {'info'|'success'|'danger'|'warning'} type - The type of toast.
     */
    showToast(message, type = 'info') {
        if (!this.elements.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const colors = {
            success: 'var(--success-color)',
            danger: 'var(--danger-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };
        toast.style.borderLeftColor = colors[type];
        
        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }
}

// --- Initialize the App ---
document.addEventListener('DOMContentLoaded', () => {
    new AuraFy();
});