import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { VerificationEmail } from '@/emails/verification';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const userName = searchParams.get('userName');
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    const verificationUrl = searchParams.get('verificationUrl');

    // Render the email template to HTML
    const html = await render(
      VerificationEmail({
        email: email || undefined,
        userName: userName || undefined,
        userId: userId || undefined,
        token: token || undefined,
        verificationUrl: verificationUrl || undefined,
      })
    );

    // Return HTML
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error rendering verification email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Render the email template to HTML
    const html = await render(
      VerificationEmail({
        email: body.email,
        userName: body.userName,
        userId: body.userId,
        token: body.token,
        verificationUrl: body.verificationUrl,
      })
    );

    // Return HTML
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error rendering verification email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}
