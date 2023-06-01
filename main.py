from flask import Flask, request, send_from_directory
import json
from answer_questions import answer_question

app = Flask(__name__)

@app.route('/<path:path>')
def serve_static(path):
    # Serve file from public directory
    return send_from_directory('public', path)

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/ask', methods=['POST'])
def ask():
    # Get message from request body
    data = json.loads(request.data)
  
    # Extract transcript and restaurant from data
    transcript = data['transcript']
    restaurant = data['restaurant']
  
    last_message = transcript[-1]["text"]
  
    # Call the answer_question function with last_message and restaurant as arguments
    answer = answer_question(last_message, restaurant)
  
    return str(answer)

@app.errorhandler(Exception)
def error(e):
    print("error: " + str(e))
    print(request.url)
    return "error! " + str(e)

if __name__ == "__main__":
    app.run(host='0.0.0.0')

#construct_base_from_directory("data")
