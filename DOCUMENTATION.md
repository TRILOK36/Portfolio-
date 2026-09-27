# Project Documentation — Personal Portfolio Website

## 1. Introduction
This project is a personal portfolio website built to present my academic background, technical skills, and projects in a format suitable for recruiters, internship providers, and faculty evaluation. It was developed as part of the Software Engineering portfolio website task.

## 2. Problem Statement
Students need a single, professional, always-accessible place to showcase their skills and project work, rather than relying on scattered PDFs or slide decks that are hard to keep updated or share.

## 3. Objectives
- Build a responsive, professional personal portfolio website.
- Learn to manage source code with Git and GitHub.
- Deploy a live website using Vercel with continuous deployment from GitHub.
- Document the project to a professional standard.

## 4. Proposed Solution
A single-page static website with clearly defined sections (Home, About, Skills, Projects, Education, Achievements, Experience, Resume, Contact), built without a framework to keep the codebase easy to understand, extend, and deploy without a build step.

## 5. Technologies Used
| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, Grid, Flexbox) |
| Interactivity | Vanilla JavaScript |
| Fonts | Google Fonts (Space Grotesk, Inter) |
| Version control | Git & GitHub |
| Hosting | Vercel |

## 6. System Requirements
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A GitHub account for source control
- A Vercel account (can sign in with GitHub) for deployment
- No local build tools or package installation required

## 7. Website Features
- Responsive layout across mobile, tablet and desktop breakpoints
- Light/dark theme toggle with preference saved in the browser
- Sticky navigation bar with a mobile hamburger menu
- Filterable project grid (All / AI-ML / Systems / Web)
- Front-end contact form
- Downloadable resume link

## 8. Website Structure
```
Home → About → Skills → Projects → Education → Achievements → Experience → Resume → Contact
```
Each section is a full-width `<section>` in `index.html`, styled from a single `style.css` token system, with behaviour handled in `script.js`.

## 9. UI/UX Design
- **Color palette:** cool light background (`#F6F7FB`) with an indigo-violet primary accent (`#4C4FE0`) and an amber secondary accent (`#E8A23D`), with a matching dark theme.
- **Typography:** Space Grotesk for headings, Inter for body text.
- **Layout:** left-aligned content within a centered max-width container; a node-graph illustration in the hero represents the AI/ML focus.
- **Accessibility:** visible focus states on interactive elements, reduced-motion support, sufficient color contrast in both themes.

## 10. Implementation
- `index.html` — semantic section markup for all required content areas.
- `style.css` — CSS custom properties drive both the light and dark themes from one set of components.
- `script.js` — handles theme persistence (`localStorage`), mobile navigation toggle, project filtering by `data-tags`, and a front-end-only contact form handler.

## 11. GitHub Repository
Source code is version-controlled in a public GitHub repository with a structured commit history and a descriptive `README.md`.
Repository: `https://github.com/<your-username>/<your-repo>`

## 12. Vercel Deployment
The repository is connected to Vercel for continuous deployment: every push to the main branch triggers a new deployment automatically, with no build configuration required since the site is static.
Live URL: _add after deployment_

## 13. Testing
- Verified responsive behaviour at mobile (375px), tablet (768px) and desktop (1280px+) widths.
- Checked all navigation links scroll to the correct section.
- Verified theme toggle persists across page reloads.
- Verified project filter buttons correctly show/hide cards.
- Checked for broken links and console errors before deployment.

## 14. Screenshots
_Insert screenshots of the deployed site here (Home, Projects, Contact, and mobile view)._

## 15. Challenges Faced
_Fill in based on your actual build experience — e.g. structuring the CSS theme system, getting the mobile nav to behave correctly, or picking a color palette that didn't look templated._

## 16. Future Scope
- Connect the contact form to a real backend (e.g. Formspree or a small serverless function).
- Add a blog section for write-ups on projects and coursework.
- Add a custom domain and basic SEO/Open Graph metadata.
- Add Google Analytics for visitor insights.

## 17. Conclusion
This project delivers a working, deployable personal portfolio that satisfies the assignment's structural and technical requirements while remaining simple enough to fully understand, explain, and extend.

## 18. References
- MDN Web Docs — https://developer.mozilla.org
- Vercel Documentation — https://vercel.com/docs
- Google Fonts — https://fonts.google.com
