from flask import Flask, render_template
import os
from flask import send_from_directory
from flask import url_for

app = Flask(__name__)
app.add_url_rule('/favicon.ico',
                 redirect_to=url_for('static', filename='/img/icon.ico'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sender/sign-up/')
def sender_signup():
    return render_template('sender-signup.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'logo.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run(debug=True)
    #app.run(debug=True, host='0.0.0.0', port=5000)