import pymongo
from flask import Flask, jsonify, request, send_from_directory
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from flask_cors import CORS
import json

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

@app.route('/api/worldcupwins', methods=['GET'])
def get_all_world_cup_wins():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$Winner",
                    "wins": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "country": "$_id",
                    "wins": 1
                }
            }
        ]
        results = list(collection1.aggregate(pipeline))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/worldcupwins/<country_name>', methods=['GET'])
def get_world_cup_wins(country_name):
    try:
        wins_count = collection1.count_documents({'Winner': country_name})
        return jsonify({'country': country_name, 'wins': wins_count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/matchesplayed', methods=['GET'])
def get_matches_played_per_year():
    try:
        pipeline = [
            {
                "$project": {
                    "_id": 0,
                    "Year": 1,
                    "Matches Played": 1
                }
            },
            {
                "$sort": {"Year": 1}
            }
        ]
        results = list(collection1.aggregate(pipeline))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teamstats', methods=['GET'])
def get_team_stats():
    try:
        pipeline = [
            {
                "$project": {
                    "home_team": "$Home Team",
                    "away_team": "$Away Team",
                    "home_goals": "$Home Goals",
                    "away_goals": "$Away Goals"
                }
            },
            {
                "$facet": {
                    "home_stats": [
                        {
                            "$group": {
                                "_id": "$home_team",
                                "wins": {
                                    "$sum": {
                                        "$cond": [{ "$gt": ["$home_goals", "$away_goals"] }, 1, 0]
                                    }
                                },
                                "draws": {
                                    "$sum": {
                                        "$cond": [{ "$eq": ["$home_goals", "$away_goals"] }, 1, 0]
                                    }
                                },
                                "losses": {
                                    "$sum": {
                                        "$cond": [{ "$lt": ["$home_goals", "$away_goals"] }, 1, 0]
                                    }
                                },
                                "total_games": {"$sum": 1}
                            }
                        }
                    ],
                    "away_stats": [
                        {
                            "$group": {
                                "_id": "$away_team",
                                "wins": {
                                    "$sum": {
                                        "$cond": [{ "$gt": ["$away_goals", "$home_goals"] }, 1, 0]
                                    }
                                },
                                "draws": {
                                    "$sum": {
                                        "$cond": [{ "$eq": ["$away_goals", "$home_goals"] }, 1, 0]
                                    }
                                },
                                "losses": {
                                    "$sum": {
                                        "$cond": [{ "$lt": ["$away_goals", "$home_goals"] }, 1, 0]
                                    }
                                },
                                "total_games": {"$sum": 1}
                            }
                        }
                    ]
                }
            },
            {
                "$project": {
                    "all_stats": {
                        "$concatArrays": ["$home_stats", "$away_stats"]
                    }
                }
            },
            {
                "$unwind": "$all_stats"
            },
            {
                "$group": {
                    "_id": "$all_stats._id",
                    "wins": {"$sum": "$all_stats.wins"},
                    "draws": {"$sum": "$all_stats.draws"},
                    "losses": {"$sum": "$all_stats.losses"},
                    "total_games": {"$sum": "$all_stats.total_games"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "team": "$_id",
                    "wins": 1,
                    "draws": 1,
                    "losses": 1,
                    "total_games": 1,
                    "win_percentage": {"$multiply": [{"$divide": ["$wins", "$total_games"]}, 100]},
                    "draw_percentage": {"$multiply": [{"$divide": ["$draws", "$total_games"]}, 100]},
                    "lose_percentage": {"$multiply": [{"$divide": ["$losses", "$total_games"]}, 100]}
                }
            }
        ]
        results = list(collection2.aggregate(pipeline))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/goalstats', methods=['GET'])
def get_goal_stats():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "year": "$Year",
                        "team": "$Home Team"
                    },
                    "total_goals": { "$sum": "$Home Goals" }
                }
            },
            {
                "$unionWith": {
                    "coll": "world_cup_matches",
                    "pipeline": [
                        {
                            "$group": {
                                "_id": {
                                    "year": "$Year",
                                    "team": "$Away Team"
                                },
                                "total_goals": { "$sum": "$Away Goals" }
                            }
                        }
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": "$_id.year",
                        "team": "$_id.team"
                    },
                    "total_goals": { "$sum": "$total_goals" }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "year": "$_id.year",
                    "team": "$_id.team",
                    "total_goals": 1
                }
            },
            {
                "$sort": { "year": 1 }
            }
        ]
        results = list(collection2.aggregate(pipeline))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/versusmatches', methods=['GET'])
def get_versus_matches():
    try:
        nation1 = request.args.get('nation1')
        nation2 = request.args.get('nation2')
        if not nation1 or not nation2:
            return jsonify({'error': 'Two nations must be specified'}), 400

        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"$and": [{"Home Team": nation1}, {"Away Team": nation2}]},
                        {"$and": [{"Home Team": nation2}, {"Away Team": nation1}]}
                    ]
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "Date": 1,
                    "Stage": 1,
                    "HomeTeam": "$Home Team",
                    "AwayTeam": "$Away Team",
                    "HomeGoals": "$Home Goals",
                    "AwayGoals": "$Away Goals"
                }
            },
            {
                "$sort": { "Date": 1 }
            }
        ]
        results = list(collection2.aggregate(pipeline))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
