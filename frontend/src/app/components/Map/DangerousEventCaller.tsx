'use client'

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useFormik } from 'formik';
import { sendInformationAboutNewDangerousEvent, getItemsForEventTypesSelect } from '@/app/login-screen/action'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const DangerousEventCaller: React.FC<> = ({ showEventMarkers, currentUserPosition, handleEventMarkers }) => {
    const [open, setOpen] = useState(false);
    const [selectTypes, setSelectTypes] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            summary: '',
            details: '',
            type: 4,
            lat: currentUserPosition[0],
            long: currentUserPosition[1],
        },
        onSubmit: (values) => sendInformationAboutNewDangerousEvent(values),
    });

    useEffect(() => {
        getItemsForEventTypesSelect()
        .then((res) => {
            const mappedSelectTypes = res.data.map(({ id, attributes: { name }}) => ({id, name}));
            console.log(mappedSelectTypes)
            setSelectTypes(mappedSelectTypes);
        });
    }, []);

    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Zgłoś zagrożenie na szlaku
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
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
                            value={formik.values.summary}
                            onChange={formik.handleChange}
                            id="outlined-required"
                            label="Krótki opis"
                            variant="standard"
                            fullWidth
                            name="summary"
                        />
                        <TextField
                            multiline
                            value={formik.values.details}
                            onChange={formik.handleChange}
                            required
                            id="outlined-required"
                            label="Szczegóły"
                            variant="standard"
                            fullWidth
                            name="details"
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Typ zgłoszenia</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formik.values.type}
                                label="Typ zgłoszenia"
                                onChange={formik.handleChange}
                                name="type"
                            >
                                {selectTypes.map(({id, name}) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Button type="submit" autoFocus onClick={handleClose}>
                        Zapisz ustawienia
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
            </DialogActions>
            </BootstrapDialog>
            <Stack
                spacing={2}
                direction="row"
                sx={{
                    position: 'fixed', 
                    bottom: 0,
                    zIndex: 9999
                }}>
                <Button 
                    onClick={handleClickOpen}
                    variant="contained">
                        Zgłoś zdarzenie
                </Button>
                <Button
                    onClick={handleEventMarkers}
                    variant="contained">
                        {showEventMarkers ? 'Schowaj' : 'Pokaż'} zdarzenia
                </Button>
            </Stack>
        </>
    );
}

export default DangerousEventCaller;
