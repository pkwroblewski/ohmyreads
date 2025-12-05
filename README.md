# 📚 OhMyReads

> An AI-powered book tracker and reading companion that helps you discover, track, and enjoy your reading journey.

[![GitHub](https://img.shields.io/badge/GitHub-pkwroblewski%2Fohmyreads-blue?logo=github)](https://github.com/pkwroblewski/ohmyreads)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 📖 Core Features
- **AI-Powered Recommendations**: Get personalized book suggestions using Google Gemini AI
- **Smart Book Discovery**: Search and explore books from Open Library's vast collection
- **Reading Progress Tracking**: Monitor your current reads with visual progress bars
- **Personal Library**: Organize your books by status (Want to Read, Currently Reading, Finished)

### 📊 Analytics & Goals
- **Reading Analytics**: Beautiful visualizations of your reading habits and statistics
- **Goal Setting**: Set daily page goals and yearly book targets
- **Streak Tracking**: Maintain reading streaks and stay motivated
- **Progress Insights**: Track pages read, books completed, and reading pace

### 🤖 AI Librarian
- **Interactive Chat**: Ask the AI librarian for book recommendations
- **Mood-Based Discovery**: Find books based on your current mood
- **Personalized Suggestions**: Get recommendations based on your reading history

### 🌍 Community Features (Coming Soon)
- **Activity Feed**: See what the community is reading
- **Reading Groups**: Join or create book clubs
- **User Profiles**: Share your reading journey with others
- **Discussions**: Engage in book discussions

### 🎨 User Experience
- **Dark Mode**: Beautiful dark theme for night reading
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Smooth Animations**: Delightful micro-interactions throughout

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 3.4
- **AI Integration**: Google Gemini API
- **Data Source**: Open Library API
- **Charts**: Recharts 3.5
- **Icons**: Lucide React
- **Storage**: Local Storage (Supabase integration planned)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pkwroblewski/ohmyreads.git
   cd ohmyreads
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

---

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Book search and discovery
- [x] Reading progress tracking
- [x] AI-powered recommendations
- [x] Reading goals and streaks
- [x] Analytics dashboard

### Phase 2: Community Features 🚧
- [ ] User authentication (Supabase)
- [ ] User profiles and following
- [ ] Reading groups and discussions
- [ ] Activity feed
- [ ] Reviews and ratings

### Phase 3: Enhanced Features 📋
- [ ] Book notes and highlights
- [ ] Reading challenges
- [ ] Achievements and badges
- [ ] Mobile app (React Native)
- [ ] Social sharing

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**pkwroblewski**

- GitHub: [@pkwroblewski](https://github.com/pkwroblewski)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI recommendations
- [Open Library](https://openlibrary.org/) for book data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ and lots of ☕

</div>
