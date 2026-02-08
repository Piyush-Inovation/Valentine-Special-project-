# 💖 Valentine Week — For Aditi

A complete, interactive Valentine Week website made with pure HTML, CSS & JavaScript. Each day of Valentine Week has its own beautiful page with romantic animations, messages, and interactive elements.

## 🌸 Features

- **9 Beautiful Pages** — One for each day of Valentine Week
- **Interactive Proposal** — YES/NO buttons with playful NO logic
- **Real-time Notifications** — Get notified when she clicks YES or tries NO
- **Heart Animations** — Floating hearts, confetti, bursts
- **Mobile Responsive** — Looks gorgeous on all devices
- **Backend API** — Tracks responses, NO attempts & page visits

## 📁 Project Structure

```
valentine-project/
├── index.html           💖 Main Proposal Page
├── rose-day.html        🌹 Rose Day
├── propose-day.html     💍 Propose Day
├── chocolate-day.html   🍫 Chocolate Day
├── teddy-day.html       🧸 Teddy Day
├── promise-day.html     🤝 Promise Day
├── hug-day.html         🤗 Hug Day
├── kiss-day.html        💋 Kiss Day
├── valentine-day.html   ❤️ Valentine's Day (Final)
├── css/
│   └── style.css        🎨 Complete Stylesheet
├── js/
│   └── main.js          ⚡ All JavaScript Logic
├── backend/
│   ├── server.js        🖥️ Node.js Backend
│   └── saveResponse.php 🐘 PHP Alternative
├── package.json
└── README.md
```

## 🚀 How to Run

### Option 1: With Node.js Backend (Recommended)

```bash
# Navigate to project directory
cd valentine-project

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

### Option 2: Without Backend (Frontend Only)

Simply open `index.html` in any browser. The website works fully without the backend — the backend is only needed for notifications and response tracking.

### Option 3: PHP Backend

Host the project on any PHP server (XAMPP, WAMP, etc.) and use `backend/saveResponse.php` as the API endpoint.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/response` | Save YES/FOREVER response |
| POST | `/api/no-attempt` | Track NO button attempts |
| POST | `/api/page-visit` | Track page visits |
| POST | `/api/hug` | Track virtual hugs |
| POST | `/api/kiss` | Track virtual kisses |
| GET | `/api/stats` | Get all statistics |
| GET | `/api/notifications` | Get notification feed |

## 🔔 Notifications

When the backend is running, you'll see **real-time console notifications** for:
- ✅ Every YES click
- 😜 Every NO attempt (with count)
- 📄 Every page visit
- 🤗 Every virtual hug
- 💋 Every virtual kiss
- 💍 "Forever Yours" click

All notifications are also saved to `backend/notifications.log`.

## 💕 Made with Love for Aditi
