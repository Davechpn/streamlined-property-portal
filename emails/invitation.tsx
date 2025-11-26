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

interface InvitationEmailProps {
  inviterName?: string;
  organizationName?: string;
  invitationUrl?: string;
  role?: string;
}

export const InvitationEmail = ({
  inviterName = 'A team member',
  organizationName = 'the organization',
  invitationUrl = 'https://app.example.com/invitations/token',
  role = 'member',
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      You've been invited to join {organizationName} on Streamlined Property Portal
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're Invited!</Heading>
        <Text style={text}>
          {inviterName} has invited you to join <strong>{organizationName}</strong> as a{' '}
          <strong>{role}</strong> on Streamlined Property Portal.
        </Text>
        <Text style={text}>
          Click the button below to accept the invitation and get started:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={invitationUrl}>
            Accept Invitation
          </Button>
        </Section>
        <Text style={text}>
          This invitation link will expire in 7 days. If you weren't expecting this invitation,
          you can safely ignore this email.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

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
