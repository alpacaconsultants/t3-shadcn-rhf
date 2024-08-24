/* eslint-disable react/no-unescaped-entities */
import React, { type FC, type CSSProperties } from 'react';
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Text } from '@react-email/components';

const WelcomeEmail: FC = () => (
  <Html>
    <Head>
      <title>Welcome to Stirxy - Survey Processing Confirmation</title>
    </Head>
    <Preview>Stirxy: Your survey is being processed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Stirxy</Heading>
        <Text style={text}>Thank you for using our survey service. We've received your survey and are currently processing it.</Text>

        <Heading as='h2' style={h2}>
          What's Next?
        </Heading>
        <Text style={text}>
          We are carefully analyzing your survey data. We'll notify you via email once the results are ready for your review.
        </Text>

        {/* <Section style={buttonContainer}>
          <Link href='https://stirxy.com/dashboard' style={button}>
            View Your Dashboard
          </Link>
        </Section> */}

        <Text style={text}>If you have any questions or need assistance, please contact our support team at support@stirxy.com.</Text>

        <Hr style={hr} />

        <Text style={footer}>
          © 2023 Stirxy. All rights reserved.
          <br />
          123 Business St., City, State 12345
          <br />
          <Link href='https://stirxy.com/privacy' style={link}>
            Privacy Policy
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
} satisfies CSSProperties;

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
} satisfies CSSProperties;

const h1 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '30px 0',
} satisfies CSSProperties;

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'left',
  margin: '30px 0 15px',
} satisfies CSSProperties;

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left',
} satisfies CSSProperties;

const buttonContainer = {
  margin: '30px 0',
} satisfies CSSProperties;

const button = {
  backgroundColor: '#4CAF50',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
} satisfies CSSProperties;

const link = {
  color: '#4CAF50',
  textDecoration: 'underline',
} satisfies CSSProperties;

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
} satisfies CSSProperties;

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center',
} satisfies CSSProperties;
