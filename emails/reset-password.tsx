import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordUrl?: string;
}

export const ResetPasswordEmail = ({
  userFirstname = 'there',
  resetPasswordUrl = 'https://app.example.com/reset-password?token=TOKEN',
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password for Streamlined Property Portal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>Hi {userFirstname},</Text>
        <Text style={text}>
          We received a request to reset your password for your Streamlined Property Portal
          account. Click the button below to choose a new password:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetPasswordUrl}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This link will expire in 1 hour for security reasons. If you didn't request a password
          reset, you can safely ignore this email.
        </Text>
        <Text style={text}>
          If you're having trouble clicking the button, you can copy and paste this link into your
          browser:
        </Text>
        <Text style={linkText}>{resetPasswordUrl}</Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

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
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
  margin: '16px 24px',
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

const linkText = {
  color: '#5469d4',
  fontSize: '14px',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
  margin: '16px 24px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '32px 24px 0',
};
