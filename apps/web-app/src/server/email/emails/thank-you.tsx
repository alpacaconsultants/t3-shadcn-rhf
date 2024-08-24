/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Body, Container, Column, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components';

const baseUrl = 'https://your-website.com';

export const StirxyWelcomeEmail = () => (
  <Html>
    <Head>
      <title>Welcome to Stirxy</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto');
      `}</style>
    </Head>
    <Preview>Welcome to Stirxy - Your survey is being processed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`${baseUrl}/static/stirxy-logo.png`} width='100' height='100' alt='Stirxy Logo' style={logo} />
        <Heading style={h1}>Welcome to Stirxy!</Heading>
        <Text style={text}>Thank you for trying our service. We're excited to have you on board!</Text>

        <Img src={`${baseUrl}/static/colorful-owl-logo.png`} width='200' height='200' alt='Colorful Owl Logo' style={owlLogo} />

        <Heading as='h2' style={h2}>
          We're Currently Processing Your Survey
        </Heading>
        <Text style={text}>Our team is hard at work analyzing your responses. We'll send you the results as soon as they're ready.</Text>

        <Section style={buttonContainer}>
          <Link href='https://stirxy.com/dashboard' style={button}>
            Check Your Dashboard
          </Link>
        </Section>

        <Text style={text}>If you have any questions, please don't hesitate to reach out to our support team.</Text>
        <Link href='mailto:support@stirxy.com' style={link}>
          support@stirxy.com
        </Link>

        <Hr style={hr} />

        <Row style={socialIcons}>
          <Column align='center'>
            <Link href='https://facebook.com/stirxy'>
              <Img src={`${baseUrl}/static/facebook-icon.png`} width='32' height='32' alt='Facebook' />
            </Link>
          </Column>
          <Column align='center'>
            <Link href='https://twitter.com/stirxy'>
              <Img src={`${baseUrl}/static/twitter-icon.png`} width='32' height='32' alt='Twitter' />
            </Link>
          </Column>
          <Column align='center'>
            <Link href='https://instagram.com/stirxy'>
              <Img src={`${baseUrl}/static/instagram-icon.png`} width='32' height='32' alt='Instagram' />
            </Link>
          </Column>
        </Row>

        <Text style={footer}>© 2023 Stirxy. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
);

export default StirxyWelcomeEmail;

const main = {
  backgroundColor: '#1a1a1a',
  fontFamily: 'Roboto, Helvetica, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const h2 = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const owlLogo = {
  margin: '30px auto',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#00ffcc',
  borderRadius: '25px',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#00ffcc',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#00ffcc',
  margin: '20px 0',
};

const socialIcons = {
  marginBottom: '32px',
  paddingLeft: '8px',
  paddingRight: '8px',
  width: '100%',
};

const footer = {
  color: '#ffffff',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
