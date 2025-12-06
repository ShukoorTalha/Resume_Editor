# 🚀 Quick Start Guide

Get the Resume Builder running in **30 seconds**!

## Prerequisites

You only need **Docker** and **Docker Compose** installed. Nothing else!

### Install Docker (if you don't have it)

**Windows/Mac:**
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install and start Docker Desktop

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

### Verify Installation

```bash
docker --version
docker-compose --version
```

Both should show version numbers (no errors).

---

## 🎯 Start the Application (3 Steps!)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShukoorTalha/Resume_Editor.git
cd Resume_Editor
```

### Step 2: Start with Docker Compose

```bash
docker-compose up
```

That's it! The app is now building and starting.

**What's happening:**
- Docker is downloading Node.js image
- Building your application
- Starting the web server
- Ready to use!

### Step 3: Open in Browser

Once you see this message:
```
✓ Built successfully
✓ Server running on http://localhost:8080
```

**Open your browser and go to:** `http://localhost:8080`

---

## 🎉 Using the Application

### Features Available
- ✏️ Edit your resume in real-time
- 👀 See live preview side-by-side
- 💾 Auto-saves to your browser
- 📄 Download as PDF
- 🖨️ Print your resume
- 📱 Works on mobile too!

### Your Resume Data
- **Stored Locally**: Your data stays in your browser only
- **Private**: Nothing sent to any server
- **Persistent**: Data saves automatically
- **Easy Export**: Download as PDF anytime

---

## 🛑 Stopping the Application

### Option 1: Stop in Terminal
Press `Ctrl+C` in the terminal where `docker-compose up` is running.

### Option 2: Stop Background Container
```bash
docker-compose down
```

---

## 🔧 Troubleshooting

### "Port 8080 is already in use"

If port 8080 is taken, change it in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "9090:80"  # Changed from 8080:80
```

Then access at: `http://localhost:9090`

### "Docker is not running"

**Windows/Mac:** Start Docker Desktop from Applications folder.

**Linux:** 
```bash
sudo systemctl start docker
```

### "Cannot connect to Docker daemon"

Make sure Docker is started and you have permissions:
```bash
# Linux only:
sudo usermod -aG docker $USER
newgrp docker
```

### "Build fails with npm errors"

Try building fresh:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### Slow on first run?

First time takes **2-3 minutes** because Docker is downloading and building everything. This is normal! Subsequent starts are instant.

---

## 📚 More Documentation

- **Full Setup Guide**: See `DEPLOYMENT.md` for production deployment
- **Security Details**: See `SECURITY.md` for security audit
- **Project Details**: See `README.md` for features and tech stack
- **Nginx Setup**: See `scripts/setup-nginx.sh` for production server

---

## 🎓 What You Can Do

### Edit Your Resume
1. **Personal Info**: Add your name, title, contact details
2. **Work Experience**: Add jobs with descriptions
3. **Education**: Add schools, degrees, fields
4. **Skills**: Add skills with proficiency levels

### Download or Print
- **Download as PDF**: Click "Download PDF" button
- **Print**: Click "Print" button or use Ctrl+P
- **View Modes**: Switch between Edit, Preview, and Split View

### Export Your Data
Your resume data is automatically saved to your browser's localStorage.

To backup:
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Find key: `resume-data`
4. Copy the JSON value

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+P` or `Cmd+P` - Print resume
- `Ctrl+S` - Some browsers can save as PDF

### Mobile Friendly
- Open on phone at `http://your-computer-ip:8080`
- Edit and download from anywhere
- All data syncs across devices (same browser)

### Share Your Resume
1. Export to PDF
2. Share the PDF file
3. Or share the browser link (data stays on that device)

---

## ❓ Frequently Asked Questions

**Q: Is my data safe?**
A: Yes! Your data never leaves your browser. It's stored locally only.

**Q: Can I use it offline?**
A: Not after closing the browser, but the app itself doesn't need internet once loaded.

**Q: Can I sync across devices?**
A: Not automatically, but you can download as PDF and continue on another device.

**Q: What if I clear my browser cache?**
A: Your resume data will be deleted. Always keep a PDF backup!

**Q: Can I use this on a mobile phone?**
A: Yes! It's responsive. Just open `http://your-computer-ip:8080` on your phone.

**Q: Does this work offline?**
A: The first load needs internet for CDN resources (Tailwind, fonts), but works offline after that.

---

## 🚀 Next Steps

1. **Done with setup?** → Start editing your resume!
2. **Want to deploy?** → Check `DEPLOYMENT.md`
3. **Security concerns?** → Check `SECURITY.md`
4. **Contributing?** → See `README.md`

---

## 📞 Support

- **Issues?** Check troubleshooting above
- **Bug reports?** Create an issue on [GitHub](https://github.com/ShukoorTalha/Resume_Editor/issues)
- **Suggestions?** Open a discussion or PR

---

## 📄 License

MIT - Use freely!

---

**Happy Resume Building! 🎉**
