import pymongo
from flask import Flask, jsonify, request, send_from_directory
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

# URI di connessione al cluster cloud
uri = os.getenv('MONGO_URI')

# Configura il client MongoDB
client = MongoClient(uri)
db = client['WorldCupMetricsDB']
collection1 = db['world_cups']
collection2 = db['world_cup_matches']
@app.route('/api/worldcups', methods=['POST'])
def create_world_cup():
    try:
        cup_data = request.json
        collection1.insert_one(cup_data)
        return jsonify({'message': 'World Cup added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/worldcups', methods=['GET'])
def read_world_cups():
    try:
        cups = list(collection1.find({}, {'_id': 0}).sort([('Year', pymongo.ASCENDING)]))
        return jsonify(cups), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/worldcups/<int:year>', methods=['PUT'])
def update_world_cup(year):
    try:
        update_data = request.json
        result = collection1.update_one({'Year': year}, {'$set': update_data})
        if result.modified_count > 0:
            return jsonify({'message': 'World Cup updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes made or World Cup not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/worldcups/<int:year>', methods=['DELETE'])
def delete_world_cup(year):
    try:
        result = collection1.delete_one({'Year': year})
        if result.deleted_count > 0:
            return jsonify({'message': 'World Cup deleted successfully'}), 200
        else:
            return jsonify({'message': 'World Cup not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/crud.html')
def crud():
    return send_from_directory(app.static_folder, 'crud.html')

@app.route('/info.html')
def info():
    return send_from_directory(app.static_folder, 'info.html')

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
