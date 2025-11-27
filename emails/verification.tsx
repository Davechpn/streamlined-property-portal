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
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  userFirstname?: string;
  verificationUrl?: string;
}

export const VerificationEmail = ({
  userFirstname = 'there',
  verificationUrl = 'https://example.com/verify?token=abc123',
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Section className="bg-white rounded-lg shadow-lg p-8">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Verify Your Email Address
              </Heading>
              
              <Text className="text-gray-700 text-base mb-4">
                Hi {userFirstname},
              </Text>
              
              <Text className="text-gray-700 text-base mb-4">
                Thank you for signing up! To complete your registration and start using your account, 
                please verify your email address by clicking the button below.
              </Text>

              <Section className="text-center my-8">
                <Button
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700"
                  href={verificationUrl}
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-gray-600 text-sm mb-4">
                Or copy and paste this URL into your browser:
              </Text>
              
              <Text className="text-blue-600 text-sm break-all mb-6">
                <Link href={verificationUrl} className="text-blue-600 underline">
                  {verificationUrl}
                </Link>
              </Text>

              <Hr className="border-gray-300 my-6" />

              <Text className="text-gray-600 text-sm mb-2">
                This verification link will expire in 24 hours.
              </Text>

              <Text className="text-gray-600 text-sm">
                If you didn't create an account, you can safely ignore this email.
              </Text>
            </Section>

            <Section className="text-center mt-8">
              <Text className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Streamlined Property Portal. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
