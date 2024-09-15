'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import BlikSvg from '../../public/images/blik.svg'; // Adjust the path as necessary
import TextField from '@mui/material/TextField';
import { InputAdornment, Snackbar, Alert } from '@mui/material';
import { error } from 'console';

const Blik: React.FC = () => {
	const [amount, setAmount] = useState('');
	const [payMethodValue, setPayMethodValue] = useState('');
	const [error, setError] = useState('');
	const [open, setOpen] = useState(false);
  
	const handleClick = async () => {
	  try {
		const response = await fetch('http://localhost:1337/api/blik/makeDonation', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ amount, payMethodValue }),
		});
  
		if (!response.ok) {
		  throw new Error(`HTTP error! status: ${response.status}`);
		}
  
		const result = await response.json();
		console.log('Request successful', result);
	  } catch (error) {
		setError(error.message);
		setOpen(true);
	  }
	};
  
	const handleClose = () => {
	  setOpen(false);
	};

  return (
    <div style={{ width: '200px' }}>
      <h1>Darowizna</h1>
      <TextField
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Wprowadź kwotę"
        variant="outlined"
        fullWidth
        margin="normal"
        size="small"
        inputProps={{ maxLength: 6 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
        }}
      />
      <TextField
        type="text"
        value={payMethodValue}
        onChange={(e) => setPayMethodValue(e.target.value)}
        placeholder="Wprowadź kod BLIK"
        variant="outlined"
        fullWidth
        margin="normal"
        size="small"
        inputProps={{ maxLength: 6 }}
      />
      <Image src={BlikSvg} alt="Kliknij Mnie" onClick={handleClick} style={{ cursor: 'pointer' }} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Blik;