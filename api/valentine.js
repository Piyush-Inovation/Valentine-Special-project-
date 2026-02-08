/* ═══════════════════════════════════════════════════
   💖 VALENTINE WEEK — Vercel Serverless API
   Handles ALL API routes: /api/valentine
   ═══════════════════════════════════════════════════ */

const nodemailer = require('nodemailer');

// ── Email Configuration (from Environment Variables) ──
const EMAIL_CONFIG = {
  to: process.env.EMAIL_TO || 'piyush.bramhankar027@gmail.com',
  from: process.env.EMAIL_FROM || 'piyush.bramhankar027@gmail.com',
  appPassword: process.env.EMAIL_APP_PASSWORD || 'wunf etfr hjpg tusc'
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

// ── Send Email ──
async function sendEmail(subject, htmlBody) {
  try {
    const info = await transporter.sendMail({
      from: `"💖 Valentine Bot" <${EMAIL_CONFIG.from}>`,
      to: EMAIL_CONFIG.to,
      subject,
      html: htmlBody
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.log(`⚠️ Email failed: ${error.message}`);
    return false;
  }
}

// ── Build Email HTML ──
function buildEmailHTML(type, details) {
  const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const templates = {
    YES_RESPONSE: {
      subject: '🎉💖 Aditi Said YES! She is Your Valentine!',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#ffecd2,#fcb69f);padding:40px;border-radius:20px;">
          <h1 style="color:#e84393;text-align:center;font-size:2rem;">🎉 Aditi Said YES! 💖</h1>
          <p style="color:#5a3045;font-size:1.1rem;text-align:center;line-height:1.8;">
            She clicked <strong style="color:#e84393;">YES</strong> to being your Valentine!
          </p>
          <div style="background:white;border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#6b4a5a;margin:5px 0;">😜 <strong>NO attempts before YES:</strong> ${details.noAttempts || 0}</p>
            <p style="color:#6b4a5a;margin:5px 0;">🕐 <strong>Time:</strong> ${timeStr}</p>
            <p style="color:#6b4a5a;margin:5px 0;">📄 <strong>Page:</strong> ${details.day || 'Proposal'}</p>
          </div>
          <p style="text-align:center;color:#e84393;font-size:1.3rem;">💕 Congratulations! She's yours! 💕</p>
        </div>`
    },
    NO_ATTEMPT: {
      subject: `😜 Aditi Tried to Click NO! (Attempt #${details.attemptNumber || '?'})`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#f6d5f7,#fbe9d7);padding:40px;border-radius:20px;">
          <h1 style="color:#e84393;text-align:center;">😜 NO Attempt Detected!</h1>
          <p style="color:#5a3045;font-size:1.1rem;text-align:center;line-height:1.8;">
            Aditi tried to click <strong>NO</strong>... but she can't escape love! 💘
          </p>
          <div style="background:white;border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="font-size:2rem;">😂</p>
            <p style="color:#6b4a5a;"><strong>Attempt #${details.attemptNumber || '?'}</strong></p>
            <p style="color:#6b4a5a;">🕐 ${timeStr}</p>
          </div>
          <p style="text-align:center;color:#6b4a5a;">The button ran away from her 😉💕</p>
        </div>`
    },
    PAGE_VISIT: {
      subject: `📄 Aditi Opened: ${details.day || 'a page'}`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#e8d5f5,#fce4ec);padding:40px;border-radius:20px;">
          <h1 style="color:#6c5ce7;text-align:center;">📄 Page Visited!</h1>
          <div style="background:white;border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="font-size:1.1rem;color:#5a3045;"><strong>${details.name || 'Aditi'}</strong> opened <strong>${details.day}</strong></p>
            <p style="color:#6b4a5a;">🕐 ${timeStr}</p>
          </div>
          <p style="text-align:center;color:#6b4a5a;">She's exploring your Valentine surprises! 💖</p>
        </div>`
    },
    HUG_SENT: {
      subject: `🤗 Aditi Sent Virtual Hug #${details.hugCount || '?'}!`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#e8eaf6,#fce4ec);padding:40px;border-radius:20px;">
          <h1 style="color:#e84393;text-align:center;">🤗 Virtual Hug Received!</h1>
          <p style="text-align:center;font-size:3rem;">🤗💖</p>
          <div style="background:white;border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#5a3045;font-size:1.1rem;">Hug Count: <strong>#${details.hugCount}</strong></p>
            <p style="color:#6b4a5a;">🕐 ${timeStr}</p>
          </div>
        </div>`
    },
    KISS_SENT: {
      subject: `💋 Aditi Sent Virtual Kiss #${details.kissCount || '?'}!`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#fce4ec,#f8bbd0);padding:40px;border-radius:20px;">
          <h1 style="color:#e84393;text-align:center;">💋 Virtual Kiss Received!</h1>
          <p style="text-align:center;font-size:3rem;">💋💖</p>
          <div style="background:white;border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#5a3045;font-size:1.1rem;">Kiss Count: <strong>#${details.kissCount}</strong></p>
            <p style="color:#6b4a5a;">🕐 ${timeStr}</p>
          </div>
        </div>`
    },
    FOREVER: {
      subject: '💍 Aditi Clicked "Forever Yours"! True Love Wins! ❤️',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#ff6b9d,#e84393);padding:40px;border-radius:20px;">
          <h1 style="color:white;text-align:center;font-size:2rem;">💍 Forever Yours! 💍</h1>
          <p style="color:white;font-size:1.2rem;text-align:center;line-height:1.8;">
            Aditi clicked <strong>"Forever Yours"</strong> on Valentine's Day! 🎊❤️
          </p>
          <div style="background:rgba(255,255,255,0.9);border-radius:15px;padding:20px;margin:20px 0;text-align:center;">
            <p style="font-size:2rem;">💖💍💖</p>
            <p style="color:#5a3045;">🕐 ${timeStr}</p>
          </div>
          <p style="text-align:center;color:white;font-size:1.2rem;">She's yours, forever and always 💕</p>
        </div>`
    }
  };

  return templates[type] || { subject: `💖 Valentine: ${type}`, html: `<p>${JSON.stringify(details)}</p>` };
}

// ═════════════════════════════════════════════
//  MAIN HANDLER — Vercel Serverless Function
// ═════════════════════════════════════════════
module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Extract the action from the URL: /api/valentine?action=response
  const action = req.query.action || '';
  const body = req.body || {};

  try {
    switch (action) {

      // ── YES Response ──
      case 'response': {
        const type = body.response === 'FOREVER' ? 'FOREVER' : 'YES_RESPONSE';
        const email = buildEmailHTML(type, body);
        const emailSent = await sendEmail(email.subject, email.html);

        return res.status(200).json({
          success: true,
          message: '💖 Response saved! Notification sent!',
          emailSent,
          data: { name: body.name, day: body.day, response: body.response, noAttempts: body.noAttempts, timestamp: new Date().toISOString() }
        });
      }

      // ── NO Attempt ──
      case 'no-attempt': {
        const email = buildEmailHTML('NO_ATTEMPT', body);
        const emailSent = await sendEmail(email.subject, email.html);

        return res.status(200).json({
          success: true,
          message: `😜 NO attempt #${body.attemptNumber} recorded!`,
          emailSent
        });
      }

      // ── Page Visit ──
      case 'page-visit': {
        const email = buildEmailHTML('PAGE_VISIT', body);
        const emailSent = await sendEmail(email.subject, email.html);

        return res.status(200).json({
          success: true,
          message: 'Page visit tracked!',
          emailSent
        });
      }

      // ── Hug ──
      case 'hug': {
        const email = buildEmailHTML('HUG_SENT', body);
        const emailSent = await sendEmail(email.subject, email.html);

        return res.status(200).json({ success: true, message: '🤗 Hug sent!', emailSent });
      }

      // ── Kiss ──
      case 'kiss': {
        const email = buildEmailHTML('KISS_SENT', body);
        const emailSent = await sendEmail(email.subject, email.html);

        return res.status(200).json({ success: true, message: '💋 Kiss sent!', emailSent });
      }

      // ── Health Check ──
      case 'health': {
        return res.status(200).json({ success: true, message: '💖 Valentine API is alive!', time: new Date().toISOString() });
      }

      default:
        return res.status(400).json({ error: 'Unknown action. Use: response, no-attempt, page-visit, hug, kiss, health' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
