from dotenv import load_dotenv
from os import getenv
from flask import Flask, render_template, request, flash, make_response, url_for, session, send_from_directory
import os
import json, requests

load_dotenv()
SERVER_URL = getenv('SERVER_URL')

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = getenv('SECRET_KEY')

service = {}
user_token = ''

@app.before_first_request
def map_service():
    data = json.loads(requests.get('https://inposter-service.herokuapp.com/').text)['_links']
    service['sender'] = data['sender']['href']
    service['labels'] = data['labels']['href']
    service['parcels'] = data['parcels']['href']
    data = json.loads(requests.get(SERVER_URL+service['sender']).text)['_links']
    service['sender-signup'] = data['signup']['href']
    service['sender-login'] = data['login']['href']
    data = json.loads(requests.get(SERVER_URL+service['labels']).text)['_links']
    service['labels-list'] = data['list']['href']
    data = json.loads(requests.get(SERVER_URL+service['parcels']).text)['_links']
    service['parcels-list'] = data['list']['href']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sender/sign-up', methods=['GET', 'POST'])
def sender_signup():
    if request.method == 'GET':
        return render_template('sender-signup.html')
    if request.method == 'POST':
        signup_url = SERVER_URL + service['sender-signup']
        r = requests.post(signup_url, json=request.form)
        if r.status_code != 201:
            if r.text != '' and r.status_code != 500:
                error = json.loads(r.text)['error']
                flash(error)
            return redirect(url_for('sender_signup'))
        else:
            flash("You were registered successfuly")
            return redirect(url_for('sender_login'))

@app.route('/sender/login', methods=['GET', 'POST'])
def sender_login():
    if request.method == 'GET':
        return render_template('sender-login.html')
    if request.method == 'POST':
        login_url = SERVER_URL + service['sender-login']
        r = requests.post(login_url, json=request.form)
        if r.status_code != 200:
            if r.text != '' and r.status_code != 500:
                error = json.loads(r.text)['error']
                flash(error)
            return redirect(url_for('sender_login'))
        else:
            token = 'Bearer ' + json.loads(r.text)['token']
            session["token"] = token
            session["login"] = request.form.get("login")
            flash("You were logged in succesfuly")
            return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard_page():
    if "token" not in session:
        flash("You have to be logged in to view this page")
        return redirect(url_for('sender_login'))
    rl = requests.get(SERVER_URL + service['labels-list'], headers={'Authorization' : session["token"]})
    rp = requests.get(SERVER_URL + service['parcels-list'], headers={'Authorization' : session["token"]})
    labels = []
    parcels = []
    if rl.status_code == 200:
         labels = json.loads(rl.text)['_embedded']['items']
    if rp.status_code == 200: 
        parcels = json.loads(rp.text)['_embedded']['items']
    else:
        if rl.status_code != 500:
            if rl.text != '' :
                    flash(rl.text)
            return redirect(url_for('index'))
        if rp.status_code != 500:
            if rp.text != '' :
                    flash(rp.text)
            return redirect(url_for('index'))
    return render_template('dashboard-list.html', labels=labels, parcels=parcels)

@app.route('/sender/logout')
def sender_logout():
    session.clear()
    flash("You were logged out")
    return redirect(url_for('index'))

@app.route('/labels', methods=['GET', 'POST'])
def label_detail():
    action = request.args.get('a')
    id = request.args.get('id')
    if request.method == 'GET':
        if action == 'details':
            r = requests.get(SERVER_URL+f'/labels/{id}', headers={'Authorization' : session["token"]})
            if r.status_code == 200:
                label = json.loads(r.text)
                return render_template('dashboard-detail.html', label=label)
            else:
                flash(r.text)
                return redirect(url_for('dashboard_page'))
        if action == 'edit':
            r = requests.get(SERVER_URL+f'/labels/{id}', headers={'Authorization' : session["token"]})
            if r.status_code == 200:
                label = json.loads(r.text)
                return render_template('dashboard-edit.html', label=label)
            else:
                flash(r.text)
                return redirect(url_for('dashboard_page'))
        if action == 'delete':
            r = requests.delete(SERVER_URL+f'/labels/{id}',  headers={'Authorization' : session["token"]})
            if r.status_code == 204:
                flash('Label deleted successfuly')
                return redirect(url_for('dashboard_page'))
            else:
                flash(r.text)
                return redirect(url_for('dashboard_page'))
        if action == 'cancel':
            return redirect(url_for('dashboard_page'))
    if request.method == 'POST':
        r = requests.patch(SERVER_URL+f'/labels/{id}', json=request.form, headers={'Authorization' : session["token"]})
        if r.status_code == 200:
            flash("Label updated successfuly")
        else:
            flash(r.text)
        return redirect(f'/labels?a=details&id={id}')

@app.route('/labels/new', methods=['GET', 'POST'])
def label_new():
    if request.method == 'GET':
        return render_template('dashboard-create.html')

    if request.method == 'POST':
        r = requests.post(SERVER_URL+service['labels-list'],json=request.form, headers={'Authorization' : session["token"]})
        if r.status_code == 201:
            flash("Label created successfuly")
            return redirect(url_for('dashboard_page'))
        else:
            flash(r.text)
            return redirect(url_for('dashboard_page'))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'), 'inPoster.png')

def redirect(url, status=301):
    response = make_response('', status)
    response.headers['Location'] = url
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


def is_logged_in():
    return "token" in session

if __name__ == '__main__':
    app.run(debug=True)
