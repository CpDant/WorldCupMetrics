import React, { useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import WorldMap from '../worldMap';
import { motion } from 'framer-motion';
import './home.css';

const Home = () => {
    useEffect(() => {
        document.title = "Home | WorldCupMetrics";
    }, []);

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="header-container"
            >
                <center>
                    <h1 className="title">Benvenuti a WorldCupMetrics</h1>
                    <p className="description">
                        In questa mappa è possibile scegliere il paese di interesse e scoprire quante coppe del mondo ha vinto.
                    </p>
                </center>
            </motion.div>
            <WorldMap />
        </MainLayout>
    );
};

export default Home;
