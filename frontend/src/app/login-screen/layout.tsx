import type { Metadata } from "next";
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to app",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="login-screen-layout">
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
          {children}
        </Box>
      </Container>
    </div>
  );
}
