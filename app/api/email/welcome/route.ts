import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/emails/welcome';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userFirstname = searchParams.get('userFirstname');
    const loginUrl = searchParams.get('loginUrl');

    // Render the email template to HTML
    const html = await render(
      WelcomeEmail({
        userFirstname: userFirstname || undefined,
        loginUrl: loginUrl || undefined,
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
    console.error('Error rendering welcome email:', error);
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
      WelcomeEmail({
        userFirstname: body.userFirstname,
        loginUrl: body.loginUrl,
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
    console.error('Error rendering welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}
