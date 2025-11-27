import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { InvoiceEmail } from '@/emails/invoice';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    const tenantName = searchParams.get('tenantName');
    const propertyAddress = searchParams.get('propertyAddress');
    const invoiceNumber = searchParams.get('invoiceNumber');
    const invoiceDate = searchParams.get('invoiceDate');
    const dueDate = searchParams.get('dueDate');
    const amount = searchParams.get('amount');
    const paymentUrl = searchParams.get('paymentUrl');

    // Parse items if provided as JSON string
    let items;
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        items = JSON.parse(itemsParam);
      } catch (e) {
        // Use default items if parsing fails
        items = undefined;
      }
    }

    // Render the email template to HTML
    const html = await render(
      InvoiceEmail({
        tenantName: tenantName || undefined,
        propertyAddress: propertyAddress || undefined,
        invoiceNumber: invoiceNumber || undefined,
        invoiceDate: invoiceDate || undefined,
        dueDate: dueDate || undefined,
        amount: amount || undefined,
        items: items || undefined,
        paymentUrl: paymentUrl || undefined,
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
    console.error('Error rendering invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}

// POST endpoint for more complex data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Render the email template to HTML
    const html = await render(
      InvoiceEmail({
        tenantName: body.tenantName,
        propertyAddress: body.propertyAddress,
        invoiceNumber: body.invoiceNumber,
        invoiceDate: body.invoiceDate,
        dueDate: body.dueDate,
        amount: body.amount,
        items: body.items,
        paymentUrl: body.paymentUrl,
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
    console.error('Error rendering invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}
