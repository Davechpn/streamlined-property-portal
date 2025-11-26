import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { ResetPasswordEmail } from '@/emails/reset-password';

export async function GET(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.EMAIL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userFirstname = searchParams.get('userFirstname');
    const resetPasswordUrl = searchParams.get('resetPasswordUrl');

    // Render the email template to HTML
    const html = await render(
      ResetPasswordEmail({
        userFirstname: userFirstname || undefined,
        resetPasswordUrl: resetPasswordUrl || undefined,
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
    console.error('Error rendering reset password email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.EMAIL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Render the email template to HTML
    const html = await render(
      ResetPasswordEmail({
        userFirstname: body.userFirstname,
        resetPasswordUrl: body.resetPasswordUrl,
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
    console.error('Error rendering reset password email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}
