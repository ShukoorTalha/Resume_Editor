# Professional Resume Builder

A modern, feature-rich resume builder built with React, TypeScript, and Tailwind CSS. Designed for simplicity, performance, and local-first data handling.

## ✨ Features

- 📝 **Real-time Editing**: See changes instantly as you type
- 💾 **Auto-Save**: Resume automatically saves to browser localStorage
- 📄 **PDF Export & Print**: Download or print your resume with one click
- 🔒 **Local & Private**: All data stays in your browser—nothing sent to servers
- 🎨 **Clean, Professional UI**: Distraction-free split-view editing
- 📋 **Modular Components**: Organized sections for Profile, Experience, Education, and Skills
- 🔔 **Toast Notifications**: User-friendly feedback for all actions
- ⚡ **Production-Ready**: Multi-stage Docker deployment included

## Getting Started

### Option 1: Run with Docker (Recommended)

If you have Docker installed, you can get up and running in seconds.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ShukoorTalha/Resume_Editor.git
   cd Resume_Editor
   ```

2. **Start the app:**

   ```bash
   docker-compose up -d
   ```

3. Open your browser and navigate to `http://localhost:8080`

### Option 2: Run with Node.js

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. Open the link provided in the terminal (usually `http://localhost:3000`)

### Option 3: Build for Production

To generate static files for deployment (e.g., GitHub Pages, Netlify, Vercel):

```bash
npm run build
```

The output will be in the `dist/` folder.

## Project Structure

```txt
Resume_Editor/
├── components/              # React components
│   ├── ResumeEditor.tsx    # Main editor component
│   ├── ResumePreview.tsx   # Resume preview/print view
│   ├── ProfileSection.tsx  # Personal info editor
│   ├── ExperienceSection.tsx # Work experience editor
│   ├── EducationSection.tsx # Education editor
│   └── SkillsSection.tsx   # Skills editor
├── context/                 # React context providers
│   └── ToastContext.tsx    # Toast notification system
├── hooks/                   # Custom React hooks
│   └── useLocalStorage.ts  # localStorage persistence hook
├── services/               # API/external service integrations
├── App.tsx                 # Main app component
├── types.ts               # TypeScript type definitions
├── index.tsx              # React entry point
├── index.css              # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── Dockerfile             # Docker build configuration
└── docker-compose.yml     # Docker Compose configuration
```

## Key Enhancements

### 🔄 Data Persistence

- **Auto-save to localStorage**: Resume data is automatically saved and restored on page reload
- No server required—all data stays local and private

### 🔔 Toast Notifications

- Success, error, and info notifications for user actions
- Auto-dismiss notifications with manual close option
- Replaced basic alert dialogs with professional UI

### 📦 Modular Architecture

- **Split components**: Separate concerns into ProfileSection, ExperienceSection, EducationSection, and SkillsSection
- Easier to maintain, test, and extend
- Each section manages its own state updates

### 🎯 Skill Level Management

- Added proficiency levels for skills: Beginner, Intermediate, Expert
- Users can set and update skill proficiency directly in the Skills section

### 🐳 Production Deployment

- Multi-stage Docker build for optimized image size
- Includes both development and production configurations
- Ready for deployment to any container platform (Kubernetes, Docker Swarm, etc.)

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vite** - Fast build tool and dev server
- **Lucide React** - Icon library
- **html2pdf.js** - PDF export functionality
- **Docker** - Containerization

## Development Tips

### Customizing Colors

Edit the Tailwind theme in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',    // Change primary color
        secondary: '#475569',  // Change secondary color
      }
    }
  }
}
```

### Adding New Sections

1. Create a new component in `components/` (e.g., `CertificationsSection.tsx`)
2. Add the data type to `types.ts`
3. Import and integrate in `ResumeEditor.tsx`
4. Update `ResumePreview.tsx` to display the new section

### Building Docker Image Locally

```bash
docker build -t resume-builder:latest .
docker run -p 8080:80 resume-builder:latest
```

## License

MIT

