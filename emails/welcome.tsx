import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  userFirstname = 'there',
  loginUrl = 'https://app.example.com/signin',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Streamlined Property Portal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Streamlined Property Portal!</Heading>
        <Text style={text}>Hi {userFirstname},</Text>
        <Text style={text}>
          Thank you for signing up for Streamlined Property Portal. We're excited to have you on board!
        </Text>
        <Text style={text}>
          Your account has been successfully created. You can now access all the features of our platform.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={loginUrl}>
            Get Started
          </Button>
        </Section>
        <Text style={text}>
          If you have any questions, feel free to reach out to our support team.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '32px 24px 0',
};
