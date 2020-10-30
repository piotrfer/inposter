from flask import Flask, render_template
import os
from flask import send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sender/sign-up/')
def sender_signup():
    return render_template('sender-signup.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'), 'inPoster.png')

if __name__ == '__main__':
    app.run(debug=False)
    #app.run(debug=True, host='0.0.0.0', port=5000)