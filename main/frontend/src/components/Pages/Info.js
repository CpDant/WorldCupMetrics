import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MainLayout from '../Layout/MainLayout';

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

const Th = styled.th`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    background-color: #4CAF50;
    color: white;
`;

const Td = styled.td`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
`;

const Tr = styled.tr`
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
    &:nth-child(odd) {
        background-color: #f2f2f2;
    }
`;

const Info = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/data_dictionary.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error loading the data dictionary:', error));
    }, []);

    return (
        <MainLayout>
            <h1>Informazioni sul progetto</h1>
            <h2>Obiettivo del progetto</h2>
            <p>
                Questo progetto vuole non solo creare un database per riuscire ad ottenere informazioni in maniera rapida e veloce,
                ma vuole anche effettuare delle analisi statistiche particolari, per estrapolare delle informazioni significative. Inoltre
                ci sarà la possibilità di visualizzare una mappa con all'interno evidenziate le nazioni che hanno vinto almeno un mondiale,
                con le informazioni su quanti mondiali sono stati vinti e in che anno.
            </p>
            <h2>Glossario dei dataset</h2>
            <Table>
                <thead>
                <tr>
                    <Th>Tabella</Th>
                    <Th>Colonna</Th>
                    <Th>Descrizione</Th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <Tr key={index}>
                        <Td>{item.Tabella}</Td>
                        <Td>{item.Campo}</Td>
                        <Td>{item.Descrizione}</Td>
                    </Tr>
                ))}
                </tbody>
            </Table>
        </MainLayout>
    );
};

export default Info;
