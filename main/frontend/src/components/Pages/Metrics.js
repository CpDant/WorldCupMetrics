import React, { useEffect, useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { CSSTransition } from 'react-transition-group';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './metrics.css';

const options = [
    { value: 'scontriPaesi', label: 'Scontri tra nazioni' },
    { value: 'golTotali', label: 'Gol totali nazione' },
    { value: 'numeroPartite', label: 'Numero partite per anno' },
    { value: 'tassoWinLose', label: 'Tasso win/lose nazione' }
];

const detailsMapping = {
    scontriPaesi: {
        content: 'test1'
    },
    golTotali: {
        content: 'test2'
    },
    numeroPartite: {
        content: 'test3'
    },
    tassoWinLose: {
        content: 'test4'
    }
};

const COLORS = ['#218838', '#828282', '#FF0000FF'];

const Home = () => {
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedNation, setSelectedNation] = useState(null);
    const [matchesData, setMatchesData] = useState([]);
    const [teamStats, setTeamStats] = useState([]);
    const [nationOptions, setNationOptions] = useState([]);

    useEffect(() => {
        document.title = "Metrics | WorldCupMetrics";
    }, []);

    useEffect(() => {
        if (selectedOperation && selectedOperation.value === 'numeroPartite') {
            fetch('/api/matchesplayed')
                .then(response => response.json())
                .then(data => setMatchesData(data))
                .catch(error => console.error('Error fetching matches data:', error));
        } else if (selectedOperation && selectedOperation.value === 'tassoWinLose') {
            fetch('/api/teamstats')
                .then(response => response.json())
                .then(data => {
                    setTeamStats(data);
                    setNationOptions(data.map(team => ({ value: team.team, label: team.team })));
                })
                .catch(error => console.error('Error fetching team stats:', error));
        }
    }, [selectedOperation]);

    const handleOperationChange = (selectedOption) => {
        setSelectedOperation(selectedOption);
        setSelectedNation(null); // reset nation selection when operation changes
    };

    const handleNationChange = (selectedOption) => {
        setSelectedNation(selectedOption);
    };

    const renderCustomLabel = ({ name, value }) => `${name}: ${value}%`;

    const renderDetails = () => {
        if (!selectedOperation) return null;

        if (selectedOperation.value === 'numeroPartite') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={matchesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Matches Played" stroke="#218838" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (selectedOperation.value === 'tassoWinLose') {
            if (!selectedNation) {
                return <p>Seleziona una nazione per visualizzare i dati.</p>;
            }

            const team = teamStats.find(team => team.team === selectedNation.value);

            if (!team) {
                return <p>Nessun dato disponibile per la nazione selezionata.</p>;
            }

            return (
                <div className="details-container">
                    <div className="details-left">
                        <h3>Informazioni su {team.team}</h3>
                        <p><strong>Partite Giocate:</strong> {team.matches_played}</p>
                        <p><strong>Vittorie:</strong> {team.wins}</p>
                        <p><strong>Pareggi:</strong> {team.draws}</p>
                        <p><strong>Sconfitte:</strong> {team.losses}</p>
                    </div>
                    <div className="details-right">
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Wins', value: Math.round(team.win_percentage) },
                                        { name: 'Draws', value: Math.round(team.draw_percentage) },
                                        { name: 'Losses', value: Math.round(team.lose_percentage) }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={renderCustomLabel}
                                >
                                    {['Wins', 'Draws', 'Losses'].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        }

        const { content } = detailsMapping[selectedOperation.value];
        return (
            <>
                <h2>{selectedOperation.label}</h2>
                <p>{content}</p>
            </>
        );
    };

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="header-container"
            >
                <center>
                    <h1 className="title">Metrics</h1>
                    <p className="description">
                        In questa pagina possono essere scelte delle operazioni più particolari sui dati della World Cup.
                    </p>
                </center>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="dropdown-container"
            >
                <div className="dropdown-label">Seleziona un'operazione:</div>
                <Select
                    className="dropdown"
                    options={options}
                    value={selectedOperation}
                    onChange={handleOperationChange}
                    placeholder="Seleziona un'operazione"
                />
                {selectedOperation && selectedOperation.value === 'tassoWinLose' && (
                    <>
                        <div className="dropdown-label">Seleziona una nazione:</div>
                        <Select
                            className="dropdown"
                            options={nationOptions}
                            value={selectedNation}
                            onChange={handleNationChange}
                            placeholder="Seleziona una nazione"
                        />
                    </>
                )}
            </motion.div>
            <CSSTransition
                in={selectedOperation !== null}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <div className="operation-details">
                    {renderDetails()}
                </div>
            </CSSTransition>
        </MainLayout>
    );
};

export default Home;
