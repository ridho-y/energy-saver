from flask import Flask, request
from json import dumps
from flask_cors import CORS
from calculator import calculate;

app = Flask(__name__)
CORS(app)

app.config['TRAP_HTTP_EXCEPTIONS'] = True

@app.route('/', methods=['POST'])
def form_data():
    data = request.get_json()
    return(dumps(calculate(data)))

@app.route('/test')
def index():
  return dumps({'hello': 'world'})

if __name__ == "__main__":
  app.run(port=5000)

