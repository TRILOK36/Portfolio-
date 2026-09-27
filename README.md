# Trilok Shahu — Personal Portfolio Website

A responsive personal portfolio website built with plain HTML, CSS and JavaScript, showcasing education, skills, projects, and professional profile.

**Live site:** https://portfolio-9eog.vercel.app/index.html

## Features

- A separate HTML page per section: Home, About, Skills, Projects, Education, Achievements, Experience, Resume, Contact
- Responsive layout (mobile, tablet, desktop)
- Light/dark mode toggle with saved preference, shared across pages
- Sticky navigation with mobile hamburger menu and current-page highlighting
- Filterable project grid (All / AI-ML / Systems / Web)
- A project demo that runs real Python in-browser via PyScript/MicroPython (WebAssembly) — no backend server
- Front-end contact form (ready to connect to a service like Formspree)
- No build step or dependencies — deploys as a static site

## Technologies Used

- HTML5
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript
- Google Fonts (Space Grotesk, Inter)

## Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

No dependencies to install — this is a static site.

## How to Run Locally

Open `index.html` directly in a browser, or serve it locally:

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`.

## Project Structure

```
.
├── index.html          # Home
├── about.html           # About
├── skills.html           # Skills
├── projects.html          # Projects (filterable grid)
├── hill-climbing.html      # Detail page for the Smart Frame Hospital project
├── hospital-app.html        # Live demo page (loads PyScript + the Python file below)
├── hospital_app.py            # Real Python — runs in-browser via PyScript/MicroPython
├── smart-frame-hospital.zip # Downloadable original Python source
├── education.html          # Education
├── achievements.html        # Achievements & certifications
├── experience.html           # Experience
├── resume.html                 # Resume download
├── contact.html                 # Contact links + form
├── style.css                     # Shared theme tokens, layout, components
├── script.js                      # Theme toggle, nav, project filter, contact form
├── resume.pdf                      # Your resume (add this file)
└── README.md
```

## Screenshots

_Add screenshots of your deployed site here, e.g.:_

```
![Home section](screenshots/home.png)
![Projects section](screenshots/projects.png)
```

## GitHub Repository

https://github.com/TRILOK36/Portfolio-

## Live Vercel Deployment

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Framework preset: **Other** (static site) — no build command needed.
4. Deploy, then copy the live URL back into this README and the Resume section link.
5.live Vercel link: https://portfolio-9eog.vercel.app/index.html
## Author

**Trilok Shahu**
B.Tech Computer Science (AI/ML), Sandip University — Batch 2025

## Contact / Social Links

- Email: Trilokshahu36@gmail.com 
- LinkedIn: https://www.linkedin.com/in/trilok-shahu-736469418?
- GitHub: https://github.com/TRILOK36
