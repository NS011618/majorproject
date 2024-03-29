from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
from flask_cors import CORS,cross_origin
from flask_mail import Mail, Message

from dotenv import load_dotenv
load_dotenv()

import os

# Import the required libraries for machine learning
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.model_selection import cross_val_score
import numpy as np
import pandas as pd

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

'''***************************************************** Signup Code **************************************************************************'''
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

'''***************************************************** Login Code **************************************************************************'''
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

'''*************************************************** Input Data Code ************************************************************************'''
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
                # If the record already exists, update it
                result = collection.replace_one({"Sno": record["Sno"]}, record)
                if result.modified_count == 0:
                    return jsonify({'message': f'Failed to update record with Sno {record["Sno"]}'}), 500
            else:
                # If the record doesn't exist, insert it
                result = collection.insert_one(record)
                if not result.inserted_id:
                    return jsonify({'message': f'Failed to insert record with Sno {record["Sno"]}'}), 500
        
        return jsonify({'message': 'Data received and saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500


'''**************************************************** Contact us Code ************************************************************************'''
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


'''********************** Predict the Disease *******************************'''
@app.route('/predictdisease', methods=['POST'])
def predict_disease_flask():
    try:
        data = request.get_json()
        #print("Received data:", data) 
        symptoms = data.get('symptoms', [])
        selected_algorithm = data.get('algorithm', 'DecisionTree')  # Default to DecisionTree if not specified

        # getsymptoms
        getsymp = data.get('listsymptoms', [])

        pastdata=data.get('pasthistory',[])
        
        l1 = len(getsymp)

        l2 = np.zeros(l1)

        '''disease = ['Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
                   'Peptic ulcer disease', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma', 'Hypertension',
                   'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)', 'Jaundice', 'Malaria',
                   'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D',
                   'Hepatitis E', 'Alcoholic hepatitis', 'Tuberculosis', 'Common Cold', 'Pneumonia',
                   'Dimorphic hemorrhoids(piles)', 'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism',
                   'Hypoglycemia', 'Osteoarthristis', 'Arthritis', '(vertigo) Paroxysmal Positional Vertigo', 'Acne',
                   'Urinary tract infection', 'Psoriasis', 'Impetigo']'''

        # Load training data
        train_data = pd.read_csv(r"C:\Users\OS23H\OneDrive\Desktop\project\server\Training_Predict.csv")

        df = pd.DataFrame(train_data)

        cols = df.columns
        cols = cols[:-1]

        x = df[cols]
        y = df['prognosis']

        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)

        algorithms = {            
            'DecisionTree': DecisionTreeClassifier(min_samples_split=20)
        }

        clf = algorithms.get(selected_algorithm)

        if clf is None:
            return jsonify({'error': 'Invalid algorithm'}), 400

        clf.fit(X_train, y_train)

        # Make predictions on the test set
        y_pred = clf.predict(X_test)
        
        # Calculate accuracy        
        accuracy = accuracy_score(y_test, y_pred)
   

        test_data = pd.read_csv(r"C:\Users\OS23H\OneDrive\Desktop\project\server\Testing_Predict.csv")
        
        testx=test_data[cols]
        testy=test_data['prognosis']

        
        testscore=clf.score(testx,testy)

        # Predict disease based on input symptoms
        for k, symptom in enumerate(getsymp):
            if symptom in symptoms:
                l2[k] = 1
        
        for k, symptom in enumerate(pastdata):
            if symptom in symptoms:
                l2[k] = 1

        input_data = [l2]  # Convert to Python list
        print("Input Data for Prediction:", input_data)  
        predicted_disease_label = clf.predict(input_data)[0]
        print("Predicted Disease Label:", predicted_disease_label)  

        return jsonify({'predicted_disease': predicted_disease_label, 'accuracy': accuracy}), 200

    except Exception as e:
        # Log the exception details
        print("Exception:", str(e))
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


'''********************** Fetching symptoms  *******************************'''
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

@app.route('/getpastdata', methods=['GET'])
def get_past_history():
    try:
        username = request.args.get('username')
        print(username)

        if not username:
            return jsonify({'error': 'Username not provided'}), 400

        # Assuming you have a field 'Name' in the collection to match with the username
        user_data = patient_data.find_one({'Name': username})

        if not user_data:
            return jsonify({'error': 'User not found'}), 404

        # Extract and return past history data
        past_history = {
            'Sno': user_data.get('Sno'),
            'Name': user_data.get('Name'),
            'Age': user_data.get('Age'),
            'Sex': user_data.get('Sex'),
            'Dates': user_data.get('Dates'),
            'Description': user_data.get('Description'),
            'Medical_specialty': user_data.get('Medical_specialty'),
            'Sample_name': user_data.get('Sample_name'),
            'Transcription': user_data.get('Transcription'),
            'Keywords': user_data.get('Keywords')
            # Add more fields if needed
        }

        return jsonify(past_history), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)


