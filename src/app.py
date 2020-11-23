from dotenv import load_dotenv
from os import getenv
from flask import Flask, render_template, request, flash, make_response, url_for, session
from flask_session import Session
import os
from flask import send_from_directory
import re
from bcrypt import gensalt, hashpw, checkpw
from datetime import datetime

from redis import Redis
db = Redis(host='redis', port=6379, db=0)

load_dotenv()
SESSION_TYPE = 'redis'
SESSION_REDIS = db
app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = getenv('SECRET_KEY')
ses = Session(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/sender/sign-up', methods=['GET'])
def sender_signup_get():
    return render_template('sender-signup.html')


@app.route('/sender/sign-up', methods=['POST'])
def sender_signup_post():
    user = {}
    user["firstname"] = request.form.get('firstname')
    user["lastname"] = request.form.get('lastname')
    user["login"] = request.form.get('login')
    user["email"] = request.form.get('email')
    user["password"] = request.form.get('password')
    user["repassword"] = request.form.get('repassword')
    user["address"] = request.form.get('address')

    if validate_signup_form(user):
        return register_user(user)
    else:
        return redirect(url_for('sender_signup_get'))


@app.route('/sender/login', methods=['GET'])
def sender_login_get():
    return render_template('sender-login.html')


@app.route('/sender/login', methods=['POST'])
def sender_login_post():
    login = request.form.get('login')
    password = request.form.get('password')

    if not login or not password:
        flash("no login or password")
        return redirect(url_for('sender_login_get'))
    if not verify_user(login, password):
        flash("invalid login and/or password")
        return redirect(url_for('sender_login_get'))

    flash(f"Welcome {login}")
    session['login'] = login
    session['timestamp'] = datetime.now()
    return redirect(url_for('index'))

@app.route('/sender/logout')
def sender_logout():
    session.clear()
    flash("You were logged out")
    return redirect(url_for('index'))


@app.route('/dashboard')
def dashboard_get():
    if not session.get('login'):
        flash("You have to be logged in to view dashboard")
        return redirect(url_for('sender_login_get'))
    
    return render_template('dashboard.html')

@app.route('/checkuser/<login>')
def check_user(login):
    if not is_user(login):
        return make_response('available', 200)
    else:
        return make_response('taken', 200)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'), 'inPoster.png')


def validate_signup_form(user):
    PL = 'ĄĆĘŁŃÓŚŹŻ'
    pl = 'ąćęłńóśźż'

    valid = True
    if not user["firstname"]:
        valid = False
        flash("No firstname provided")
    elif not re.compile(f'[A-Z{PL}][a-z{pl}]+').match(user["firstname"]):
        valid = False
        flash("Invalid firstname provided")

    if not user["lastname"]:
        valid = False
        flash("No lastname provided")
    elif not re.compile(f'[A-Z{PL}][a-z{pl}]+').match(user["lastname"]):
        valid = False
        flash("Invalid lastname provided")

    if not user["login"]:
        valid = False
        flash("No login provided")
    elif not re.compile('[a-z]{3,12}').match(user["login"]):
        valid = False
        flash("Invalid lastname provided")
    elif is_user(user["login"]):
        valid = False
        flash("User already exists")

    if not user["email"]:
        valid = False
        flash("No email provided")
    elif not re.compile('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$').match(user["email"]):
        valid = False
        flash("Invalid email provided")

    if not user["password"]:
        valid = False
        flash("No password provided")
    elif not re.compile('.{8,}').match(user["password"].strip()):
        valid = False
        flash("Invalid password provided")

    if not user["repassword"]:
        valid = False
        flash("No repassword provided")
    elif not user["password"] == user["repassword"]:
        valid = False
        flash("Invalid repassword provided")

    if not user["address"]:
        valid = False
        flash("No address provided")
    # regex should be added later

    return valid


def verify_user(login, given_password):
    given_password = given_password.encode('utf-8')
    real_password = db.hget(f"user:{login}", "password")
    if not real_password:
        print(f"ERROR: not password for user {login}")
        return False
    return checkpw(given_password, real_password)


def is_user(login):
    return db.hexists(f"user:{login}", "password")


def redirect(url, status=301):
    response = make_response('', status)
    response.headers['Location'] = url
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


def register_user(user):
    db.hset(f"user:{user['login']}", "firstname", user["firstname"])
    db.hset(f"user:{user['login']}", "lastname", user["lastname"])
    db.hset(f"user:{user['login']}", "address", user["address"])
    db.hset(f"user:{user['login']}", "email", user["email"])

    hashed = hashpw(user["password"].encode('utf-8'), gensalt(5))
    db.hset(f"user:{user['login']}", "password", hashed)

    return redirect(url_for('sender_login_get'))


if __name__ == '__main__':
    app.run(debug=False)
    #app.run(debug=True, host='0.0.0.0', port=5000)
