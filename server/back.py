from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://ashishgolla2003:NS011618@cluster0.ophbpqo.mongodb.net/project'
mongo = PyMongo(app)

# Check and create 'arole' collection
admin_collection_name = 'arole'
admin_collection = mongo.db[admin_collection_name]

# Check and create 'prole' collection
patient_collection_name = 'prole'
patient_collection = mongo.db[patient_collection_name]

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')
        role = data.get('role')

        if not username or not password or not confirmPassword or not role:
            return jsonify({'status': False, 'msg': 'Incomplete data provided'}), 400

        collection = admin_collection if role == "admin" else patient_collection

        if collection.find_one({'username': username}):
            return jsonify({'status': False, 'msg': 'Username already exists'}), 400

        if password != confirmPassword:
            return jsonify({'status': False, 'msg': 'Password and confirm password do not match'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_id = collection.insert_one({'username': username, 'password': hashed_password, 'role': role}).inserted_id

        return jsonify({'status': True, 'msg': 'Registered successfully', 'user_id': str(user_id)}), 201

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')

        if not username or not password or not role:
            return jsonify({'status': False, 'msg': 'Incomplete data provided'}), 400

        collection = admin_collection if role == "admin" else patient_collection

        user = collection.find_one({'username': username, 'role': role})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'status': True, 'msg': 'Login successful'}), 200
        else:
            return jsonify({'status': False, 'msg': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500

@app.route('/logout', methods=['POST'])
def logout():
    try:
        # Clear the user's session or token (Flask-Login is not implemented)
        return jsonify({'status': True, 'msg': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
