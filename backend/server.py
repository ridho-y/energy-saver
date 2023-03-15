from flask import Flask, request
from json import dumps
from flask_cors import CORS
import config

app = Flask(__name__)
CORS(app)

app.config['TRAP_HTTP_EXCEPTIONS'] = True

@app.route('/', methods=['POST'])
def form_data():
    request_data = request.get_json()
    print(request_data)
    return(dumps({'Hello': 4}))

if __name__ == "__main__":
    app.run(port=config.port)

