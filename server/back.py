from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
from bson import ObjectId
from flask_cors import CORS,cross_origin
from flask_mail import Mail, Message

# Import the required libraries for machine learning
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import numpy as np

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Email Configuration
app.config['MAIL_SERVER'] = 'localhost'
app.config['MAIL_PORT'] = 1025
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

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
        email = data.get('email')
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')
        role = data.get('role')

        if not username or not email or not password or not confirmPassword or not role:
            return jsonify({'status': False, 'msg': 'Incomplete data provided'}), 400

        collection = admin_collection if role == "admin" else patient_collection

        if collection.find_one({'email': email}):
            return jsonify({'status': False, 'msg': 'Email already exists'}), 400

        if password != confirmPassword:
            return jsonify({'status': False, 'msg': 'Password and confirm password do not match'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_id = collection.insert_one({'username': username,'email': email, 'password': hashed_password, 'role': role}).inserted_id

        return jsonify({'status': True, 'msg': 'Registered successfully', 'user_id': str(user_id)}), 201

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500


@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not username or not email or not password or not role:
            return jsonify({'status': False, 'msg': 'Incomplete data provided'}), 400

        collection = admin_collection if role == "admin" else patient_collection

        user = collection.find_one({'email': email, 'role': role})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
           
            return jsonify({'status': True, 'msg': 'Login successful'}), 200
            
        else:
            return jsonify({'status': False, 'msg': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500


# Check and create 'aroledetail' collection
admin_data_name = 'aroledetail'
admin_data = mongo.db[admin_data_name]

# Check and create 'proledetail' collection
patient_data_name = 'proledetail'
patient_data = mongo.db[patient_data_name]

#post data to database
@app.route('/fetchinput', methods=['POST'])
@cross_origin(supports_credentials=True)
def receive_and_save_data():
    try:
        data = request.get_json()  # Get the JSON data from the request
        
        if not data:
            return jsonify({'message': 'No data received'}), 400

        # getting role from the data 
        role = data[0]
      
        collection = admin_data if role == "admin" else patient_data

        # Ensure that "Sno" is unique and serves as the primary key
        for record in data[1]:
            if "Sno" not in record:
                return jsonify({'message': 'Each record must have a "Sno" field'}), 400

            # Check if a record with the same "Sno" already exists in the database
            existing_record = collection.find_one({"Sno": record["Sno"]})
            if existing_record:
                return jsonify({'message': f'Duplicate record with Sno {record["Sno"]} exists'}), 400

        # Insert the received data into the MongoDB collection
        result = collection.insert_many(data[1])
        
        return jsonify({'message': 'Data received and saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500


@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()

        # Send email with field names
        msg = Message('New Contact Form Submission', sender=data['email'], recipients=['nani011618@gmail.com'])
        msg.body = f"Name: {data['first_name']} {data['last_name']}\nEmail: {data['email']}\nMessage: {data['message']}\n\nRaw Form Data:\n{data}"

        mail.send(msg)

        return jsonify({'message': 'Message sent successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Check and create 'symptomdetail' collection
symptom_data_name = 'symptomdetail'
symptom_data = mongo.db[symptom_data_name]


def train_and_evaluate_classifier(selected_algorithm):
    symptoms_list = []
    labels = []
    

    # Assuming admin_data is a collection or data source
    for doc in admin_data.find():
        symptoms = doc['symptoms']
        symptoms_list.extend(symptoms)
        diseases=doc['disease']
        labels.extend([diseases] * len(symptoms))
        

    
    print(labels)

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(symptoms_list)

    

    X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

    algorithms = {
        'NaiveBayes': MultinomialNB(),
        'SVM': SVC(kernel='linear')
    }

    try:
        clf = algorithms[selected_algorithm]
    except KeyError:
        return None, None, "Invalid algorithm"

    clf.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = clf.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    return clf, accuracy, None, vectorizer

def predict_disease_algorithm(symptoms, selected_algorithm, clf, vectorizer):
    try:
        # Ensure symptoms is a list of strings
        if not all(isinstance(symptom, str) for symptom in symptoms):
            raise ValueError("Symptoms should be a list of strings")

        # Vectorize the input symptoms
        symptoms_vectorized = vectorizer.transform(symptoms)

        # Make a prediction based on vectorized symptoms
        predicted_disease = clf.predict(symptoms_vectorized)[0]

        return predicted_disease
    except ValueError as e:
        # Log the exception details
        print("ValueError:", str(e))
        raise ValueError("Invalid input format")

@app.route('/predictdisease', methods=['POST'])
def predict_disease_flask():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', [])
        algorithm = data.get('algorithm', 'NaiveBayes')  # Default to NaiveBayes if not specified

        clf, accuracy, error, vectorizer = train_and_evaluate_classifier(algorithm)

        if error:
            return jsonify({'error': error}), 400  # Return a 400 Bad Request status for an invalid algorithm

        result = predict_disease_algorithm(symptoms, algorithm, clf, vectorizer)

        return jsonify({'predicted_disease': result, 'accuracy': accuracy}), 200

    except ValueError as ve:
        return jsonify({'error': 'Invalid input format', 'details': str(ve)}), 400
    except Exception as e:
        # Log the exception details
        print("Exception:", str(e))

        # Return a more informative error response
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


# Assuming you have an API route like '/getsymptoms'

@app.route('/getsymptoms', methods=['GET'])
def get_symptoms():
    try:
        # Retrieve all documents from the 'symptom_data' collection
        symptoms_cursor = symptom_data.find()

        # Convert MongoDB cursor to a list of dictionaries
        symptom_list = list(symptoms_cursor)

        # Convert ObjectId to string for each document
        for symptom in symptom_list:
            symptom['_id'] = str(symptom['_id'])

        # Return the list of symptoms as JSON response
        return jsonify(symptom_list), 200, {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'}

    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error fetching symptoms: {str(e)}")

        # Return a more informative error response
        error_message = {'error': 'Internal Server Error', 'details': str(e)}
        return jsonify(error_message), 500


if __name__ == '__main__':
    app.run(debug=True)


