import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MainLayout from '../Layout/MainLayout';

const Crud = () => {
    const [worldCups, setWorldCups] = useState([]);
    const [formData, setFormData] = useState({
        Year: 0,
        Host_Country: '',
        Winner: '',
        Runners_Up: '',
        Third: '',
        Fourth: '',
        Goals_Scored: 0,
        Qualified_Teams: 0,
        Matches_Played: 0
    });

    useEffect(() => {
        fetchWorldCups();
    }, []);

    const fetchWorldCups = async () => {
        try {
            const response = await Axios.get('/api/worldcups');
            setWorldCups(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Convert values to integers if they are numeric fields
        if (['Year', 'Goals_Scored', 'Qualified_Teams', 'Matches_Played'].includes(name)) {
            newValue = parseInt(value, 10);
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Axios.post('/api/worldcups', formData);
            fetchWorldCups();
            setFormData({
                Year: 0,
                Host_Country: '',
                Winner: '',
                Runners_Up: '',
                Third: '',
                Fourth: '',
                Goals_Scored: 0,
                Qualified_Teams: 0,
                Matches_Played: 0
            });
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

    const handleUpdate = async (year) => {
        try {
            await Axios.put(`/api/worldcups/${year}`, formData);
            fetchWorldCups();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <MainLayout>
            <h1>Operazioni CRUD</h1>
            <p>Qui sarà presente la tabella con la possibilità di creare, leggere, aggiornare o cancellare una collezione in un documento.</p>

            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label>{key}</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Add World Cup</button>
            </form>

            <table>
                <thead>
                <tr>
                    {Object.keys(formData).map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {worldCups.map((cup) => (
                    <tr key={cup.Year}>
                        {Object.keys(formData).map((key) => (
                            <td key={key}>{cup[key]}</td>
                        ))}
                        <td>
                            <button onClick={() => setFormData(cup)}>Edit</button>
                            <button onClick={() => handleUpdate(cup.Year)}>Update</button>
                            <button onClick={() => handleDelete(cup.Year)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </MainLayout>
    );
};

export default Crud;
