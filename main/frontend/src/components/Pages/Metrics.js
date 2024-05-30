import React, { useEffect, useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { CSSTransition } from 'react-transition-group';
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

const Home = () => {
    const [selectedOperation, setSelectedOperation] = useState(null);

    useEffect(() => {
        document.title = "Metrics | WorldCupMetrics";
    }, []);

    const handleOperationChange = (selectedOption) => {
        setSelectedOperation(selectedOption);
    };

    const renderDetails = () => {
        if (!selectedOperation) return null;
        const { title, content } = detailsMapping[selectedOperation.value];
        return (
            <>
                <h2>{title}</h2>
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
                <div className="dropdown-label">Selezione un operazione:</div>
                <Select
                    className="dropdown"
                    options={options}
                    value={selectedOperation}
                    onChange={handleOperationChange}
                    placeholder="Selezione un operazione"
                />
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
