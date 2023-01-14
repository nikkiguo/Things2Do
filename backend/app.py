from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return {
        'res': 'hello world'
    }


def run():
    app.run(host='0.0.0.0', port=8080)


if __name__ == '__main__':
    run()