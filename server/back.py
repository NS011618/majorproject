from flask import Flask, request, jsonify,make_response
from flask_pymongo import PyMongo
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

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
            # Set a cookie with the user's role
            response = make_response(jsonify({'status': True, 'msg': 'Login successful'}), 200)
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Expose-Headers', 'Set-Cookie')
            response.set_cookie('userRole', role)
            return response
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

# Check and create 'arole' collection
admin_data_name = 'aroledetail'
admin_data = mongo.db[admin_data_name]

# Check and create 'prole' collection
patient_data_name = 'proledetail'
patient_data = mongo.db[patient_data_name]


@app.route('/fetchinput', methods=['POST'])
def receive_and_save_data():
    try:
        data = request.get_json()  # Get the JSON data from the request
        print(data)
        if not data:
            return jsonify({'message': 'No data received'}), 400

        # Assuming role is the same for all records in the request
        role = data.get('userRole')
        print(role)
        collection = admin_data if role == "admin" else patient_data

        # Ensure that "Sno" is unique and serves as the primary key
        for record in data:
            if "Sno" not in record:
                return jsonify({'message': 'Each record must have a "Sno" field'}), 400

            # Check if a record with the same "Sno" already exists in the database
            existing_record = collection.find_one({"Sno": record["Sno"]})
            if existing_record:
                return jsonify({'message': f'Duplicate record with Sno {record["Sno"]} exists'}), 400

        # Insert the received data into the MongoDB collection
        result = collection.insert_many(data[1])
        print(result.inserted_ids)

        return jsonify({'message': 'Data received and saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500





if __name__ == '__main__':
    app.run(debug=True)
