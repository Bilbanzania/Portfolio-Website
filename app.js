/* --- 1. Configuration & Global Variables --- */
const SUPABASE_PROJECT_URL = 'https://fidzotxqwlhzgztnskbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZHpvdHhxd2xoemd6dG5za2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODk4MzMsImV4cCI6MjA2MjE2NTgzM30.aH0Hy1cGz-9pZRRsyS5_DId9IKCgalNo6d56aNwQisc';
const FUNCTION_NAME = 'portfolio';

const supabaseClient = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
let projectsData = [];

document.addEventListener('DOMContentLoaded', async () => {

    /* --- 2. Core Elements --- */
    const body = document.body;
    const navToggler = document.querySelector('.nav-toggler');
    const appRoot = document.getElementById('app-root');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    const currentYear = new Date().getFullYear();

    /* --- 3. Helper Functions (Toasts) --- */
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

    /* --- 4. Data Fetching (Projects) --- */
    const fetchProjects = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;

            projectsData = data.map(p => ({
                id: p.id,
                title: p.title,
                synopsis: p.synopsis,
                tags: p.tags || [],
                heroImage: p.hero_image,
                altText: p.alt_text,
                liveSiteLink: p.live_site_link,
                objective: p.objective,
                synopsisDetail: p.synopsis_detail,
                process: p.process,
                results: p.results,
                githubLink: p.github_link,
                gallery: p.gallery || []
            }));

            handleRouting();

        } catch (err) {
            console.error('Error fetching projects:', err);
            appRoot.innerHTML = `<div style="text-align:center; padding: 2rem;">
                <h3>Error loading content</h3>
                <p>Please check your connection or try again later.</p>
            </div>`;
        }
    };

    /* --- 5. View Counter Logic (RPC with Animation) --- */
    const updateViewCount = async () => {
        const counterEl = document.getElementById('view-counter');
        if (!counterEl) return;

        try {
            const { data, error } = await supabaseClient.rpc('increment_views');

            if (error) throw error;

            const target = data;
            const duration = 1500;
            const start = 0;
            const increment = target / (duration / 16);

            let current = 0;
            const animateCount = () => {
                current += increment;
                if (current < target) {
                    counterEl.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(animateCount);
                } else {
                    counterEl.innerText = target.toLocaleString();
                }
            };

            animateCount();

        } catch (err) {
            console.error('Error updating views:', err);
            counterEl.innerText = "--";
        }
    };

    /* --- 6. Navigation Logic --- */
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

    /* --- 7. Theme Logic --- */
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

    /* --- 8. Scroll Animations --- */
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    body.classList.add('scrolled');
                } else {
                    body.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
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

    /* --- 9. Render Helper: Project Grid --- */
    const generateProjectGridHTML = () => {
        if (!projectsData || projectsData.length === 0) return '<p>Loading projects...</p>';

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

    /* --- 10. Render Function: Home Page --- */
    const renderHomePage = (scrollToId = null) => {
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

        const template = document.getElementById('home-template');
        const content = template.content.cloneNode(true);

        const gridContainer = content.getElementById('static-project-grid');
        if (gridContainer) {
            gridContainer.innerHTML = generateProjectGridHTML();
        }

        const footerCopyright = content.getElementById('footer-copyright');
        if (footerCopyright) {
            footerCopyright.innerHTML = `© ${currentYear} Mitchell Laypath. All rights reserved.`;
        }

        appRoot.innerHTML = '';
        appRoot.appendChild(content);

        if (scrollToId) {
            setTimeout(() => {
                document.querySelector(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }

        observeElements();
        attachContactFormListener();
    };

    /* --- 11. Render Function: Project Detail --- */
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
                <a href="#portfolio" class="cta-button secondary" style="margin-bottom: 1rem;">&larr; Back to Portfolio</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        document.querySelector('.project-title').focus();
        observeElements();

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

    /* --- 12. Render Function: Live Projects --- */
    const renderLiveProjectsPage = () => {
        const tabButtonsHTML = projectsData.map((project, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" data-target="iframe-${project.id}">
                ${project.title}
            </button>
        `).join('');

        const iframesHTML = projectsData.map((project, index) => `
            <div class="iframe-container ${index === 0 ? 'active' : ''}" id="iframe-${project.id}">
                 <div class="iframe-placeholder" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; background:var(--bg-panel); color:var(--text-body);">
                    <p style="margin-bottom:1rem; padding: 0 1rem;">Click below to load the live preview for <br><strong>${project.title}</strong></p>
                    <button class="cta-button load-iframe-btn" data-src="${project.liveSiteLink}">Load Preview</button>
                    <div class="iframe-fallback" style="margin-top:1rem; background:transparent;">
                        Or <a href="${project.liveSiteLink}" target="_blank" rel="noopener noreferrer">open in new tab ↗</a>
                    </div>
                </div>
                <iframe data-src="${project.liveSiteLink}" title="${project.title}" style="display:none;"></iframe>
            </div>
        `).join('');

        appRoot.innerHTML = `
            <section class="live-projects-section reveal-on-scroll" id="live">
                <h2 class="section-title" tabindex="-1">Live Projects</h2>
                <div class="project-tabs">${tabButtonsHTML}</div>
                <div class="iframe-wrapper">${iframesHTML}</div>
            </section>
            <footer class="main-footer">
                <a href="#home" class="cta-button secondary" style="margin-bottom: 1rem;">&larr; Back to Home</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        document.querySelector('.section-title').focus();
        observeElements();
    };

    /* --- 13. Contact Form Handler --- */
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

            if (honeypotInput.value) return;

            if (!contactForm.checkValidity()) {
                inputs.forEach(input => {
                    if (!input.validity.valid) input.classList.add('input-error');
                });
                showToast("Please fill out all required fields correctly.", "error");
                return;
            }

            const messageValue = messageInput.value.trim();
            if (messageValue.length < 50) {
                messageInput.classList.add('input-error');
                showToast(`Your message is too short (${messageValue.length}/50 chars).`, "error");
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const { data, error } = await supabaseClient.functions.invoke(FUNCTION_NAME, {
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

    /* --- 14. Routing Logic --- */
    const handleRouting = () => {
        const hash = window.location.hash;
        closeNav();

        if (hash.startsWith('#project-')) {
            const id = hash.replace('#project-', '');
            renderProjectPage(id);
            setActiveLink('#portfolio');
        } else if (hash === '#live') {
            renderLiveProjectsPage();
            setActiveLink('#live');
        } else {
            renderHomePage(hash);
            if (hash === '#home' || hash === '') setActiveLink('#home');
            else if (hash === '#about') setActiveLink('#about');
            else if (hash === '#portfolio') setActiveLink('#portfolio');
            else if (hash === '#contact') setActiveLink('#contact');
        }
    };

    /* --- 15. Global Event Listeners --- */
    window.addEventListener('hashchange', handleRouting);

    const closeModal = () => {
        imageModal.classList.remove('visible');
        setTimeout(() => { modalImage.src = ""; modalCaption.textContent = ""; }, 300);
    };
    if (modalClose) modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });

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
            tabButton.classList.add('active');

            document.querySelectorAll('.iframe-container').forEach(container => {
                if (container.id === tabButton.dataset.target) {
                    container.classList.add('active');
                }
                else {
                    container.classList.remove('active');

                    const iframe = container.querySelector('iframe');
                    const placeholder = container.querySelector('.iframe-placeholder');
                    const btn = container.querySelector('.load-iframe-btn');

                    if (iframe) {
                        iframe.onload = null;
                        iframe.src = "";
                        iframe.style.display = 'none';
                    }
                    if (placeholder) {
                        placeholder.style.display = 'flex';
                    }
                    if (btn) {
                        btn.textContent = 'Load Preview';
                    }
                }
            });
        }
        const loadBtn = e.target.closest('.load-iframe-btn');
        if (loadBtn) {
            const container = loadBtn.closest('.iframe-container');
            const iframe = container.querySelector('iframe');
            const placeholder = container.querySelector('.iframe-placeholder');

            iframe.src = loadBtn.dataset.src;
            loadBtn.textContent = 'Loading...';

            const finishLoading = () => {
                if (loadBtn.textContent !== 'Loading...') return;

                iframe.style.display = 'block';
                placeholder.style.display = 'none';
            };

            iframe.onload = finishLoading;
            setTimeout(finishLoading, 1000);
        }

        const backToTop = e.target.closest('.back-to-top');
        if (backToTop) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    /* --- 16. Initialize --- */
    fetchProjects();
    updateViewCount();
});