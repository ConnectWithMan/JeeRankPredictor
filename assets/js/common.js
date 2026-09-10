// Common Navbar, Footer, and Navigation JavaScript & CSS Module
(function () {
    // 0. Google Analytics (gtag.js) Auto-Injector
    if (!document.querySelector('script[src*="G-5K24QYDGGX"]')) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5K24QYDGGX';
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5K24QYDGGX');
    }

    // 1. Inject Styles for Header, Footer, and Mobile Navigation

    const styleId = 'common-nav-footer-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            header {
                position: sticky;
                top: 0;
                z-index: 50;
                width: 100%;
                background: rgba(255, 255, 255, 0.96);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid #e2e8f0;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
            }

            .header-container {
                max-width: 1280px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem 1.5rem;
            }

            .logo-link {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                color: #0f172a;
                transition: opacity 0.15s ease;
            }

            .logo-link:hover {
                opacity: 0.85;
            }

            .logo-img {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: #1e293b;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 0.9rem;
                font-family: 'Outfit', sans-serif;
                color: #ffffff;
                border: 1px solid #334155;
            }

            .logo-text {
                font-family: 'Outfit', sans-serif;
                font-weight: 800;
                font-size: 1.15rem;
                letter-spacing: -0.02em;
                color: #0f172a;
            }

            header nav {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .nav-link {
                text-decoration: none;
                color: #475569;
                font-size: 0.875rem;
                font-weight: 600;
                padding: 0.45rem 0.85rem;
                border-radius: 6px;
                transition: all 0.15s ease;
                white-space: nowrap;
                border: 1px solid transparent;
            }

            .nav-link:hover {
                color: #1d4ed8;
                background: #f8fafc;
            }

            .nav-link.active {
                color: #1d4ed8;
                background: #eff6ff;
                border-color: #dbeafe;
                font-weight: 600;
            }

            .nav-cta {
                text-decoration: none;
                color: #ffffff;
                background: #1d4ed8;
                font-size: 0.875rem;
                font-weight: 600;
                padding: 0.45rem 0.95rem;
                border-radius: 6px;
                transition: all 0.15s ease;
                white-space: nowrap;
                border: 1px solid #1e40af;
            }

            .nav-cta:hover {
                background: #1e40af;
            }

            .nav-cta.active {
                background: #1e40af;
            }

            .menu-btn {
                display: none;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                color: #0f172a;
                cursor: pointer;
                padding: 0.45rem;
                transition: all 0.15s ease;
            }

            .menu-btn:hover {
                border-color: #cbd5e1;
                background: #f8fafc;
            }

            footer {
                width: 100%;
                background: #f8fafc;
                color: #475569;
                border-top: 1px solid rgba(226, 232, 240, 0.8);
                margin-top: auto;
                padding: 4.5rem 1.5rem 2.5rem;
            }

            .footer-container {
                max-width: 1280px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            @media (min-width: 768px) {
                .footer-container {
                    grid-template-columns: 1.5fr 1.25fr 1fr;
                }
            }

            .footer-brand {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            .footer-logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                color: #0f172a;
            }

            .footer-logo .logo-text {
                background: linear-gradient(135deg, #0f172a 0%, #4f46e5 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800;
            }

            .footer-desc {
                font-size: 0.875rem;
                color: #64748b;
                line-height: 1.65;
                max-width: 360px;
            }

            .footer-links-col {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            .footer-title {
                font-family: 'Outfit', sans-serif;
                font-size: 0.8rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #0f172a;
                position: relative;
                padding-bottom: 0.5rem;
            }

            .footer-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 24px;
                height: 2px;
                background: #1d4ed8;
                border-radius: 99px;
            }

            .footer-links {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 0.85rem;
            }

            .footer-link {
                text-decoration: none;
                color: #475569;
                font-size: 0.875rem;
                transition: all 0.15s ease;
                display: inline-flex;
                align-items: center;
            }

            .footer-link:hover {
                color: #1d4ed8;
                transform: translateX(3px);
            }

            .footer-bottom {
                max-width: 1280px;
                margin: 3rem auto 0;
                padding-top: 2rem;
                border-top: 1px solid rgba(226, 232, 240, 0.8);
                text-align: center;
                font-size: 0.8rem;
                color: #64748b;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                align-items: center;
            }

            .footer-bottom-links {
                display: flex;
                gap: 1.5rem;
            }

            .footer-bottom-link {
                color: #64748b;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .footer-bottom-link:hover {
                color: #4f46e5;
            }

            .mobile-nav {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: calc(3.85rem + env(safe-area-inset-bottom, 0px));
                padding-bottom: env(safe-area-inset-bottom, 0px);
                background: rgba(255, 255, 255, 0.97);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-top: 1px solid #e2e8f0;
                z-index: 49;
                align-items: center;
                justify-content: space-around;
                padding-left: 0.25rem;
                padding-right: 0.25rem;
                box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.06);
            }

            .mobile-nav-link {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.15rem;
                text-decoration: none;
                color: #64748b;
                font-size: 0.65rem;
                font-weight: 600;
                transition: all 0.15s ease;
                flex: 1;
                padding: 0.25rem 0.1rem;
            }

            .mobile-nav-link.active {
                color: #1d4ed8;
                font-weight: 700;
            }

            .mobile-nav-icon {
                font-size: 1.15rem;
                line-height: 1;
            }

            @media (max-width: 1024px) {
                header nav {
                    display: none;
                }
                
                header nav.open {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    padding: 1.25rem 1rem;
                    border-bottom: 1px solid rgba(226, 232, 240, 0.9);
                    gap: 0.65rem;
                    box-shadow: 0 16px 32px -6px rgba(15, 23, 42, 0.12);
                    z-index: 100;
                    animation: slideDown 0.2s ease-out forwards;
                }
                
                header nav.open .nav-link, header nav.open .nav-cta {
                    width: 100%;
                    text-align: left;
                    padding: 0.65rem 0.85rem;
                    font-size: 0.9rem;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .menu-btn {
                    display: block;
                }
                
                .mobile-nav {
                    display: flex;
                }
            }

            @media (max-width: 480px) {
                .header-container {
                    padding: 0.6rem 0.85rem;
                }
                .logo-text {
                    font-size: 1.05rem;
                }
                .logo-img {
                    width: 32px;
                    height: 32px;
                    font-size: 0.8rem;
                }
                .footer-container {
                    gap: 2rem;
                }
                .footer-bottom {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                }
                .footer-bottom-links {
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Active Route Detection
    function getActiveRoute() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('about')) return 'about';
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('terms')) return 'terms';
        if (path.includes('contact')) return 'contact';
        if (path.includes('jee-main-percentile-predictor') || path.includes('jee-main-precentile-predictor')) return 'jee-main-percentile';
        if (path.includes('jee-main-rank-predictor')) return 'jee-main-rank';
        if (path.includes('jee-main-college-predictor')) return 'jee-main-college';
        if (path.includes('jee-advanced-rank-predictor')) return 'jee-advanced-rank';
        if (path.includes('jee-advanced-college-predictor')) return 'jee-advanced-college';
        return 'home';
    }

    // 3. Render Header
    function renderHeader() {
        const route = getActiveRoute();
        const header = document.querySelector('header');
        if (!header) return;

        header.innerHTML = `
            <div class="header-container">
                <a href="/" class="logo-link">
                    <div class="logo-img">JRP</div>
                    <span class="logo-text">Jee Rank Predictor</span>
                </a>
                <nav>
                    <a href="/jee-main-rank-predictor" class="nav-link ${route === 'jee-main-rank' ? 'active' : ''}">Rank Predictor</a>
                    <a href="/jee-main-percentile-predictor" class="nav-link ${route === 'jee-main-percentile' ? 'active' : ''}">Percentile Predictor</a>
                    <a href="/jee-main-college-predictor" class="nav-link ${route === 'jee-main-college' ? 'active' : ''}">College Predictor</a>
                    <a href="/jee-advanced-rank-predictor" class="nav-link ${route === 'jee-advanced-rank' ? 'active' : ''}">Advanced Rank</a>
                    <a href="/jee-advanced-college-predictor" class="nav-link ${route === 'jee-advanced-college' ? 'active' : ''}">IIT Predictor</a>
                </nav>
                <button class="menu-btn" aria-label="Toggle menu" onclick="toggleMenu()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    }

    // 4. Render Footer
    function renderFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="footer-container">
                <div class="footer-brand">
                    <a href="/" class="footer-logo">
                        <div class="logo-img">JRP</div>
                        <span class="logo-text">Jee Rank Predictor</span>
                    </a>
                    <p class="footer-desc">India's most trusted educational calculator platform. Helping students estimate their JEE Main and Advanced rank, percentile, and college options since 2023.</p>
                    <div class="footer-contact" style="margin-top: 0.5rem;">
                        <div class="footer-contact-item" style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✉️</span>
                            <a href="mailto:support@jeerankpredictor.com" style="color: #4f46e5; text-decoration: none; font-weight: 600;">support@jeerankpredictor.com</a>
                        </div>
                    </div>
                </div>
                <div class="footer-links-col">
                    <div class="footer-title">Calculators & Predictors</div>
                    <ul class="footer-links">
                        <li><a href="/jee-main-rank-predictor" class="footer-link">JEE Main Rank Predictor</a></li>
                        <li><a href="/jee-main-percentile-predictor" class="footer-link">JEE Main Percentile Predictor</a></li>
                        <li><a href="/jee-main-college-predictor" class="footer-link">NIT/IIIT College Predictor</a></li>
                        <li><a href="/jee-advanced-rank-predictor" class="footer-link">JEE Advanced Rank Predictor</a></li>
                        <li><a href="/jee-advanced-college-predictor" class="footer-link">IIT College Predictor</a></li>
                    </ul>
                </div>
                <div class="footer-links-col">
                    <div class="footer-title">Company & Portals</div>
                    <ul class="footer-links">
                        <li><a href="/about" class="footer-link">About Us</a></li>
                        <li><a href="/contact" class="footer-link">Contact</a></li>
                        <li><a href="https://jeecounselling.com/" target="_blank" class="footer-link">JEE 2027</a></li>
                        <li><a href="https://josaa.nic.in" target="_blank" rel="noopener" class="footer-link">JoSAA Portal</a></li>
                        <li><a href="https://jeemain.nta.ac.in" target="_blank" rel="noopener" class="footer-link">NTA JEE Main</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2027 JeeRankPredictor. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="/about" class="footer-bottom-link">About Us</a>
                    <a href="/privacy" class="footer-bottom-link">Privacy Policy</a>
                    <a href="/terms" class="footer-bottom-link">Terms of Service</a>
                    <a href="/contact" class="footer-bottom-link">Contact Us</a>
                </div>
            </div>
        `;
    }


    // 5. Render Mobile Navigation Bar
    function renderMobileNav() {
        const route = getActiveRoute();
        let mobileNav = document.querySelector('nav.mobile-nav');
        if (!mobileNav) {
            mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-nav';
            document.body.appendChild(mobileNav);
        }

        mobileNav.innerHTML = `
            <a href="/" class="mobile-nav-link ${route === 'home' ? 'active' : ''}">
                <span class="mobile-nav-icon">🏠</span>
                <span>Home</span>
            </a>
            <a href="/jee-main-percentile-predictor" class="mobile-nav-link ${route === 'jee-main-percentile' ? 'active' : ''}">
                <span class="mobile-nav-icon">📊</span>
                <span>Percentile</span>
            </a>
            <a href="/jee-main-college-predictor" class="mobile-nav-link ${route === 'jee-main-college' ? 'active' : ''}">
                <span class="mobile-nav-icon">🏛️</span>
                <span>NITs</span>
            </a>
            <a href="/jee-main-rank-predictor" class="mobile-nav-link ${route === 'jee-main-rank' ? 'active' : ''}">
                <span class="mobile-nav-icon">📝</span>
                <span>Main Rank</span>
            </a>
            <a href="/jee-advanced-college-predictor" class="mobile-nav-link ${route === 'jee-advanced-college' ? 'active' : ''}">
                <span class="mobile-nav-icon">🎓</span>
                <span>IITs</span>
            </a>
        `;
    }


    // 6. Global Navigation Menu Toggle Function
    window.toggleMenu = function () {
        const nav = document.querySelector('header nav');
        if (nav) {
            nav.classList.toggle('open');
        }
    };

    // Auto initialize components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            renderHeader();
            renderFooter();
            renderMobileNav();
        });
    } else {
        renderHeader();
        renderFooter();
        renderMobileNav();
    }
})();
