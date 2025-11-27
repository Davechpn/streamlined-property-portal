import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  email?: string;
  userName?: string;
  userId?: string;
  token?: string;
  verificationUrl?: string;
}

export const VerificationEmail = ({
  email,
  userName = 'there',
  userId,
  token,
  verificationUrl,
}: VerificationEmailProps) => {
  // Build verification URL if not provided
  const finalVerificationUrl = verificationUrl || 
    `https://streamlined-properties.com/verify?email=${encodeURIComponent(email || '')}&userName=${encodeURIComponent(userName)}&userId=${encodeURIComponent(userId || '')}&token=${encodeURIComponent(token || '')}`;
  
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify Your Email Address</Heading>
          
          <Text style={text}>Hi {userName},</Text>
          
          <Text style={text}>
            Thank you for signing up! To complete your registration and start using your account, 
            please verify your email address by clicking the button below.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={finalVerificationUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={textSmall}>
            Or copy and paste this URL into your browser:
          </Text>
          
          <Text style={linkText}>
            <Link href={finalVerificationUrl} style={link}>
              {finalVerificationUrl}
            </Link>
          </Text>

          <Hr style={hr} />

          <Text style={textSmall}>
            This verification link will expire in 24 hours.
          </Text>

          <Text style={textSmall}>
            If you didn't create an account, you can safely ignore this email.
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 48px',
};

const textSmall = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  padding: '0 48px',
};

const linkText = {
  color: '#2563eb',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  padding: '0 48px',
  wordBreak: 'break-all' as const,
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const buttonContainer = {
  padding: '27px 48px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: 'auto',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
  marginLeft: '48px',
  marginRight: '48px',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0',
  padding: '0 48px',
  textAlign: 'center' as const,
};

export default VerificationEmail;
