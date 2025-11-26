import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { InvitationEmail } from '@/emails/invitation';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const inviterName = searchParams.get('inviterName');
    const organizationName = searchParams.get('organizationName');
    const invitationUrl = searchParams.get('invitationUrl');
    const role = searchParams.get('role');

    // Render the email template to HTML
    const html = await render(
      InvitationEmail({
        inviterName: inviterName || undefined,
        organizationName: organizationName || undefined,
        invitationUrl: invitationUrl || undefined,
        role: role || undefined,
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
    console.error('Error rendering invitation email:', error);
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
      InvitationEmail({
        inviterName: body.inviterName,
        organizationName: body.organizationName,
        invitationUrl: body.invitationUrl,
        role: body.role,
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
    console.error('Error rendering invitation email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}
