const RecaptchaV2 = require('express-recaptcha').RecaptchaV2;

// Initialize reCAPTCHA
const recaptcha = new RecaptchaV2(
  process.env.RECAPTCHA_SITE_KEY || 'test-site-key',
  process.env.RECAPTCHA_SECRET_KEY || 'test-secret-key'
);

// Simple CAPTCHA implementation for development
const generateSimpleCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
  }
  
  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString()
  };
};

// Store CAPTCHA challenges in memory (use Redis in production)
const captchaChallenges = new Map();

const requireCaptcha = (req, res, next) => {
  // Skip CAPTCHA in test environment
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  
  // Check if user has failed login attempts
  const clientIP = req.ip || req.connection.remoteAddress;
  const failedAttempts = req.session.failedAttempts || 0;
  
  // Require CAPTCHA after 3 failed attempts
  if (failedAttempts >= 3) {
    const { captchaAnswer, captchaId } = req.body;
    
    if (!captchaAnswer || !captchaId) {
      // Generate new CAPTCHA
      const captcha = generateSimpleCaptcha();
      const captchaId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      captchaChallenges.set(captchaId, {
        answer: captcha.answer,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      });
      
      return res.status(400).json({
        error: 'CAPTCHA required',
        captcha: {
          id: captchaId,
          question: captcha.question
        },
        code: 'CAPTCHA_REQUIRED'
      });
    }
    
    // Verify CAPTCHA
    const storedCaptcha = captchaChallenges.get(captchaId);
    if (!storedCaptcha || storedCaptcha.expires < Date.now()) {
      return res.status(400).json({
        error: 'CAPTCHA expired',
        code: 'CAPTCHA_EXPIRED'
      });
    }
    
    if (storedCaptcha.answer !== captchaAnswer.toString()) {
      return res.status(400).json({
        error: 'Invalid CAPTCHA',
        code: 'CAPTCHA_INVALID'
      });
    }
    
    // CAPTCHA verified, remove from storage
    captchaChallenges.delete(captchaId);
  }
  
  next();
};

// Cleanup expired CAPTCHAs
setInterval(() => {
  const now = Date.now();
  for (const [id, captcha] of captchaChallenges.entries()) {
    if (captcha.expires < now) {
      captchaChallenges.delete(id);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

module.exports = {
  recaptcha,
  requireCaptcha,
  generateSimpleCaptcha
};