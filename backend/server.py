from flask import Flask, request
from json import dumps
from flask_cors import CORS
from calculator import calculate;
import config

app = Flask(__name__)
CORS(app)

app.config['TRAP_HTTP_EXCEPTIONS'] = True

@app.route('/', methods=['POST'])
def form_data():
    data = request.get_json()
    return(dumps(calculate(data)))

if __name__ == "__main__":
    app.run(port=config.port)

