// Stores all project data
const projectsData = [
    {
        id: "web-capabilities",
        title: "Exploring Web Development",
        synopsis: "This project is a strong example of a modern, small-business-style website, demonstrating core full-stack development skills.",
        tags: ["jQuery", "API", "Web Storage", "CSS"],
        heroImage: "media/Exploring-WC-Home.png",
        altText: "Screenshot of a web app showing a live weather report.",
        liveSiteLink: "https://bilbanzania.github.io/Personal-Project_4",
        objective: "The goal was to build a dynamic single-page application that could connect to a third-party API, display live weather data, and utilize jQuery widgets for smoother UI animations and navigation.",
        synopsisDetail: "This project is a strong example of a modern, small-business-style website, demonstrating core full-stack development skills. The inspiration was to explore and showcase what modern code can do to create a responsive, data-driven user experience.",
        process: "I started by mapping out the application flow, deciding to use jQuery to manage multiple \"pages\" of content within a single index.html file. From there, I designed simple wireframes for each section to guide the layout and user flow. After establishing the color palette and core design, I began coding the application. This involved integrating the OpenWeatherMap API to fetch and display live data and implementing jQuery UI widgets (like the accordion) to organize content cleanly.",
        results: "The project was completed successfully within the academic timeframe. The final application is fully functional, responsive, and demonstrates a clean separation of concerns. The work in full can be seen in my GitHub repository.",
        githubLink: "https://github.com/Bilbanzania/Personal-Project_4",
        gallery: [
            { img: "media/Exploring-WC-Wireframe.png", alt: "A simple wireframe for the website layout.", caption: "Wireframe for the website." },
            { img: "media/Exploring-WC-About.png", alt: "The 'About' section of the web application.", caption: "The 'About' section of the website." },
            { img: "media/Exploring-WC-Darkmode.png", alt: "The website shown in dark mode on a mobile view.", caption: "Example of the dark mode color change." }
        ]
    },
    {
        id: "mothers-day",
        title: "Mother's Day Web Card",
        synopsis: "A personal project created to serve as a unique, interactive, and memorable Mother's Day gift.",
        tags: ["Vanilla JS", "CSS Animations", "DOM Manipulation"],
        heroImage: "media/Mothers-Day-Responsiveness.png",
        altText: "A chibi-style character art for a Mother's Day web card.",
        liveSiteLink: "https://bilbanzania.github.io/Mothers-Day-Web-Card",
        objective: "This was a personal project I created to serve as a unique, interactive, and memorable Mother's Day gift.",
        synopsisDetail: "The inspiration came from the idea of digital greeting cards. Instead of a static image, I wanted to leverage my web development skills to create an immersive experience with animation, music, and interactivity.",
        process: "I wanted to create something truly creative and original. The process began with designing the chibi-style character art. From there, I built the entire experience from the ground up using pure HTML, CSS, and JavaScript. I focused on creating a magical, heartwarming feel through a variety of animations and interactive features, including: Interactive Start, CSS Animations, Dynamic Text, DOM Manipulation, and Responsive Design.",
        results: "The result was a highly personal and polished web application that my mom loved. It serves as a strong portfolio piece demonstrating creative front-end development and a deep understanding of vanilla JavaScript, CSS3 animations, and DOM manipulation. The full project is available on GitHub.",
        githubLink: "https://github.com/Bilbanzania/Mothers-Day-Web-Card",
        gallery: [
            { img: "media/Mothers-Day-Intro.png", alt: "The start screen showing 'Tap to Begin'.", caption: "This is how the web card begins." },
            { img: "media/Mothers-Day-Example.png", alt: "The main card with chibi art and animations.", caption: "Then it plays music with animations." },
            { img: "media/Mothers-Day-Character.png", alt: "The original chibi character file.", caption: "Original character file." }
        ]
    },
    {
        id: "gpa-sim",
        title: "Student GPA Simulation",
        synopsis: "A 3D agent-based simulation in Unity to test an academic hypothesis.",
        tags: ["Unity", "C#", "3D Modeling", "AI Agents"],
        heroImage: "media/Student-GPA-Running.png",
        altText: "A 3D Unity simulation showing agent-based models.",
        liveSiteLink: "https://bilbanzania.github.io/Study-Abroad-Unity-Project_WebGL",
        objective: "The objective was to design and build a 3D agent-based simulation in Unity to test a hypothesis: would adding more study rooms on a college campus correlate with an increase in the average student GPA?",
        synopsisDetail: "This project was inspired by the use of simulations in business and civil engineering to test outcomes and designs. I wanted to apply that same logic to a social and academic question relevant to a university environment.",
        process: "I began by modeling the basic 3D assets for the campus environment and the student \"agents\" in Unity. The core of the project was focusing on the C# code for the AI agents. I developed logic to simulate student behavior—giving them a schedule, pathfinding to classes, and a drive to study. The simulation's logic would track the average \"GPA\" of all agents based on factors like study room availability and wait times, which directly impacted their ability to \"study.\"",
        results: "The simulation successfully ran, and the collected data showed a slight but consistent increase in the average GPA when more study rooms were available, suggesting a positive correlation. As a final project for a study abroad course, it was a challenging build completed within a tight two-week timeframe. The project, including the WebGL build, is available on GitHub.",
        githubLink: "https://github.com/Bilbanzania/Study-Abroad-Unity-Project_WebGL",
        gallery: [
            { img: "media/Student-GPA-Intro.png", alt: "The starting screen for the simulation.", caption: "The starting screen for the simulation." },
            { img: "media/Student-GPA-Code Snippet.png", alt: "A snippet of the C# code for the AI agents.", caption: "Snippet from the AI Agents code." },
            { img: "media/Student-GPA-Running.png", alt: "The simulation running with agents moving.", caption: "The simulation running with agents moving." }
        ]
    }
];