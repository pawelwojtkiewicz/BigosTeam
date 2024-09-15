'use client'


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';

import { sendData } from './action'

export default function LoginScreen() {
  const formik = useFormik({
    initialValues: {
      identifier: 'supplier1',
      password: 'CercaTrova1!',
    },
    onSubmit: (values) => sendData(values),
  });
  
  return (
    <Box
      id="login-screen"
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiTextField-root': { width: '50ch' },
        }}
      >
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
          value={formik.values.identifier}
          onChange={formik.handleChange}

            required
            id="outlined-required"
            label="Username"
            variant="standard"
            fullWidth
            name="identifier"
          />
          <TextField
          value={formik.values.password}
          onChange={formik.handleChange}

            required
            id="outlined-disabled"
            label="Password"
            variant="standard"
            type="password"
            fullWidth 
            name="password"
          />
        </Stack>
        <Stack spacing={2} direction="row">
          <Button variant="contained">Register</Button>
          <Button type="submit" variant="contained">Log in</Button>
        </Stack>
      </Box>
    </Box>
  );
}
