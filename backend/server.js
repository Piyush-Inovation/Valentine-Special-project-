/* ═══════════════════════════════════════════════════
   💖 VALENTINE WEEK — Node.js Backend Server
   Handles responses, NO attempts tracking & notifications
   ═══════════════════════════════════════════════════ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');

// ── Configuration ──
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const LOG_FILE = path.join(__dirname, 'notifications.log');

// ── Email Configuration ──
// Using Gmail SMTP — you need to create an App Password:
// 1. Go to https://myaccount.google.com/apppasswords
// 2. Select "Mail" and your device
// 3. Generate a 16-char password
// 4. Paste it below replacing 'YOUR_APP_PASSWORD_HERE'
const EMAIL_CONFIG = {
  to: 'piyush.bramhankar027@gmail.com',        // Your email (notifications go here)
  from: 'piyush.bramhankar027@gmail.com',       // Same Gmail account
  appPassword: 'wunf etfr hjpg tusc'      // ← Gmail App Password
};

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_CONFIG.from,
    pass: EMAIL_CONFIG.appPassword
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ── Send Email Notification ──
async function sendEmailNotification(subject, htmlBody) {
  try {
    const mailOptions = {
      from: `"💖 Valentine Bot" <${EMAIL_CONFIG.from}>`,
      to: EMAIL_CONFIG.to,
      subject: subject,
      html: htmlBody
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`   📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  Email failed: ${error.message}`);
    console.log('   💡 Tip: Set your Gmail App Password in server.js (line 24)');
    return false;
  }
}

// ── Initialize data file if not exists ──
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    responses: [],
    noAttempts: [],
    pageVisits: [],
    hugs: [],
    kisses: [],
    notifications: []
  }, null, 2));
}

// ── Read data from file ──
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { responses: [], noAttempts: [], pageVisits: [], hugs: [], kisses: [], notifications: [] };
  }
}

// ── Write data to file ──
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── Log notification to console, file & EMAIL ──
function sendNotification(type, message, details) {
  const timestamp = new Date().toISOString();
  const notification = { type, message, details, timestamp };
  const timeStr = new Date(timestamp).toLocaleString();

  // Console notification with colors & emojis
  console.log('\n' + '═'.repeat(60));

  let emailSubject = '';
  let emailBody = '';

  switch (type) {
    case 'YES_RESPONSE':
      console.log('🎉💖 NOTIFICATION: YES CLICKED! 💖🎉');
      console.log(`   ❤️  ${message}`);
      console.log(`   📊 NO attempts before YES: ${details.noAttempts || 0}`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = '🎉💖 Aditi Said YES! She is Your Valentine!';
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #ffecd2, #fcb69f); padding: 40px; border-radius: 20px;">
          <h1 style="color: #e84393; text-align: center; font-size: 2rem;">🎉 Aditi Said YES! 💖</h1>
          <p style="color: #5a3045; font-size: 1.1rem; text-align: center; line-height: 1.8;">
            She clicked <strong style="color: #e84393;">YES</strong> to being your Valentine!<br>
            Your heart just won! ❤️
          </p>
          <div style="background: white; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #6b4a5a; margin: 5px 0;">😜 <strong>NO attempts before saying YES:</strong> ${details.noAttempts || 0}</p>
            <p style="color: #6b4a5a; margin: 5px 0;">🕐 <strong>Time:</strong> ${timeStr}</p>
            <p style="color: #6b4a5a; margin: 5px 0;">📄 <strong>Page:</strong> ${details.day || 'Proposal'}</p>
          </div>
          <p style="text-align: center; color: #e84393; font-size: 1.3rem;">💕 Congratulations! She's yours! 💕</p>
        </div>`;
      break;

    case 'NO_ATTEMPT':
      console.log('😜 NOTIFICATION: NO Button Attempt!');
      console.log(`   🔢 Attempt #${details.attemptNumber}`);
      console.log(`   💬 She tried to click NO! (but she can\'t 😉)`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = `😜 Aditi Tried to Click NO! (Attempt #${details.attemptNumber})`;
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #f6d5f7, #fbe9d7); padding: 40px; border-radius: 20px;">
          <h1 style="color: #e84393; text-align: center;">😜 NO Attempt Detected!</h1>
          <p style="color: #5a3045; font-size: 1.1rem; text-align: center; line-height: 1.8;">
            Aditi tried to click the <strong>NO</strong> button... but she can't escape love! 💘
          </p>
          <div style="background: white; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 2rem;">😂</p>
            <p style="color: #6b4a5a;"><strong>Attempt Number:</strong> #${details.attemptNumber}</p>
            <p style="color: #6b4a5a;"><strong>Time:</strong> ${timeStr}</p>
          </div>
          <p style="text-align: center; color: #6b4a5a;">The button ran away from her 😉💕</p>
        </div>`;
      break;

    case 'PAGE_VISIT':
      console.log(`📄 PAGE VISIT: ${details.day}`);
      console.log(`   👤 ${details.name} visited ${details.day}`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = `📄 Aditi Opened: ${details.day}`;
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #e8d5f5, #fce4ec); padding: 40px; border-radius: 20px;">
          <h1 style="color: #6c5ce7; text-align: center;">📄 Page Visited!</h1>
          <div style="background: white; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 1.1rem; color: #5a3045;"><strong>${details.name || 'Aditi'}</strong> opened <strong>${details.day}</strong></p>
            <p style="color: #6b4a5a;">🕐 ${timeStr}</p>
          </div>
          <p style="text-align: center; color: #6b4a5a;">She's exploring your Valentine surprises! 💖</p>
        </div>`;
      break;

    case 'HUG_SENT':
      console.log('🤗 NOTIFICATION: Virtual Hug Sent!');
      console.log(`   🤗 Hug #${details.hugCount}`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = `🤗 Aditi Sent Virtual Hug #${details.hugCount}!`;
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #e8eaf6, #fce4ec); padding: 40px; border-radius: 20px;">
          <h1 style="color: #e84393; text-align: center;">🤗 Virtual Hug Received!</h1>
          <p style="text-align: center; font-size: 3rem;">🤗💖</p>
          <div style="background: white; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #5a3045; font-size: 1.1rem;">Hug Count: <strong>#${details.hugCount}</strong></p>
            <p style="color: #6b4a5a;">🕐 ${timeStr}</p>
          </div>
        </div>`;
      break;

    case 'KISS_SENT':
      console.log('💋 NOTIFICATION: Virtual Kiss Sent!');
      console.log(`   💋 Kiss #${details.kissCount}`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = `💋 Aditi Sent Virtual Kiss #${details.kissCount}!`;
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #fce4ec, #f8bbd0); padding: 40px; border-radius: 20px;">
          <h1 style="color: #e84393; text-align: center;">💋 Virtual Kiss Received!</h1>
          <p style="text-align: center; font-size: 3rem;">💋💖</p>
          <div style="background: white; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #5a3045; font-size: 1.1rem;">Kiss Count: <strong>#${details.kissCount}</strong></p>
            <p style="color: #6b4a5a;">🕐 ${timeStr}</p>
          </div>
        </div>`;
      break;

    case 'FOREVER':
      console.log('💍🎊 NOTIFICATION: FOREVER YOURS CLICKED! 🎊💍');
      console.log(`   ❤️  ${message}`);
      console.log(`   🕐 Time: ${timeStr}`);
      emailSubject = '💍 Aditi Clicked "Forever Yours"! True Love Wins! ❤️';
      emailBody = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; background: linear-gradient(135deg, #ff6b9d, #e84393); padding: 40px; border-radius: 20px;">
          <h1 style="color: white; text-align: center; font-size: 2rem;">💍 Forever Yours! 💍</h1>
          <p style="color: white; font-size: 1.2rem; text-align: center; line-height: 1.8;">
            Aditi clicked <strong>"Forever Yours"</strong> on Valentine's Day!<br>
            This is it. True love wins! 🎊❤️
          </p>
          <div style="background: rgba(255,255,255,0.9); border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 2rem;">💖💍💖</p>
            <p style="color: #5a3045;">🕐 ${timeStr}</p>
          </div>
          <p style="text-align: center; color: white; font-size: 1.2rem;">She's yours, forever and always 💕</p>
        </div>`;
      break;

    default:
      console.log(`📬 NOTIFICATION: ${message}`);
      emailSubject = `💖 Valentine Notification: ${type}`;
      emailBody = `<p>${message}</p>`;
  }

  console.log('═'.repeat(60));

  // Save notification to data
  const data = readData();
  data.notifications.push(notification);
  writeData(data);

  // Append to log file
  const logLine = `[${timestamp}] [${type}] ${message} | ${JSON.stringify(details)}\n`;
  fs.appendFileSync(LOG_FILE, logLine);

  // 📧 Send email notification
  if (emailSubject && emailBody) {
    sendEmailNotification(emailSubject, emailBody);
  }
}

// ── CORS Headers ──
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Parse JSON body ──
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// ── Serve static files (frontend) ──
function serveStaticFile(filePath, res) {
  const extMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  const ext = path.extname(filePath).toLowerCase();
  const contentType = extMap[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// ── Create HTTP Server ──
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  setCorsHeaders(res);

  // ═══════════════ API ROUTES ═══════════════

  // POST /api/response — Save YES response + send notification
  if (pathname === '/api/response' && req.method === 'POST') {
    const body = await parseBody(req);
    const data = readData();

    const entry = {
      id: Date.now(),
      name: body.name || 'Aditi',
      day: body.day || 'proposal',
      response: body.response || 'YES',
      noAttempts: body.noAttempts || 0,
      timestamp: body.timestamp || new Date().toISOString()
    };

    data.responses.push(entry);
    writeData(data);

    // 🔔 Send notification!
    if (body.response === 'YES') {
      sendNotification('YES_RESPONSE',
        `🎉 Aditi clicked YES! She said YES to being your Valentine! 💖`,
        { noAttempts: body.noAttempts, day: body.day }
      );
    } else if (body.response === 'FOREVER') {
      sendNotification('FOREVER',
        `💍 Aditi clicked "Forever Yours"! True love wins! ❤️`,
        { day: body.day }
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: '💖 Response saved! Notification sent!',
      data: entry
    }));
    return;
  }

  // POST /api/no-attempt — Track NO button attempts
  if (pathname === '/api/no-attempt' && req.method === 'POST') {
    const body = await parseBody(req);
    const data = readData();

    const attempt = {
      id: Date.now(),
      name: body.name || 'Aditi',
      action: 'NO_ATTEMPT',
      attemptNumber: body.attemptNumber || 1,
      timestamp: body.timestamp || new Date().toISOString()
    };

    data.noAttempts.push(attempt);
    writeData(data);

    // 🔔 Send notification for NO attempt
    sendNotification('NO_ATTEMPT',
      `😜 Aditi tried to click NO (attempt #${body.attemptNumber})!`,
      { attemptNumber: body.attemptNumber }
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `😜 NO attempt #${body.attemptNumber} recorded!`,
      totalAttempts: data.noAttempts.length
    }));
    return;
  }

  // POST /api/page-visit — Track page visits
  if (pathname === '/api/page-visit' && req.method === 'POST') {
    const body = await parseBody(req);
    const data = readData();

    const visit = {
      id: Date.now(),
      name: body.name || 'Aditi',
      day: body.day,
      timestamp: body.timestamp || new Date().toISOString()
    };

    data.pageVisits.push(visit);
    writeData(data);

    // 🔔 Notification for page visit
    sendNotification('PAGE_VISIT',
      `📄 Aditi opened ${body.day}!`,
      { name: body.name, day: body.day }
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Page visit tracked!' }));
    return;
  }

  // POST /api/hug — Track virtual hugs
  if (pathname === '/api/hug' && req.method === 'POST') {
    const body = await parseBody(req);
    const data = readData();

    data.hugs.push({
      id: Date.now(),
      name: body.name,
      hugCount: body.hugCount,
      timestamp: body.timestamp || new Date().toISOString()
    });
    writeData(data);

    sendNotification('HUG_SENT',
      `🤗 Virtual hug #${body.hugCount} sent!`,
      { hugCount: body.hugCount }
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: '🤗 Hug sent!' }));
    return;
  }

  // POST /api/kiss — Track virtual kisses
  if (pathname === '/api/kiss' && req.method === 'POST') {
    const body = await parseBody(req);
    const data = readData();

    data.kisses.push({
      id: Date.now(),
      name: body.name,
      kissCount: body.kissCount,
      timestamp: body.timestamp || new Date().toISOString()
    });
    writeData(data);

    sendNotification('KISS_SENT',
      `💋 Virtual kiss #${body.kissCount} sent!`,
      { kissCount: body.kissCount }
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: '💋 Kiss sent!' }));
    return;
  }

  // GET /api/stats — Get all statistics
  if (pathname === '/api/stats' && req.method === 'GET') {
    const data = readData();

    const stats = {
      totalResponses: data.responses.length,
      totalNoAttempts: data.noAttempts.length,
      totalPageVisits: data.pageVisits.length,
      totalHugs: data.hugs.length,
      totalKisses: data.kisses.length,
      totalNotifications: data.notifications.length,
      lastResponse: data.responses[data.responses.length - 1] || null,
      lastNoAttempt: data.noAttempts[data.noAttempts.length - 1] || null,
      recentNotifications: data.notifications.slice(-10).reverse()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, stats }));
    return;
  }

  // GET /api/notifications — Get all notifications (live feed)
  if (pathname === '/api/notifications' && req.method === 'GET') {
    const data = readData();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: data.notifications.length,
      notifications: data.notifications.reverse()
    }));
    return;
  }

  // ═══════════════ STATIC FILES ═══════════════
  // Serve frontend files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  const rootDir = path.join(__dirname, '..');
  const fullPath = path.join(rootDir, filePath);

  // Security: prevent path traversal
  if (!fullPath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  serveStaticFile(fullPath, res);
});

// ── Start Server ──
server.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log('💖 VALENTINE WEEK SERVER STARTED 💖');
  console.log('═'.repeat(60));
  console.log(`\n🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, '..')}`);
  console.log(`💾 Data file: ${DATA_FILE}`);
  console.log(`📋 Log file: ${LOG_FILE}`);
  console.log('\n📡 API Endpoints:');
  console.log('   POST /api/response     — Save YES response + notification');
  console.log('   POST /api/no-attempt   — Track NO button attempts');
  console.log('   POST /api/page-visit   — Track page visits');
  console.log('   POST /api/hug          — Track virtual hugs');
  console.log('   POST /api/kiss         — Track virtual kisses');
  console.log('   GET  /api/stats        — Get all statistics');
  console.log('   GET  /api/notifications — Get notification feed');
  console.log('\n🔔 Waiting for Aditi\'s response...\n');
  console.log('═'.repeat(60) + '\n');
});
