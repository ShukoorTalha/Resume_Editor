# Student Resume Builder

A minimal, local-first resume builder built with React, TypeScript, and Tailwind CSS. Designed to be easy to run, modify, and deploy for students.

## Features

- 📝 **Real-time Editing**: See changes instantly as you type.
- 📄 **PDF Export**: Download your resume with one click.
- 🔒 **Local & Private**: No data is sent to any server. Everything runs in your browser.
- 🎨 **Clean UI**: Professional, distraction-free interface.

## Getting Started

### Option 1: Run with Docker (Recommended)

If you have Docker installed, you can get up and running in seconds.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/resume-builder.git
    cd resume-builder
    ```

2.  **Start the app:**
    ```bash
    docker-compose up -d
    ```

3.  Open your browser and navigate to `http://localhost:8080`.

### Option 2: Run with Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  Open the link provided in the terminal (usually `http://localhost:3000`).

### Option 3: Build for Production

To generate static files for deployment (e.g., GitHub Pages, Netlify, Vercel):

```bash
npm run build
```

The output will be in the `dist/` folder.

## Project Structure

- `src/`: Contains the React source code.
- `index.html`: The entry point for the application.
- `Dockerfile`: Configuration for building the Docker image.
- `docker-compose.yml`: Configuration for running the container.

## License

MIT