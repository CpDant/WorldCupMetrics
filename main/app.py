from flask import Flask, render_template
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# URI di connessione al cluster cloud
uri = os.getenv('MONGO_URI')

# Configura il client MongoDB
client = MongoClient(uri)
db = client.test

db = client['WorldCupMetricsDB']
collection1 = db['world_cups']
collection2 = db['world_cup_matches']
# Funzione per caricare il dataset in MongoDB

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)

