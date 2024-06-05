import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MainLayout from '../Layout/MainLayout';
import '../static/style.css';
import { TextField, Select, MenuItem, Button, InputLabel, FormControl, Box, Grid, Paper, Alert } from '@mui/material';
import { motion } from "framer-motion";

const countries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "DR Congo", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe" ];

const Crud = () => {
    const [worldCups, setWorldCups] = useState([]);
    const [formData, setFormData] = useState({
        Year: '',
        'Host Country': '',
        Winner: '',
        'Runners-Up': '',
        Third: '',
        Fourth: '',
        'Goals Scored': '',
        'Qualified Teams': '',
        'Matches Played': ''
    });

    const [editFormData, setEditFormData] = useState({
        Year: '',
        'Host Country': '',
        Winner: '',
        'Runners-Up': '',
        Third: '',
        Fourth: '',
        'Goals Scored': '',
        'Qualified Teams': '',
        'Matches Played': ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [editRow, setEditRow] = useState(null);
    const [error, setError] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        fetchWorldCups();
    }, []);

    useEffect(() => {
        document.title = "CRUD | WorldCupMetrics";
    }, []);

    const fetchWorldCups = async () => {
        try {
            const response = await Axios.get('/api/worldcups');
            console.log('Fetched data:', response.data);
            setWorldCups(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value.trim();

        if (!isNaN(newValue) && newValue !== '') {
            newValue = parseInt(newValue, 10);
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        let newValue = value.trim();

        if (!isNaN(newValue) && newValue !== '') {
            newValue = parseInt(newValue, 10);
        }

        setEditFormData({ ...editFormData, [name]: newValue });
    };

    const handleCancelEdit = () => {
        fetchWorldCups();
        setEditRow(null);
    };

    const validateForm = () => {
        for (const key in formData) {
            if (formData[key] === '') {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setError('Per favore, riempi tutti i campi prima di inviare.');
            return;
        }
        try {
            await Axios.post('/api/worldcups', formData);
            fetchWorldCups();
            setFormData({
                Year: '',
                'Host Country': '',
                Winner: '',
                'Runners-Up': '',
                Third: '',
                Fourth: '',
                'Goals Scored': '',
                'Qualified Teams': '',
                'Matches Played': ''
            });
            setError('');
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleDelete = async (year) => {
        try {
            await Axios.delete(`/api/worldcups/${year}`);
            fetchWorldCups();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleEdit = (cup) => {
        setEditRow(cup.Year);
        setEditFormData({ ...cup });
    };

    const handleSave = async (year) => {
        try {
            await Axios.put(`/api/worldcups/${year}`, editFormData);
            fetchWorldCups();
            setEditRow(null);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = worldCups.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(worldCups.length / itemsPerPage);

    const columnOrder = [
        'Year',
        'Host Country',
        'Winner',
        'Runners-Up',
        'Third',
        'Fourth',
        'Goals Scored',
        'Qualified Teams',
        'Matches Played'
    ];

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="header-container"
            >
                <center>
                    <h1 className="title">Operazioni CRUD</h1>
                    <p className="description">
                        In questa pagina è possibile eseguire le operazioni CRUD sulla tabella delle coppe del mondo.
                    </p>
                </center>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header-container"
            >
                <Paper className="form-container" elevation={3}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {columnOrder.map((key) => (
                                <Grid item xs={12} sm={6} md={4} key={key}>
                                    {['Host Country', 'Winner', 'Runners-Up', 'Third', 'Fourth'].includes(key) ? (
                                        <FormControl fullWidth margin="dense" size="small">
                                            <InputLabel>{key}</InputLabel>
                                            <Select
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                label={key}
                                                className="select-left-align"
                                                placeholder="seleziona una nazione"
                                            >
                                                {countries.map((country) => (
                                                    <MenuItem key={country} value={country}>
                                                        {country}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            size="small"
                                            label={key}
                                            type={key === 'Year' || key.includes('Goals') || key.includes('Teams') || key.includes('Played') ? 'number' : 'text'}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            inputProps={{ min: 0, step: 1 }}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        <Box textAlign="center" marginY={2}>
                            <Button type="submit" variant="contained" color="success">
                                Aggiungi World Cup
                            </Button>
                        </Box>
                    </form>
                </Paper>

                <table className="styled-table">
                    <thead>
                    <tr>
                        {columnOrder.map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((cup) => (
                        <tr key={cup.Year}>
                            {columnOrder.map((key) => (
                                <td key={key}>
                                    {editRow === cup.Year ? (
                                        <TextField
                                            type={key === 'Year' || key.includes('Goals') || key.includes('Teams') || key.includes('Played') ? 'number' : 'text'}
                                            name={key}
                                            value={editFormData[key]}
                                            onChange={handleEditChange}
                                            className="small-input"
                                            margin="dense"
                                            size="small"
                                        />
                                    ) : (
                                        cup[key]
                                    )}
                                </td>
                            ))}
                            <td className="actions">
                                {editRow === cup.Year ? (
                                    <>
                                        <Button onClick={() => handleSave(cup.Year)} variant="contained" color="success" size="small">
                                            Salva
                                        </Button>
                                        <Button onClick={handleCancelEdit} variant="contained" color="secondary" className="delete-button" size="small">
                                            Annulla
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => handleEdit(cup)} variant="contained" color="success" size="small">
                                            Aggiorna
                                        </Button>
                                        <Button onClick={() => handleDelete(cup.Year)} variant="contained" color="error" className="delete-button" size="small">
                                            Elimina
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} variant="contained" color="success" size="small">
                        &laquo; Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} variant="contained" color="success" size="small">
                        Next &raquo;
                    </Button>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default Crud;
