import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../Layout/MainLayout';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { CSSTransition } from 'react-transition-group';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from 'recharts';
import './metrics.css';

const options = [
    { value: 'scontriPaesi', label: 'Scontri tra nazioni' },
    { value: 'golTotali', label: 'Gol totali nazione' },
    { value: 'numeroPartite', label: 'Numero partite per anno' },
    { value: 'tassoWinLose', label: 'Tasso win/lose nazione' },
    { value: 'mediaGolVincitori', label: 'Media gol dei vincitori' }
];

const detailsMapping = {
    scontriPaesi: {
        content: 'Questa operazione mostra i dati sugli scontri tra diverse nazioni.'
    },
    golTotali: {
        content: 'Qui possono essere visualizzati il numero di gol totali della nazione selezionata per anno.'
    },
    numeroPartite: {
        content: 'Qui possono essere visualizzati il numero di partite giocate per anno.'
    },
    tassoWinLose: {
        content: 'Qui possono essere visualizzati i tassi di vittoria, pareggio e sconfitta della nazione selezionata.'
    },
    mediaGolVincitori: {
        content: 'Qui possono essere visualizzati la media dei gol fatti e subiti dai vincitori della coppa del mondo selezionata.'
    }
};

const COLORS1 = ['#218838', '#828282', '#FF0000FF'];
const COLORS2 = ['#218838', '#FF0000'];


const Metrics = () => {
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedNation, setSelectedNation] = useState(null);
    const [selectedNation2, setSelectedNation2] = useState(null);
    const [selectedWorldCup, setSelectedWorldCup] = useState(null);
    const [matchesData, setMatchesData] = useState([]);
    const [goalsData, setGoalsData] = useState([]);
    const [teamStats, setTeamStats] = useState([]);
    const [nationOptions, setNationOptions] = useState([]);
    const [versusMatches, setVersusMatches] = useState([]);
    const [worldCupOptions, setWorldCupOptions] = useState([]);
    const [winnerStats, setWinnerStats] = useState(null);
    const [winnerNation, setWinnerNation] = useState('');

    useEffect(() => {
        document.title = "Metrics | WorldCupMetrics";
    }, []);

    useEffect(() => {
        const fetchInitialData = () => {
            fetch('/api/teamstats')
                .then(response => response.json())
                .then(data => {
                    setTeamStats(data);
                    setNationOptions(data.map(team => ({ value: team.team, label: team.team })).sort((a, b) => a.label.localeCompare(b.label)));
                })
                .catch(error => console.error('Error fetching team stats:', error));

            fetch('/api/worldcups')
                .then(response => response.json())
                .then(data => {
                    setWorldCupOptions(data.map(cup => ({ value: cup.Year, label: cup.Year })).sort((a, b) => a.value - b.value));
                })
                .catch(error => console.error('Error fetching World Cups data:', error));
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedOperation) {
            if (selectedOperation.value === 'numeroPartite') {
                fetch('/api/matchesplayed')
                    .then(response => response.json())
                    .then(data => setMatchesData(data))
                    .catch(error => console.error('Error fetching matches data:', error));
            } else if (selectedOperation.value === 'golTotali') {
                fetch('/api/goalstats')
                    .then(response => response.json())
                    .then(data => {
                        setGoalsData(data);
                        const teams = new Set();
                        data.forEach(entry => {
                            teams.add(entry.team);
                        });
                        setNationOptions(Array.from(teams).map(team => ({ value: team, label: team })).sort((a, b) => a.label.localeCompare(b.label)));
                    })
                    .catch(error => console.error('Error fetching goals data:', error));
            }
        }
    }, [selectedOperation]);

    const calculateWinData = useCallback((matches) => {
        const winCount = { [selectedNation.value]: 0, [selectedNation2.value]: 0 };
        matches.forEach(match => {
            if (match.HomeGoals > match.AwayGoals) {
                winCount[match.HomeTeam]++;
            } else if (match.HomeGoals < match.AwayGoals) {
                winCount[match.AwayTeam]++;
            }
        });

    }, [selectedNation, selectedNation2]);

    useEffect(() => {
        if (selectedNation && selectedNation2 && selectedOperation?.value === 'scontriPaesi') {
            fetch(`/api/versusmatches?nation1=${selectedNation.value}&nation2=${selectedNation2.value}`)
                .then(response => response.json())
                .then(data => {
                    setVersusMatches(data);
                    calculateWinData(data);
                })
                .catch(error => console.error('Error fetching versus matches:', error));
        }
    }, [selectedNation, selectedNation2, selectedOperation, calculateWinData]);

    useEffect(() => {
        if (selectedWorldCup && selectedOperation?.value === 'mediaGolVincitori') {
            fetch(`/api/winnerstats?year=${selectedWorldCup.value}`)
                .then(response => response.json())
                .then(data => {
                    setWinnerStats(data);
                    fetch(`/api/worldcups`)
                        .then(response => response.json())
                        .then(cups => {
                            const winnerCup = cups.find(cup => cup.Year === selectedWorldCup.value);
                            setWinnerNation(winnerCup.Winner);
                        });
                })
                .catch(error => console.error('Error fetching winner stats:', error));
        }
    }, [selectedWorldCup, selectedOperation]);

    const handleOperationChange = (selectedOption) => {
        setSelectedOperation(selectedOption);
        setSelectedNation(null);
        setSelectedNation2(null);
        setSelectedWorldCup(null);
        setVersusMatches([]);
        setWinnerStats(null);
        setWinnerNation('');
    };

    const handleNationChange = (selectedOption) => {
        setSelectedNation(selectedOption);
        if (selectedNation2 && selectedNation2.value === selectedOption.value) {
            setSelectedNation2(null);
        }
    };

    const handleNationChange2 = (selectedOption) => {
        setSelectedNation2(selectedOption);
        if (selectedNation && selectedNation.value === selectedOption.value) {
            setSelectedNation(null);
        }
    };

    const handleWorldCupChange = (selectedOption) => {
        setSelectedWorldCup(selectedOption);
    };

    const calculateGoalsPerYear = (team) => {
        const teamGoalsData = goalsData.filter(entry => entry.team === team);
        return teamGoalsData.map(entry => ({
            year: entry.year,
            goals: entry.total_goals
        }));
    };

    const renderCustomLabel = ({ name, value }) => `${name}: ${value}`;

    const renderDetails = () => {
        if (!selectedOperation) return null;

        const { content } = detailsMapping[selectedOperation.value];

        if (selectedOperation.value === 'numeroPartite') {
            return (
                <>
                    <p>{content}</p>
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
                </>
            );
        } else if (selectedOperation.value === 'golTotali') {
            if (!selectedNation) {
                return <p>{content}</p>;
            }

            const teamGoalsData = calculateGoalsPerYear(selectedNation.value);
            console.log('Team Goals Data:', teamGoalsData);

            if (teamGoalsData.length === 0) {
                return (
                    <>
                        <p>{content}</p>
                        <p>Nessun dato disponibile per la nazione selezionata.</p>
                    </>
                );
            }

            return (
                <>
                    <p>{content}</p>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={teamGoalsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="goals" fill="#218838" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            );
        } else if (selectedOperation.value === 'tassoWinLose') {
            if (!selectedNation) {
                return <p>{content}</p>;
            }

            const team = teamStats.find(team => team.team === selectedNation.value);

            if (!team) {
                return (
                    <>
                        <p>{content}</p>
                        <p>Nessun dato disponibile per la nazione selezionata.</p>
                    </>
                );
            }

            return (
                <>
                    <p>{content}</p>
                    <div className="details-container">
                        <div className="details-left">
                            <div className="details-text">
                                <h3>Informazioni su {team.team}</h3>
                                <p><strong>Vittorie:</strong> {team.wins}</p>
                                <p><strong>Pareggi:</strong> {team.draws}</p>
                                <p><strong>Sconfitte:</strong> {team.losses}</p>
                            </div>
                        </div>
                        <div className="details-right">
                            <ResponsiveContainer width="75%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Wins', value: team.wins },
                                            { name: 'Draws', value: team.draws },
                                            { name: 'Losses', value: team.losses }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={renderCustomLabel}
                                    >
                                        {['Wins', 'Draws', 'Losses'].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            );
        } else if (selectedOperation.value === 'scontriPaesi') {
            if (!selectedNation || !selectedNation2) {
                return <p>{content}</p>;
            }

            if (versusMatches.length === 0) {
                return (
                    <>
                        <p>{content}</p>
                        <p className="no-matches-message">Nessun scontro tra le nazioni selezionate.</p>
                    </>
                );
            }

            return (
                <>
                    <p>{content}</p>
                    <div className="details-container">
                        <div className="details-left">
                            <h3>Dettagli dello scontro tra {selectedNation.label} e {selectedNation2.label}</h3>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <table className="versus-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Fase</th>
                                            <th>Home Team</th>
                                            <th>Risultato</th>
                                            <th>Away Team</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {versusMatches.map((match, index) => (
                                            <tr key={index}>
                                                <td>{match.Date}</td>
                                                <td>{match.Stage}</td>
                                                <td>{match.HomeTeam}</td>
                                                <td>{match.HomeGoals} - {match.AwayGoals}</td>
                                                <td>{match.AwayTeam}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </div>
                    </div>
                </>
            );
        } else if (selectedOperation.value === 'mediaGolVincitori') {
            if (!selectedWorldCup) {
                return <p>{content}</p>;
            }

            if (!winnerStats) {
                return (
                    <>
                        <p>{content}</p>
                        <p>Nessun dato disponibile per la coppa del mondo selezionata.</p>
                    </>
                );
            }

            const data = [
                { name: 'Goals Scored', value: winnerStats.average_goals_scored },
                { name: 'Goals Conceded', value: winnerStats.average_goals_conceded }
            ];

            return (
                <>
                    <p>{content}</p>
                    <h3>{`Nazione vincitrice: ${winnerNation}`}</h3>
                    <div className="details-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label={renderCustomLabel}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            );
        }

        return <p>{content}</p>;
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
                className={`dropdown-container ${selectedOperation && (selectedOperation.value === 'golTotali' || selectedOperation.value === 'tassoWinLose' || selectedOperation.value === 'mediaGolVincitori') ? 'spaced-dropdown-container' : ''}`}
            >
                <div className="dropdown-label">Seleziona un'operazione:</div>
                <Select
                    className="dropdown"
                    options={options}
                    value={selectedOperation}
                    onChange={handleOperationChange}
                    placeholder="Seleziona un'operazione"
                />
            </motion.div>
            {selectedOperation && (selectedOperation.value === 'golTotali' || selectedOperation.value === 'tassoWinLose') && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="dropdown-container"
                >
                    <div className="dropdown-label nation-label">Seleziona una nazione:</div>
                    <Select
                        className="dropdown"
                        options={nationOptions}
                        value={selectedNation}
                        onChange={handleNationChange}
                        placeholder="Seleziona una nazione"
                    />
                </motion.div>
            )}
            {selectedOperation && selectedOperation.value === 'scontriPaesi' && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="dropdown-container"
                >
                    <Select
                        className="dropdown"
                        options={nationOptions.filter(option => option.value !== selectedNation2?.value)}
                        value={selectedNation}
                        onChange={handleNationChange}
                        placeholder="Seleziona una nazione"
                    />
                    <motion.div
                        className="vs-container"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="vs-text">Vs</div>
                    </motion.div>
                    <Select
                        className="dropdown"
                        options={nationOptions.filter(option => option.value !== selectedNation?.value)}
                        value={selectedNation2}
                        onChange={handleNationChange2}
                        placeholder="Seleziona un'altra nazione"
                    />
                </motion.div>
            )}
            {selectedOperation && selectedOperation.value === 'mediaGolVincitori' && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="dropdown-container"
                >
                    <div className="dropdown-label nation-label2">Seleziona una coppa del mondo:</div>
                    <Select
                        className="dropdown"
                        options={worldCupOptions}
                        value={selectedWorldCup}
                        onChange={handleWorldCupChange}
                        placeholder="Seleziona una coppa del mondo"
                    />
                </motion.div>
            )}
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

export default Metrics;
