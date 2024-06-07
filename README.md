# WorldCupMetrics

##### IL PROGETTO E' UNA SIMULAZIONE, I LOGHI E IL NOME DELL'AZIENDA SONO STATI USATI SOLO A SCOPI EDUCATIVI IN AMBITO UNIVERSITARIO.

##### THE PROJECT IS A SIMULATION, THE LOGOS AND COMPANY NAME HAVE BEEN USED FOR UNIVERSITY EDUCATIONAL PURPOSES ONLY.

<p align="center"><img src="main/frontend/src/components/assets/secondlogo.png" ></p>
Hanno contribuito a questo progetto:
<br/><br/>
<a href="https://github.com/CpDant/WorldCupMetrics/graphs/contributors">
<img src="https://contrib.rocks/image?repo=CpDant/WorldCupMetrics" />
</a>

* [Francesco Paolo D'Antuono](https://github.com/CpDant)
* [Roberto Andrei Miron](https://github.com/RobertoAM1)


## Introduzione
WorldCupMetrics è uno strumento analitico progettato per fornire accesso rapido ai dati della Coppa del Mondo, insieme a dettagliate analisi statistiche. L'obiettivo è non solo gestire un database completo, ma anche estrarre informazioni significative e visualizzare le nazioni vincenti su una mappa mondiale, evidenziando le loro vittorie nei Mondiali.  Che siate appassionati di calcio o semplicemente curiosi, WorldCupMetrics è il posto giusto per vivere l'emozione dei mondiali!

## Caratteristiche
- **Mappa Interattiva:** Esplora i mondiali di calcio attraverso una mappa interattiva. Scopri chi ha vinto i mondiali di calcio e se ne ha vinto più di uno con un semplice clic.
- **Operazioni CRUD:** Prova le operazioni principali per inserire, modificare, eliminare o semplicemente visualizzare le informazioni sulle coppe del mondo.
- **Analisi Statistica:** Effettua analisi statistiche approfondite grazie a un sistema di interrogazioni specifiche al database (es., tasso win/lose di una nazione).
- **Dizionario dei Dati:** Glossario facilmente accessibile che spiega la terminologia e le strutture del dataset.

## Tecnologie
Questo progetto utilizza un insieme di tecnologie robuste tra cui:

<div style="display: flex; align-items: center; align: center;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python Logo" width="50" height="50"/>
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="50" height="50"/>
    <img src="https://miro.medium.com/v2/resize:fit:512/1*doAg1_fMQKWFoub-6gwUiQ.png" alt="MongoDB Logo" width="50" height="50"/>
    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flask-logo-icon.png" alt="Flask Logo" width="50" height="50"/>
</div>

- **Python (3.12) & Flask (3.0.3):** Servizi backend per l'elaborazione dei dati.
- **React (18.3.1):** Per costruire l'interfaccia utente.
- **MongoDB:** Database NoSQL per una gestione efficiente dei dati.

## Dataset
Il progetto utilizza un dataset, prelevato da Kaggle, clicca  <a href = "https://www.kaggle.com/datasets/keremkarayaz/2022-world-cup-datasets?select=world_cups.csv">qui</a> per accedere alle informazioni del dataset su Kaggle. Su questo dataset sono state effettuate alcune modifiche per riuscire ad avere informazioni attuali e corrette all'interno di esso.

## Configurazione
Per configurare il progetto:

1. Clona il repository:
   ```bash
   git clone https://github.com/CpDant/WorldCupMetrics.git
2. Caricare il dataset su MongoDBCompass per permettere l'accesso al database (assicurarsi che il nome che viene associato alla collection sia uguale a quello associato in app.py.
3. Installa e attiva il virtual environment di Python:
   ```bash
   python -m venv venv
4. Installa le dipendenze per il backend:
   ```bash
   pip install -r requirements.txt 
5. Installa le dipendenze per il frontend e buildare il progetto:
   ```bash
   cd main/frontend
   npm install
   npm run build
6. Effettuare il run del progetto con il seguente comando (dalla cartella main):
   ```bash
   flask run

