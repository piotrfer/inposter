from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sender/sign-up/')
def sender_signup():
    return render_template('sender-signup.html')


if __name__ == '__main__':
    app.run(debug=True)
    #app.run(debug=True, host='0.0.0.0', port=5000)