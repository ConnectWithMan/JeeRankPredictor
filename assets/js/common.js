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

    // 0.1 Modern Fonts Auto-Injector (Space Grotesk + Inter)
    if (!document.querySelector('link[href*="Space+Grotesk"]') && !document.querySelector('link[href*="Inter"]')) {
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);

        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';
        document.head.appendChild(fontLink);
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
                z-index: 100;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-bottom: 1.5px solid #cbd5e1;
                box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
                transition: all 0.25s ease;
            }

            .header-container {
                max-width: 1320px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.85rem 1.75rem;
                gap: 1.5rem;
            }

            .logo-link {
                display: flex;
                align-items: center;
                gap: 0.85rem;
                text-decoration: none;
                transition: transform 0.2s ease;
            }

            .logo-link:hover {
                transform: translateY(-1px);
            }

            .logo-icon-wrapper {
                width: 38px;
                height: 38px;
                border-radius: 11px;
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                flex-shrink: 0;
            }

            .logo-text-group {
                display: flex;
                align-items: center;
                gap: 0.55rem;
            }

            .logo-title {
                font-family: var(--font-heading, 'Space Grotesk', -apple-system, sans-serif);
                font-weight: 800;
                font-size: 1.3rem;
                letter-spacing: -0.025em;
                color: #0f172a;
                line-height: 1.1;
            }

            header nav {
                display: flex;
                align-items: center;
                gap: 0.35rem;
                background: #f1f5f9;
                padding: 0.3rem 0.4rem;
                border-radius: 999px;
                border: 1.5px solid #cbd5e1;
            }

            .nav-link {
                text-decoration: none;
                color: #334155;
                font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
                font-size: 0.875rem;
                font-weight: 600;
                padding: 0.45rem 0.95rem;
                border-radius: 999px;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                white-space: nowrap;
            }

            .nav-link:hover {
                color: #4338ca;
                background: #ffffff;
                box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
            }

            .nav-link.active {
                color: #4338ca;
                background: #ffffff;
                border: 1px solid #cbd5e1;
                box-shadow: 0 2px 8px rgba(67, 56, 202, 0.12);
                font-weight: 700;
            }

            .header-cta-group {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .header-cta-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
                text-decoration: none;
                color: #ffffff;
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                font-family: var(--font-body, 'Inter', sans-serif);
                font-size: 0.85rem;
                font-weight: 700;
                padding: 0.55rem 1.15rem;
                border-radius: 999px;
                box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                white-space: nowrap;
            }

            .header-cta-btn:hover {
                transform: translateY(-1.5px);
                box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45);
                color: #ffffff;
            }

            .menu-btn {
                display: none;
                background: #ffffff;
                border: 1.5px solid #cbd5e1;
                border-radius: 9px;
                color: #0f172a;
                cursor: pointer;
                padding: 0.5rem;
                transition: all 0.15s ease;
                box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
            }

            .menu-btn:hover {
                background: #f8fafc;
                border-color: #94a3b8;
            }

            footer {
                width: 100%;
                background: #ffffff;
                color: #334155;
                border-top: 1.5px solid #cbd5e1;
                margin-top: auto;
                padding: 4.5rem 1.75rem 2.5rem;
                position: relative;
                font-family: var(--font-body, 'Inter', sans-serif);
            }

            .footer-container {
                max-width: 1320px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            @media (min-width: 768px) {
                .footer-container {
                    grid-template-columns: 1.6fr 1fr 1fr 1fr;
                }
            }

            .footer-brand {
                display: flex;
                flex-direction: column;
                gap: 1.1rem;
            }

            .footer-status-pill {
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
                font-size: 0.75rem;
                font-weight: 700;
                padding: 0.3rem 0.75rem;
                border-radius: 999px;
                background: rgba(16, 185, 129, 0.12);
                color: #047857;
                border: 1.5px solid #a7f3d0;
                width: fit-content;
            }

            .footer-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10b981;
            }

            .footer-desc {
                font-size: 0.875rem;
                color: #334155;
                line-height: 1.65;
                max-width: 380px;
            }

            .footer-links-col {
                display: flex;
                flex-direction: column;
                gap: 1.1rem;
            }

            .footer-title {
                font-family: var(--font-heading, 'Space Grotesk', sans-serif);
                font-size: 0.825rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #0f172a;
                position: relative;
                padding-bottom: 0.4rem;
            }

            .footer-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 24px;
                height: 2.5px;
                background: #4f46e5;
                border-radius: 99px;
            }

            .footer-links {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .footer-link {
                text-decoration: none;
                color: #334155;
                font-size: 0.875rem;
                font-weight: 500;
                transition: all 0.15s ease;
                display: inline-flex;
                align-items: center;
                width: fit-content;
            }

            .footer-link:hover {
                color: #4338ca;
                font-weight: 600;
                transform: translateX(3px);
            }

            .footer-bottom {
                max-width: 1320px;
                margin: 3rem auto 0;
                padding-top: 2rem;
                border-top: 1.5px solid #cbd5e1;
                font-size: 0.825rem;
                color: #475569;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
                text-align: center;
            }

            @media (min-width: 768px) {
                .footer-bottom {
                    flex-direction: row;
                    justify-content: space-between;
                    text-align: left;
                }
            }

            .footer-bottom-links {
                display: flex;
                gap: 1.5rem;
            }

            .footer-bottom-link {
                color: #334155;
                text-decoration: none;
                font-size: 0.825rem;
                font-weight: 500;
                transition: color 0.2s ease;
            }

            .footer-bottom-link:hover {
                color: #4338ca;
            }

            .mobile-nav {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: calc(3.85rem + env(safe-area-inset-bottom, 0px));
                padding-bottom: env(safe-area-inset-bottom, 0px);
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-top: 1.5px solid #cbd5e1;
                z-index: 99;
                align-items: center;
                justify-content: space-around;
                box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
                font-family: var(--font-body, 'Inter', sans-serif);
            }

            .mobile-nav-link {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.2rem;
                text-decoration: none;
                color: #475569;
                font-size: 0.72rem;
                font-weight: 600;
                transition: all 0.15s ease;
                flex: 1;
                padding: 0.35rem 0.1rem;
            }

            .mobile-nav-link.active {
                color: #4338ca;
                font-weight: 800;
            }

            .mobile-nav-icon {
                font-size: 1.15rem;
                line-height: 1;
            }

            @media (max-width: 1080px) {
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
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(24px);
                    padding: 1.25rem 1.5rem;
                    border-radius: 0 0 16px 16px;
                    border-bottom: 1.5px solid #cbd5e1;
                    gap: 0.5rem;
                    box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.15);
                    z-index: 100;
                }
                
                header nav.open .nav-link {
                    width: 100%;
                    text-align: left;
                    padding: 0.75rem 1rem;
                    font-size: 0.95rem;
                    border-radius: 10px;
                }
                
                .menu-btn {
                    display: block;
                }
                
                .mobile-nav {
                    display: flex;
                }
            }

            @media (max-width: 640px) {
                .header-cta-btn {
                    display: none;
                }
                .header-container {
                    padding: 0.75rem 1rem;
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
                    <div class="logo-icon-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                    </div>
                    <div class="logo-text-group">
                        <span class="logo-title">JEE Rank Predictor</span>
                    </div>
                </a>
                <nav>
                    <a href="/jee-main-rank-predictor" class="nav-link ${route === 'jee-main-rank' ? 'active' : ''}">Rank Predictor</a>
                    <a href="/jee-main-percentile-predictor" class="nav-link ${route === 'jee-main-percentile' ? 'active' : ''}">Percentile Curves</a>
                    <a href="/jee-main-college-predictor" class="nav-link ${route === 'jee-main-college' ? 'active' : ''}">College Predictor</a>
                    <a href="/jee-advanced-rank-predictor" class="nav-link ${route === 'jee-advanced-rank' ? 'active' : ''}">Advanced Rank</a>
                    <a href="/jee-advanced-college-predictor" class="nav-link ${route === 'jee-advanced-college' ? 'active' : ''}">IIT Seats</a>
                </nav>
                <div class="header-cta-group">
                    <a href="/jee-main-rank-predictor" class="header-cta-btn">
                        <span>⚡ Predict AIR</span>
                    </a>
                    <button class="menu-btn" aria-label="Toggle menu" onclick="toggleMenu()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="4" x2="20" y1="12" y2="12"></line>
                            <line x1="4" x2="20" y1="6" y2="6"></line>
                            <line x1="4" x2="20" y1="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
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
                    <a href="/" class="logo-link">
                        <div class="logo-icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <div class="logo-text-group">
                            <span class="logo-title">JEE Rank Predictor</span>
                        </div>
                    </a>
                    <div class="footer-status-pill">
                        <span class="footer-status-dot"></span>
                        <span>Official 2027 Normalization Online</span>
                    </div>
                    <p class="footer-desc">India's trusted admissions analytics suite for JEE Main &amp; JEE Advanced aspirants. Shift normalization, rank curves, and JoSAA cutoff models calibrated with 16 Lakh+ candidates.</p>
                </div>
                <div class="footer-links-col">
                    <div class="footer-title">Predictors</div>
                    <ul class="footer-links">
                        <li><a href="/jee-main-rank-predictor" class="footer-link">JEE Main Rank Predictor</a></li>
                        <li><a href="/jee-main-percentile-predictor" class="footer-link">Percentile Predictor 2027</a></li>
                        <li><a href="/jee-main-college-predictor" class="footer-link">NIT &amp; IIIT College Predictor</a></li>
                        <li><a href="/jee-advanced-rank-predictor" class="footer-link">JEE Advanced Rank Predictor</a></li>
                        <li><a href="/jee-advanced-college-predictor" class="footer-link">IIT Seat Predictor</a></li>
                    </ul>
                </div>
                <div class="footer-links-col">
                    <div class="footer-title">Admissions &amp; Data</div>
                    <ul class="footer-links">
                        <li><a href="/#marksTable" class="footer-link">Marks vs Percentile Table</a></li>
                        <li><a href="/about" class="footer-link">Normalization Methodology</a></li>
                        <li><a href="/about" class="footer-link">JoSAA 2026 Cutoff Archives</a></li>
                        <li><a href="/about" class="footer-link">Category Reservation Rules</a></li>
                        <li><a href="/about" class="footer-link">CSAB Special Round Trends</a></li>
                    </ul>
                </div>
                <div class="footer-links-col">
                    <div class="footer-title">Platform</div>
                    <ul class="footer-links">
                        <li><a href="/about" class="footer-link">About Academic Team</a></li>
                        <li><a href="/contact" class="footer-link">Contact Support</a></li>
                        <li><a href="/privacy" class="footer-link">Privacy Policy</a></li>
                        <li><a href="/terms" class="footer-link">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <div>© 2027 JeeRankPredictor.com • Open Educational Initiative for Indian Engineering Aspirants.</div>
                <div class="footer-bottom-links">
                    <a href="/privacy" class="footer-bottom-link">Privacy</a>
                    <a href="/terms" class="footer-bottom-link">Terms</a>
                    <a href="/contact" class="footer-bottom-link">Support</a>
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
