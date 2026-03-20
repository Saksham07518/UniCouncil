import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS setup for preflight requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to specific domains
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP in request body' });
  }

  // Validate environment variables exactly as expected
  const gmailUser = process.env.VITE_GMAIL_USER || process.env.GMAIL_USER;
  const gmailPass = process.env.VITE_GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return res.status(500).json({ 
      error: 'Gmail credentials (GMAIL_USER and GMAIL_APP_PASSWORD) are not configured in Vercel Environment Variables' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `"UniCouncil Election" <${gmailUser}>`,
      to: email,
      subject: 'Your Voting Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; border-top: 6px solid #4F46E5;">
          <h2 style="color: #111827; margin-bottom: 24px;">UniCouncil Identity Verification</h2>
          <p style="color: #4B5563; line-height: 1.6;">Hello,</p>
          <p style="color: #4B5563; line-height: 1.6;">
            We received a request to cast a vote for the <strong>UniCouncil Student Council Election 2026</strong>. 
            To ensure the integrity of the election, please verify your email address.
          </p>
          
          <div style="background-color: #F3F4F6; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 0;">Your Verification Code</p>
            <h1 style="font-size: 42px; margin: 0; letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
          </div>
          
          <p style="color: #DC2626; font-size: 14px; font-weight: bold;">Do not share this code with anyone.</p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
            If you did not request this verification, please ignore this email. Your vote cannot be cast without this code.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Automated message from UniCouncil Election System. Do not reply to this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Email dispatched successfully' });
  } catch (err) {
    console.error('Email dispatch error:', err);
    return res.status(500).json({ error: err.message || 'Failed to dispatch email' });
  }
}
