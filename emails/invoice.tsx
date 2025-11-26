import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface InvoiceEmailProps {
  tenantName?: string;
  propertyAddress?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  amount?: string;
  items?: Array<{
    description: string;
    amount: string;
  }>;
  paymentUrl?: string;
}

export const InvoiceEmail = ({
  tenantName = 'Tenant',
  propertyAddress = '123 Main Street, Apt 4B',
  invoiceNumber = 'INV-001',
  invoiceDate = new Date().toLocaleDateString(),
  dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  amount = '$1,500.00',
  items = [
    { description: 'Monthly Rent', amount: '$1,500.00' }
  ],
  paymentUrl = 'https://app.example.com/payments',
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice {invoiceNumber} - {amount} due</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Invoice</Heading>
        
        <Section style={infoSection}>
          <Row>
            <Column>
              <Text style={label}>Bill To:</Text>
              <Text style={text}>{tenantName}</Text>
              <Text style={text}>{propertyAddress}</Text>
            </Column>
            <Column align="right">
              <Text style={label}>Invoice #: {invoiceNumber}</Text>
              <Text style={text}>Date: {invoiceDate}</Text>
              <Text style={text}>Due: {dueDate}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={divider} />

        <Section style={itemsSection}>
          <Text style={label}>Invoice Items</Text>
          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={itemText}>{item.description}</Text>
              </Column>
              <Column align="right">
                <Text style={itemText}>{item.amount}</Text>
              </Column>
            </Row>
          ))}
          
          <Hr style={divider} />
          
          <Row style={totalRow}>
            <Column>
              <Text style={totalLabel}>Total Due:</Text>
            </Column>
            <Column align="right">
              <Text style={totalAmount}>{amount}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={paymentUrl}>
            Pay Now
          </Button>
        </Section>

        <Text style={footerText}>
          Please make payment by {dueDate}. If you have any questions, please contact us.
        </Text>

        <Text style={footer}>
          © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvoiceEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 24px 20px',
  padding: '0',
};

const infoSection = {
  padding: '0 24px',
  marginBottom: '24px',
};

const label = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const divider = {
  borderColor: '#e6e6e6',
  margin: '20px 24px',
};

const itemsSection = {
  padding: '0 24px',
};

const itemRow = {
  marginBottom: '8px',
};

const itemText = {
  color: '#333',
  fontSize: '14px',
  margin: '4px 0',
};

const totalRow = {
  marginTop: '16px',
};

const totalLabel = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const totalAmount = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
  margin: '0 auto',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '24px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '32px 24px 0',
};
