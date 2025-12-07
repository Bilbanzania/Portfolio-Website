// --- 1. CONFIGURATION ---
const SUPABASE_PROJECT_URL = 'https://fidzotxqwlhzgztnskbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZHpvdHhxd2xoemd6dG5za2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODk4MzMsImV4cCI6MjA2MjE2NTgzM30.aH0Hy1cGz-9pZRRsyS5_DId9IKCgalNo6d56aNwQisc';
const FUNCTION_NAME = 'portfolio';

const supabase = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. CORE ELEMENTS ---
    const body = document.body;
    const navToggler = document.querySelector('.nav-toggler');
    const appRoot = document.getElementById('app-root');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    const currentYear = new Date().getFullYear();
    const copyrightEl = document.getElementById('nav-copyright');
    if (copyrightEl) copyrightEl.innerHTML = `© ${currentYear} Mitchell Laypath`;

    // --- 3. TOAST NOTIFICATION HELPER ---
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { if (toast.parentNode) document.body.removeChild(toast); }, 300);
        }, 3000);
    };

    // --- 4. NAVIGATION LOGIC ---
    navToggler.addEventListener('click', () => {
        body.classList.toggle('nav-open');
        const isOpen = body.classList.contains('nav-open');
        navToggler.setAttribute('aria-expanded', isOpen);
    });

    const closeNav = () => {
        body.classList.remove('nav-open');
        navToggler.setAttribute('aria-expanded', 'false');
    }

    const setActiveLink = (hash) => {
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active-link');
            }
        });
    };

    // --- 5. THEME LOGIC ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = localStorage.getItem('theme');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    };

    if (currentTheme) {
        applyTheme(currentTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let theme = body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    }

    // --- 6. SCROLL ANIMATIONS ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const observeElements = () => {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            scrollObserver.observe(el);
        });
    };

    // --- 7. RENDER HELPER: Generate Project Grid HTML ---
    const generateProjectGridHTML = () => {
        // Safe check in case projectsData isn't loaded
        if (typeof projectsData === 'undefined') return '<p>Loading projects...</p>';

        return projectsData.map(project => `
            <article class="project-card reveal-on-scroll">
                <div class="card-image">
                    <img loading="lazy" src="${project.heroImage}" alt="${project.altText}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-description">${project.synopsis}</p>
                    <ul class="card-tags">
                        ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
                    </ul>
                    <a href="#project-${project.id}" class="card-button">View Case Study</a>
                </div>
            </article>
        `).join('');
    };

    // --- 8. RENDER FUNCTION: HOME PAGE (Refactored with Template) ---
    const renderHomePage = (scrollToId = null) => {
        // OPTIMIZATION: If we are already on the home view, just scroll.
        if (document.getElementById('home')) {
            if (scrollToId) {
                setTimeout(() => {
                    document.querySelector(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                window.scrollTo(0, 0);
            }
            return;
        }

        // FULL RENDER: Fetch content from the <template> tag
        const template = document.getElementById('home-template');

        // Clone the template content (true = clone all children)
        const content = template.content.cloneNode(true);

        // Inject Dynamic Content into the clone (Project Grid)
        const gridContainer = content.getElementById('static-project-grid');
        if (gridContainer) {
            gridContainer.innerHTML = generateProjectGridHTML();
        }

        // Inject Dynamic Content (Footer Year)
        const footerCopyright = content.getElementById('footer-copyright');
        if (footerCopyright) {
            footerCopyright.innerHTML = `© ${currentYear} Mitchell Laypath. All rights reserved.`;
        }

        // Clear the App Root and append the new View
        appRoot.innerHTML = '';
        appRoot.appendChild(content);

        // Handle Scroll Logic after render
        if (scrollToId) {
            setTimeout(() => {
                document.querySelector(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }

        // Re-attach observers and listeners since DOM elements are new
        observeElements();
        attachContactFormListener();
    };

    // --- 9. RENDER FUNCTION: PROJECT DETAIL ---
    const renderProjectPage = (projectId) => {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) { renderHomePage(); return; }

        const galleryHTML = `
            <div class="slideshow-container">
                ${project.gallery.map((item, index) => `
                    <div class="slide fade ${index === 0 ? 'active' : ''}">
                        <figure>
                            <img loading="lazy" src="${item.img}" alt="${item.alt}" class="gallery-image" data-caption="${item.caption}">
                            <figcaption>${item.caption}</figcaption>
                        </figure>
                        <div class="slide-number-text">${index + 1} / ${project.gallery.length}</div>
                    </div>
                `).join('')}
                <a class="prev" id="prev-slide">&#10094;</a>
                <a class="next" id="next-slide">&#10095;</a>
            </div>
        `;

        appRoot.innerHTML = `
            <header class="project-hero" style="background-image: url('${project.heroImage}');">
                <div class="hero-scrim"></div>
                <h1 class="project-title" tabindex="-1">${project.title}</h1>
            </header>

            <div class="project-content-wrapper reveal-on-scroll">
                <aside class="project-sidebar">
                    <h3>Objective</h3>
                    <p>${project.objective}</p>
                    <h3>Synopsis</h3>
                    <p>${project.synopsisDetail}</p>
                    <a href="${project.githubLink}" class="cta-button" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                    <h2 style="margin-top: 2rem;">Project Gallery</h2>
                    ${galleryHTML} 
                </aside>
                <section class="project-main-content">
                    <h2>Process</h2>
                    <p>${project.process}</p>
                    <h2>Results</h2>
                    <p>${project.results}</p>
                </section>
            </div>
            
            <footer class="main-footer">
                <a href="#home" class="cta-button secondary" style="margin-bottom: 1rem;">&larr; Back to Portfolio</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        document.querySelector('.project-title').focus();
        observeElements();

        // Slideshow Logic
        let slideIndex = 1;
        const slides = document.querySelectorAll('.slide');
        const showSlides = (n) => {
            if (n > slides.length) slideIndex = 1;
            if (n < 1) slideIndex = slides.length;
            slides.forEach(slide => slide.classList.remove('active'));
            slides[slideIndex - 1].classList.add('active');
        };
        const plusSlides = (n) => showSlides(slideIndex += n);
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => plusSlides(-1));
            nextBtn.addEventListener('click', () => plusSlides(1));
        }
    };

    // --- 10. RENDER FUNCTION: LIVE PROJECTS ---
    const renderLiveProjectsPage = () => {
        const tabButtonsHTML = projectsData.map((project, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" data-target="iframe-${project.id}">
                ${project.title}
            </button>
        `).join('');

        const iframesHTML = projectsData.map((project, index) => `
            <div class="iframe-container ${index === 0 ? 'active' : ''}" id="iframe-${project.id}">
                 <div class="iframe-fallback">
                    Trouble viewing? <a href="${project.liveSiteLink}" target="_blank" rel="noopener noreferrer">Open site in a new tab ↗</a>
                </div>
                <iframe src="${index === 0 ? project.liveSiteLink : ''}" data-src="${project.liveSiteLink}" title="${project.title}"></iframe>
            </div>
        `).join('');

        appRoot.innerHTML = `
            <section class="live-projects-section reveal-on-scroll" id="live">
                <h2 class="section-title" tabindex="-1">Live Projects</h2>
                <div class="project-tabs">${tabButtonsHTML}</div>
                <div class="iframe-wrapper">${iframesHTML}</div>
            </section>
            <footer class="main-footer">
                <a href="#home" class="cta-button secondary" style="margin-bottom: 1rem;">&larr; Back to Portfolio</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        document.querySelector('.section-title').focus();
        observeElements();
    };

    // --- 11. CONTACT FORM HANDLER ---
    const attachContactFormListener = () => {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => input.classList.remove('input-error'));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const honeypotInput = document.getElementById('confirm_email');
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.textContent;

            // 1. Honeypot Check (Instant Reject)
            if (honeypotInput.value) return;

            // 2. Browser Native Validation check
            if (!contactForm.checkValidity()) {
                inputs.forEach(input => {
                    if (!input.validity.valid) input.classList.add('input-error');
                });
                showToast("Please fill out all required fields correctly.", "error");
                return;
            }

            // 3. Custom Logic (Message Length)
            const messageValue = messageInput.value.trim();
            if (messageValue.length < 50) {
                messageInput.classList.add('input-error');
                showToast(`Your message is too short (${messageValue.length}/50 chars).`, "error");
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
                    body: {
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        message: messageValue,
                        honeypot: ""
                    }
                });

                if (error) throw error;

                showToast("Message sent successfully!", "success");
                contactForm.reset();
                submitBtn.textContent = 'Sent!';
            } catch (error) {
                console.error('Error:', error);
                showToast("Failed to send message. Please try again.", "error");
                submitBtn.textContent = originalBtnText;
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    };

    // --- 12. ROUTING (Hash Based) ---
    const handleRouting = () => {
        const hash = window.location.hash;
        closeNav(); // Close nav on any route change

        if (hash.startsWith('#project-')) {
            const id = hash.replace('#project-', '');
            renderProjectPage(id);
            setActiveLink('#portfolio');
        } else if (hash === '#live') {
            renderLiveProjectsPage();
            setActiveLink('#live');
        } else {
            // Default: Home View
            renderHomePage(hash);

            // Set Active Link Logic
            if (hash === '#home' || hash === '') setActiveLink('#home');
            else if (hash === '#about') setActiveLink('#about');
            else if (hash === '#portfolio') setActiveLink('#portfolio');
            else if (hash === '#contact') setActiveLink('#contact');
        }
    };

    // --- 13. GLOBAL EVENT LISTENERS ---

    // Listen for Back/Forward button clicks
    window.addEventListener('hashchange', handleRouting);
    // Handle initial load
    window.addEventListener('load', handleRouting);

    // Modal Image Logic
    const closeModal = () => {
        imageModal.classList.remove('visible');
        setTimeout(() => { modalImage.src = ""; modalCaption.textContent = ""; }, 300);
    };
    if (modalClose) modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });

    // Global Click Delegation
    appRoot.addEventListener('click', (e) => {
        const galleryImage = e.target.closest('.gallery-image');
        if (galleryImage) {
            modalImage.src = galleryImage.src;
            modalCaption.textContent = galleryImage.dataset.caption;
            imageModal.classList.add('visible');
        }

        const tabButton = e.target.closest('.tab-button');
        if (tabButton) {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.iframe-container').forEach(container => {
                container.classList.remove('active');
                const iframe = container.querySelector('iframe');
                if (iframe) iframe.src = "";
            });
            tabButton.classList.add('active');
            const targetContainer = document.getElementById(tabButton.dataset.target);
            if (targetContainer) {
                targetContainer.classList.add('active');
                const targetIframe = targetContainer.querySelector('iframe');
                if (targetIframe) targetIframe.src = targetIframe.dataset.src;
            }
        }

        const backToTop = e.target.closest('.back-to-top');
        if (backToTop) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});