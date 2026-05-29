/* ==========================================================================
   RONEX EA LANDING PAGE - FRONTEND INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER SCROLL EVENT
       ========================================================================== */
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check in case of page refresh mid-scroll
    handleScroll();

    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    
    // Create drawer overlay dynamically
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);

    const openDrawer = () => {
        mobileDrawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable background scrolling
    };

    mobileMenuBtn.addEventListener('click', openDrawer);
    mobileMenuCloseBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close drawer when clicking any anchor link inside it
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    /* ==========================================================================
       3. INTERACTIVE ROI CALCULATOR
       ========================================================================== */
    const depositSlider = document.getElementById('deposit-slider');
    const depositValueDisplay = document.getElementById('deposit-value');
    
    const riskLow = document.getElementById('risk-low');
    const riskMed = document.getElementById('risk-med');
    const riskHigh = document.getElementById('risk-high');
    
    const calcMonthlyVal = document.getElementById('calc-monthly');
    const calcAnnualVal = document.getElementById('calc-annual');
    const calcDrawdownVal = document.getElementById('calc-drawdown');

    // Risk profiles parameters: [monthlyRate, maxDrawdownText]
    const riskParams = {
        low: { rate: 0.03, drawdown: '< 4.8%' },
        med: { rate: 0.07, drawdown: '< 11.3%' },
        high: { rate: 0.135, drawdown: '< 24.5%' }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const calculateROI = () => {
        const capital = parseFloat(depositSlider.value);
        
        // Determine selected risk
        let selectedRisk = 'low';
        if (riskMed.checked) selectedRisk = 'med';
        if (riskHigh.checked) selectedRisk = 'high';
        
        const params = riskParams[selectedRisk];
        
        // Perform calculations
        const estimatedMonthly = capital * params.rate;
        const estimatedAnnual = estimatedMonthly * 12;
        
        // Update outputs smoothly
        depositValueDisplay.textContent = formatCurrency(capital).split('.')[0]; // remove cents for label
        calcMonthlyVal.textContent = formatCurrency(estimatedMonthly);
        calcAnnualVal.textContent = formatCurrency(estimatedAnnual);
        calcDrawdownVal.textContent = params.drawdown;
    };

    // Attach listeners
    depositSlider.addEventListener('input', calculateROI);
    
    // Select all radio inputs to trigger re-calculation on risk profile switch
    const riskInputs = document.querySelectorAll('input[name="risk-profile"]');
    riskInputs.forEach(input => {
        input.addEventListener('change', calculateROI);
    });

    // Run initial calculation on load
    calculateROI();

    /* ==========================================================================
       4. FAQ ACCORDION TOGGLES
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all active items first for a single-open accordion behavior
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================================================
       5. VIEWPORT INTERSECTION OBSERVER (SCROLL REVEAL EFFECTS)
       ========================================================================== */
    // Add CSS rule for reveal states programmatically to keep styles.css clean
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    const revealElements = [
        ...document.querySelectorAll('.about-card'),
        ...document.querySelectorAll('.feature-item'),
        ...document.querySelectorAll('.showcase-card'),
        ...document.querySelectorAll('.timeline-step'),
        ...document.querySelectorAll('.calculator-box'),
        ...document.querySelectorAll('.performance-table-container')
    ];

    // Wrap elements with reveal class
    revealElements.forEach(el => el.classList.add('reveal-element'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger once only
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

});
