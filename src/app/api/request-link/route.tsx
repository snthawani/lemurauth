import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import crypto from 'crypto';
import { dbConnect } from '../../../lib/mongo';
import { User } from '../../../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
console.log('eee')
const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  try {
    let userForId;

    const body = await req.json();
    const { method, value } = body;

    if (!method || !value) {
      return NextResponse.json({ error: 'Missing method or value' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    try {
      console.log("test")
      await dbConnect();
      let query = method === 'email' ? { email: value } : { phone: value };
      const existingUser = await User.findOne(query);
      if (existingUser) {
        existingUser.token = token;
        await existingUser.save();
      } else {
        let email = '';
        let phone = '';
        if (method === 'email') {
          email = value;
        } else {
          phone = value;
        }
        const newUser = new User({
          email,
          phone,
          token,
        });

        await newUser.save();
      }

      userForId = await User.findOne(query) || null;

    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error creating user', error });
    }

    const link = `${process.env.BASE_URL}/auth/verify?id=${userForId._id}&token=${token}`;
    console.log(link) // for testing purposes
    if (method === 'email') {
      console.log('sending email')
      const msg = {
        to: value,
        from: process.env.SENDGRID_VERIFIED_SENDER!,
        subject: 'Your Passwordless Login Link',
        text: `Login here: ${link}`,
        html: `<p>Click to login: <a href="${link}">${link}</a></p>`,
      };
      await sgMail.send(msg);
      console.log('sent email')
    } else if (method === 'phone') {
      await twilioClient.messages.create({
        body: `Your passwordless login link: ${link}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: value,
      });
    } else {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }

    return NextResponse.json({ message: `Login link sent to ${value}` });
  } catch (err) {
    console.log(err)
    console.log('this errro')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

