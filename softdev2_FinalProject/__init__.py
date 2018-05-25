from flask import Flask, render_template, request, redirect, url_for, session, flash
from utils.db_func import validate

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

#this can be moved to root later
@app.route('/loginpage')
def loginpage():
    return render_template('login.html')

@app.route('/login', methods = ['POST','GET'])
def login():
    user = request.form['user']
    passw = request.form['pass']

    result = validate(user, passw)
    print passw

    if result:
        session['user'] = user
        return redirect( url_for('home') )
    else:
        flash('Incorrect username/password. Please try again.')
        return redirect( url_for('loginpage') )

if __name__ == '__main__':
    app.debug = False
    app.run()
