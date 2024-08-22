from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# API URL to fetch university data
API_URL = "http://universities.hipolabs.com/search"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search_universities():
    country = request.args.get('country')
    state_province = request.args.get('state_province')
    
    # Fetch data from the API
    params = {'country': country}
    response = requests.get(API_URL, params=params)
    data = response.json()

    # Filter by state-province if provided
    if state_province:
        data = [uni for uni in data if uni.get('state-province') == state_province]

    # Extract unique state/province values for dropdown
    unique_provinces = sorted(set([uni.get('state-province') for uni in data if uni.get('state-province')]))

    return jsonify({'universities': data, 'provinces': unique_provinces})

if __name__ == '__main__':
    app.run(debug=True,port=8000, host='0.0.0.0')
