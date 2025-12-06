// --- 1. CONFIGURATION ---
const SUPABASE_PROJECT_URL = 'https://fidzotxqwlhzgztnskbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZHpvdHhxd2xoemd6dG5za2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODk4MzMsImV4cCI6MjA2MjE2NTgzM30.aH0Hy1cGz-9pZRRsyS5_DId9IKCgalNo6d56aNwQisc';
const FUNCTION_NAME = 'portfolio';
// ------------------------

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {

    // --- Core Elements ---
    const body = document.body;
    const navToggler = document.querySelector('.nav-toggler');
    const appRoot = document.getElementById('app-root');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    const currentYear = new Date().getFullYear();
    document.getElementById('nav-copyright').innerHTML = `© ${currentYear} Mitchell Laypath`;

    // --- Navigation Logic ---
    navToggler.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    const closeNav = () => {
        body.classList.remove('nav-open');
    }

    const setActiveLink = (activeId) => {
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.classList.remove('active-link');
        });
        const activeLink = document.getElementById(activeId);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    };

    // --- Theme Logic ---
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

    themeToggleButton.addEventListener('click', () => {
        let theme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    });

    // --- Scroll Animations ---
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

    // --- RENDER FUNCTION: HOME PAGE ---
    const renderHomePage = () => {
        setActiveLink('nav-home');

        const projectCardsHTML = projectsData.map(project => `
            <article class="project-card reveal-on-scroll" data-project-id="${project.id}">
                <div class="card-image">
                    <img loading="lazy" src="${project.heroImage}" alt="${project.altText}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-description">${project.synopsis}</p>
                    <ul class="card-tags">
                        ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
                    </ul>
                    <a href="#" class="card-button" data-project-id="${project.id}">View Case Study</a>
                </div>
            </article>
        `).join('');

        appRoot.innerHTML = `
            <section class="hero-section" id="home">
                <div class="hero-scrim"></div>
                <div class="hero-content">
                    <h1 class="hero-title" tabindex="-1">Mitchell Laypath</h1>
                    <h2 class="hero-subtitle">Full-Stack Developer & IT Specialist</h2>
                    <div class="hero-buttons">
                        <a href="#live" class="cta-button" id="hero-cta-button">View My Work</a>
                        <a href="media/Current Resume_Laypath.pdf" class="cta-button secondary" download>Download Resume</a>
                    </div>
                </div>
            </section>

            <section class="about-section reveal-on-scroll" id="about">
                <div class="about-wrapper">
                    <div class="about-image">
                        <img loading="lazy" src="media/Laypath-094.jpg" alt="A headshot of Mitchell Laypath.">
                    </div>
                    <div class="about-text">
                        <h2 class="section-title">About Me</h2>
                        <p>I am a Full-Stack Developer with a strong foundation in object-oriented programming (Java, C#) and IT support. I graduated from <strong>Arizona State University</strong> with a B.S. in Full-Stack Web Development (3.88 GPA).</p>
                        <p>Beyond code, I have professional experience as a <strong>Support Analyst</strong> for the Arizona Supreme Court, where I honed my troubleshooting and problem-solving skills.</p>
                        
                        <div class="skills-container">
                            <h3>Tech Stack</h3>
                            <ul class="skills-list">
                                <li>JavaScript (ES6+)</li>
                                <li>C# & Unity</li>
                                <li>Node.js & Express</li>
                                <li>Supabase & SQL</li>
                                <li>HTML5 & CSS3</li>
                                <li>Git & GitHub</li>
                            </ul>
                        </div>
                         <div class="skills-container" style="margin-top: 1.5rem;">
                            <h3>Education & Global Experience</h3>
                            <ul class="skills-list" style="display: block;">
                                <li style="margin-bottom: 5px; background: none; border: none; padding: 0;">🎓 <strong>Arizona State University</strong> - B.S. Full-Stack Web Development</li>
                                <li style="margin-bottom: 5px; background: none; border: none; padding: 0;">🌏 <strong>Waseda University (Tokyo, Japan)</strong> - Study Abroad (Visualization & Simulation)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section class="project-section reveal-on-scroll" id="portfolio">
                <h2 class="section-title">Portfolio</h2>
                <div class="project-grid">
                    ${projectCardsHTML}
                </div>
            </section>

            <section class="contact-section reveal-on-scroll" id="contact">
                <h2 class="section-title">Let's Connect</h2>
                <p class="contact-intro">
                    Have a project in mind or just want to say hi?
                    Fill out the form below, and I'll get back to you.
                </p>
                
                <form class="contact-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div style="display: none; visibility: hidden; opacity: 0;">
                         <label for="confirm_email">Don't fill this out</label>
                         <input type="text" id="confirm_email" name="confirm_email" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="6" required></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="cta-button">Send Message</button>
                    </div>
                </form>
            </section>

            <footer class="main-footer">
                <a href="#" class="back-to-top" aria-label="Back to top">&#9650;</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        observeElements();
        attachContactFormListener();
    };

    // --- RENDER FUNCTION: PROJECT DETAIL ---
    const renderProjectPage = (projectId) => {
        setActiveLink('nav-portfolio');
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
                <a href="#" class="back-to-top" aria-label="Back to top">&#9650;</a>
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

    // --- RENDER FUNCTION: LIVE PROJECTS ---
    const renderLiveProjectsPage = () => {
        setActiveLink('nav-live');

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
                <a href="#" class="back-to-top" aria-label="Back to top">&#9650;</a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
        document.querySelector('.section-title').focus();
        observeElements();
    };

    // --- CONTACT FORM HANDLER ---
    const attachContactFormListener = () => {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = contactForm.querySelector('button');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Gather data including the honeypot
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    honeypot: document.getElementById('confirm_email').value
                };

                try {
                    // Call Supabase Edge Function
                    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
                        body: formData
                    });

                    if (error) throw error;

                    alert('Message sent successfully! I will get back to you soon.');
                    contactForm.reset();
                    submitBtn.textContent = 'Sent!';
                } catch (error) {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again later.');
                    submitBtn.textContent = originalBtnText;
                } finally {
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        }
    };

    // --- EVENT LISTENERS (ROUTING) ---
    appRoot.addEventListener('click', (e) => {
        const projectLink = e.target.closest('[data-project-id]');
        if (projectLink) {
            e.preventDefault();
            renderProjectPage(projectLink.dataset.projectId);
        }

        const heroCTA = e.target.closest('#hero-cta-button');
        if (heroCTA) {
            e.preventDefault();
            renderLiveProjectsPage();
            closeNav();
        }

        const backToTop = e.target.closest('.back-to-top');
        if (backToTop) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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
    });

    document.getElementById('nav-home').addEventListener('click', (e) => { e.preventDefault(); renderHomePage(); closeNav(); });
    document.getElementById('nav-live').addEventListener('click', (e) => { e.preventDefault(); renderLiveProjectsPage(); closeNav(); });

    // Smooth scrolling for sections
    const handleSectionScroll = (id) => {
        if (!document.getElementById(id)) {
            renderHomePage();
            setTimeout(() => {
                document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
        }
        closeNav();
    };

    document.getElementById('nav-about').addEventListener('click', (e) => { e.preventDefault(); handleSectionScroll('about'); });
    document.getElementById('nav-portfolio').addEventListener('click', (e) => { e.preventDefault(); handleSectionScroll('portfolio'); });
    document.getElementById('nav-contact').addEventListener('click', (e) => { e.preventDefault(); handleSectionScroll('contact'); });

    // Lightbox Close Logic
    const closeModal = () => {
        imageModal.classList.remove('visible');
        setTimeout(() => { modalImage.src = ""; modalCaption.textContent = ""; }, 300);
    };
    modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });

    // Initial Load
    renderHomePage();
});