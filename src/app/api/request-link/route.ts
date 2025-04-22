import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import crypto from 'crypto';
import { dbConnect } from '../../../lib/mongo';
import { User } from '../../../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, value } = body;

    if (!method || !value) {
      return NextResponse.json({ error: 'Missing method or value' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const query = method === 'email' ? { email: value } : { phone: value };

    await dbConnect();

    let user = await User.findOne(query);
    if (user) {
      user.token = token;
      await user.save();
    } else {
      user = new User({
        email: method === 'email' ? value : '',
        phone: method === 'phone' ? value : '',
        token,
      });
      await user.save();
    }

    const link = `${process.env.BASE_URL}/auth/verify?id=${user._id}&token=${token}`;

    // ✅ Respond to client early
    const response = NextResponse.json({ message: `Login link is being sent to ${value}` });

    // 🧵 Send email/SMS in the background
    setTimeout(async () => {
      try {
        if (method === 'email') {
          const msg = {
            to: value,
            from: process.env.SENDGRID_VERIFIED_SENDER!,
            subject: 'Your Passwordless Login Link',
            text: `Login here: ${link}`,
            html: `<p>Click to login: <a href="${link}">${link}</a></p>`,
          };
          await sgMail.send(msg);
          console.log('✅ Email sent');
        } else if (method === 'phone') {
          await twilioClient.messages.create({
            body: `Your passwordless login link: ${link}`,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: value,
          });
          console.log('✅ SMS sent');
        }
      } catch (sendError) {
        console.error('❌ Failed to send message:', sendError);
      }
    }, 0);

    return response;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
