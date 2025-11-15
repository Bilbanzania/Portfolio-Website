// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get Core Elements ---
    const body = document.body;
    const navToggler = document.querySelector('.nav-toggler');
    const appRoot = document.getElementById('app-root');

    // Modal/Lightbox elements
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    // Get and set current year in the navigation footer
    const currentYear = new Date().getFullYear();
    document.getElementById('nav-copyright').innerHTML = `© ${currentYear} Mitchell Laypath`;

    // --- 2. Navigation Toggler Logic ---
    navToggler.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    const closeNav = () => {
        body.classList.remove('nav-open');
    }

    // --- 3. Theme Toggle Logic ---
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

    // --- 4. Back-to-Top Button Logic ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
    });

    // --- 5. SPA Page Rendering Logic ---

    // Function: renderHomePage
    const renderHomePage = () => {
        const projectCardsHTML = projectsData.map(project => `
            <article class="project-card" data-project-id="${project.id}">
                <div class="card-image">
                    <img src="${project.heroImage}" alt="${project.altText}">
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

        // UPDATED: Bio removed from hero, new About section added
        appRoot.innerHTML = `
            <section class="hero-section" id="home">
                <div class="hero-scrim"></div>
                <div class="hero-content">
                    <h1 class="hero-title">Mitchell Laypath</h1>
                    <h2 class="hero-subtitle">Full-stack Website Development</h2>
                    <a href="#live" class="cta-button" id="hero-cta-button">View My Work</a>
                </div>
            </section>

            <section class="about-section" id="about">
                <div class="about-wrapper">
                    <div class="about-image">
                        <img src="media/Laypath-094.jpg" alt="A headshot of Mitchell Laypath.">
                    </div>
                    <div class="about-text">
                        <h2 class="section-title">About Me</h2>
                        <p>A creative and detail-oriented developer specializing in building dynamic, responsive, and accessible web experiences from the ground up.</p>
                        <p>I have experience with the full stack, from building agent-based simulations in Unity/C# and interactive front-ends with vanilla JavaScript, to connecting to third-party APIs for live data. I'm passionate about clean code, user-friendly design, and bringing complex ideas to life on the web.</p>
                    </div>
                </div>
            </section>

            <section class="project-section" id="projects">
                <h2 class="section-title">Case Studies</h2>
                <div class="project-grid">
                    ${projectCardsHTML}
                </div>
            </section>

            <section class="contact-section" id="contact">
                <h2 class="section-title">Let's Connect</h2>
                <p class="contact-intro">
                    Have a project in mind or just want to say hi?
                    Fill out the form below, and I'll get back to you.
                </p>
                <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
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
                <a href="#" class="back-to-top" aria-label="Back to top">
                    &#9650;
                </a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
    };

    // Function: renderProjectPage
    const renderProjectPage = (projectId) => {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) {
            renderHomePage();
            return;
        }

        const galleryHTML = project.gallery.map(item => `
            <figure>
                <img src="${item.img}" alt="${item.alt}" class="gallery-image" data-caption="${item.caption}">
                <figcaption>${item.caption}</figcaption>
            </figure>
        `).join('');

        appRoot.innerHTML = `
            <header class="project-hero" style="background-image: url('${project.heroImage}');">
                <div class="hero-scrim"></div>
                <h1 class="project-title">${project.title}</h1>
            </header>

            <div class="project-content-wrapper">
                <aside class="project-sidebar">
                    <h3>Objective</h3>
                    <p>${project.objective}</p>
                    <h3>Synopsis</h3>
                    <p>${project.synopsisDetail}</p>
                    <a href="${project.githubLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                </aside>

                <section class="project-main-content">
                    <h2>Process</h2>
                    <p>${project.process}</p>
                    <h2>Results</h2>
                    <p>${project.results}</p>
                    <h2>Project Gallery</h2>
                    <div class="project-gallery">
                        ${galleryHTML}
                    </div>
                </section>
            </div>
            
            <footer class="main-footer">
                <a href="#" class="back-to-top" aria-label="Back to top">
                    &#9650;
                </a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
    };

    // Function: renderLiveProjectsPage
    const renderLiveProjectsPage = () => {
        const tabButtonsHTML = projectsData.map((project, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" data-target="iframe-${project.id}">
                ${project.title}
            </button>
        `).join('');

        const iframesHTML = projectsData.map((project, index) => `
            <div class="iframe-container ${index === 0 ? 'active' : ''}" id="iframe-${project.id}">
                <iframe src="${index === 0 ? project.liveSiteLink : ''}" data-src="${project.liveSiteLink}" title="${project.title}"></iframe>
            </div>
        `).join('');

        appRoot.innerHTML = `
            <section class="live-projects-section" id="live">
                <h2 class="section-title">Live Projects</h2>
                <div class="project-tabs">
                    ${tabButtonsHTML}
                </div>
                <div class="iframe-wrapper">
                    ${iframesHTML}
                </div>
            </section>
            
            <footer class="main-footer">
                <a href="#" class="back-to-top" aria-label="Back to top">
                    &#9650;
                </a>
                <p>© ${currentYear} Mitchell Laypath. All rights reserved.</p>
            </footer>
        `;
        window.scrollTo(0, 0);
    };

    // --- 6. Event Listeners for "Routing" & Interactions ---
    appRoot.addEventListener('click', (e) => {

        // Project Card Click
        const projectLink = e.target.closest('[data-project-id]');
        if (projectLink) {
            e.preventDefault();
            const projectId = projectLink.dataset.projectId;
            renderProjectPage(projectId);
        }

        // Hero CTA Click
        const heroCTA = e.target.closest('#hero-cta-button');
        if (heroCTA) {
            e.preventDefault();
            renderLiveProjectsPage();
            closeNav();
        }

        // Back-to-Top Click
        const backToTop = e.target.closest('.back-to-top');
        if (backToTop) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Gallery Image Click (Lightbox)
        const galleryImage = e.target.closest('.gallery-image');
        if (galleryImage) {
            modalImage.src = galleryImage.src;
            modalCaption.textContent = galleryImage.dataset.caption;
            imageModal.classList.add('visible');
        }

        // Live Project Tab Click
        const tabButton = e.target.closest('.tab-button');
        if (tabButton) {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.iframe-container').forEach(container => {
                container.classList.remove('active');
                const iframe = container.querySelector('iframe');
                if (iframe) {
                    iframe.src = ""; // Stops the project
                }
            });

            tabButton.classList.add('active');

            const targetContainer = document.getElementById(tabButton.dataset.target);
            if (targetContainer) {
                targetContainer.classList.add('active');
                const targetIframe = targetContainer.querySelector('iframe');
                if (targetIframe) {
                    targetIframe.src = targetIframe.dataset.src; // Loads the new project
                }
            }
        }
    });

    // Nav Link Listeners
    document.getElementById('nav-home').addEventListener('click', (e) => {
        e.preventDefault();
        renderHomePage();
        closeNav();
    });

    document.getElementById('nav-projects').addEventListener('click', (e) => {
        e.preventDefault();
        renderHomePage();
        setTimeout(() => {
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        closeNav();
    });

    document.getElementById('nav-live').addEventListener('click', (e) => {
        e.preventDefault();
        renderLiveProjectsPage();
        closeNav();
    });

    document.getElementById('nav-contact').addEventListener('click', (e) => {
        e.preventDefault();
        renderHomePage();
        setTimeout(() => {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        closeNav();
    });


    // --- 7. Lightbox Close Listeners ---
    const closeModal = () => {
        imageModal.classList.remove('visible');
        setTimeout(() => {
            modalImage.src = "";
            modalCaption.textContent = "";
        }, 300);
    };

    modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });


    // --- 8. Initial Page Load ---
    renderHomePage();

});