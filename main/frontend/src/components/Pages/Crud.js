import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MainLayout from '../Layout/MainLayout';
import '../static/style.css';

const Crud = () => {
    const [worldCups, setWorldCups] = useState([]);
    const [formData, setFormData] = useState({
        Year: 0,
        'Host Country': '',
        Winner: '',
        'Runners-Up': '',
        Third: '',
        Fourth: '',
        'Goals Scored': 0,
        'Qualified Teams': 0,
        'Matches Played': 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [editRow, setEditRow] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchWorldCups();
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
        let newValue = value;

        if (['Year', 'Goals Scored', 'Qualified Teams', 'Matches Played'].includes(name)) {
            newValue = parseInt(value, 10) || 0;
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleCancelEdit = () => {
        fetchWorldCups();
        setEditRow(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Axios.post('/api/worldcups', formData);
            fetchWorldCups();
            setFormData({
                Year: 0,
                'Host Country': '',
                Winner: '',
                'Runners-Up': '',
                Third: '',
                Fourth: '',
                'Goals Scored': 0,
                'Qualified Teams': 0,
                'Matches Played': 0
            });
            setEditRow(null);
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
        setFormData({ ...cup });
    };

    const handleSave = async (year) => {
        try {
            await Axios.put(`/api/worldcups/${year}`, formData);
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
            <h1>Operazioni CRUD</h1>
            <p>Qui sarà presente la tabella con la possibilità di creare, leggere, aggiornare o cancellare una collezione in un documento.</p>

            <form onSubmit={handleSubmit}>
                {columnOrder.map((key) => (
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
                <div className="button-container">
                    <button type="submit" className="submit-button">Aggiungi World Cup</button>
                </div>
            </form>

            <div className="table-container">
                <table>
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
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            className="small-input"
                                        />
                                    ) : (
                                        cup[key]
                                    )}
                                </td>
                            ))}
                            <td className="actions">
                                {editRow === cup.Year ? (
                                    <>
                                        <button onClick={() => handleSave(cup.Year)}>Salva</button>
                                        <button onClick={handleCancelEdit} className="delete-button">Annulla</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(cup)}>Aggiorna</button>
                                        <button onClick={() => handleDelete(cup.Year)} className="delete-button">Elimina</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    &laquo; Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next &raquo;
                </button>
            </div>
        </MainLayout>
    );
};

export default Crud;
