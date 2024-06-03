import React, { useEffect, useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import './info.css';
import logo from '../assets/secondlogo.png';
import {motion} from "framer-motion";

const pythonLogo = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg';
const reactLogo = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';
const mongodbLogo = 'https://miro.medium.com/v2/resize:fit:512/1*doAg1_fMQKWFoub-6gwUiQ.png';
const flaskLogo = 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flask-logo-icon.png';
const githubLogo = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg';

const Info = () => {
    useEffect(() => {
    document.title = "Info | WorldCupMetrics";
    }, []);

    const [data, setData] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        fetch('/data_dictionary.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error loading the data dictionary:', error));
    }, []);

    return (
        <MainLayout>
            <motion.div initial={{opacity: 0, y: -50}}
                               animate={{opacity: 1, y: 0}}
                               transition={{duration: 0.5}}
                               className="header-container">
            <div className="header">
                <h1 className="title">World Cup Metrics</h1>
                <img className="project-logo" src={logo} alt="Project Logo"/>
                <div className="logo-wrapper">
                    <img className="logo" src={pythonLogo} alt="Python"/>
                    <img className="logo" src={reactLogo} alt="React"/>
                    <img className="logo" src={mongodbLogo} alt="MongoDB"/>
                    <img className="logo" src={flaskLogo} alt="Flask"/>
                </div>
                <div className="link-wrapper">
                    <a className="link" href="https://github.com/CpDant/WorldCupMetrics">
                        <img src={githubLogo} alt="GitHub"/>
                        Repository
                    </a>
                </div>
                <div className="developers">
                    Sviluppato da <a className="link" href="https://github.com/CpDant">Francesco Paolo
                    D'Antuono</a> & <a className="link" href="https://github.com/RobertoAM1">Roberto Andrei Miron</a>
                </div>
                <div className="developers">
                    Dataset: <a className="link" href="https://www.kaggle.com/datasets/keremkarayaz/2022-world-cup-datasets?select=world_cups.csv">Kaggle World Cup 2022</a>
                </div>
            </div>
            <h1>Informazioni sul progetto</h1>
            <h2>Obiettivo del progetto</h2>
            <p>
                Questo progetto vuole non solo creare un database per riuscire ad ottenere informazioni in maniera
                rapida e veloce,
                ma vuole anche effettuare delle analisi statistiche particolari, per estrapolare delle informazioni significative. Inoltre
                ci sarà la possibilità di visualizzare una mappa con all'interno evidenziate le nazioni che hanno vinto almeno un mondiale,
                con le informazioni su quanti mondiali sono stati vinti e in che anno.
            </p>
            <h2>Glossario dei dataset</h2>
            <div className={`table-container ${expanded ? 'expanded' : ''}`}>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="th">Tabella</th>
                            <th className="th">Colonna</th>
                            <th className="th">Descrizione</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr className="tr" key={index}>
                                <td className="td">{item.Tabella}</td>
                                <td className="td">{item.Campo}</td>
                                <td className="td">{item.Descrizione}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="expand-button" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '▲' : '▼'}
                </div>
            </div>
            </motion.div>
        </MainLayout>
    );
};

export default Info;
