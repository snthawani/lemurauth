import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST() {
  try {
    console.log("sample")
    /*
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const link = `${process.env.BASE_URL}/auth/verify?id=dummyId&token=dummyToken`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER!, // Must be verified in SendGrid
      subject: 'Test Login Link',
      text: `Login here: ${link}`,
      html: `<p>Click to login: <a href="${link}">${link}</a></p>`,
    };

    await sgMail.send(msg);
    console.log('✅ Email sent to', email);
*/
    return NextResponse.json({ message: `Login link sent` });
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
