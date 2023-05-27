from flask import Flask
from json import dumps

app = Flask(__name__)

@app.route('/')
def index():
  return dumps({'hello': 'wow'})

if __name__ == '__main__':
  app.run(port=5000)
