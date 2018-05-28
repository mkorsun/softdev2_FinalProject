import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
from utils.db_func import validate, hasUser

USER_SESSION = "logged_in"

app = Flask(__name__)
app.secret_key = os.urandom(64)

def is_logged():
    return USER_SESSION in session

def add_session(username, password):
    if validate(username, password):
        session[USER_SESSION] = username
        return True
    else:
        flash("Incorrect login credentials")
        return False

@app.route('/')
def root():
    return render_template('home.html', is_logged = is_logged())

@app.route('/diagram')
def diagram():
    return render_template('diagram.html', is_logged = is_logged())

@app.route('/login', methods = ['POST','GET'])
def login():
    if is_logged():
        return redirect(url_for("root"))
    elif (request.method == "GET"):
        return render_template("login.html")
    else:
        name = request.form["username"]
        password = request.form["password"]
        if request.form["form"] == "Login":
            if add_session(name, password):
                return redirect(url_for("root"))
        else:
            if(password != request.form["confirm_password"]):
                flash("Password and Confirm Password did not match")
            elif hasUser(name):
                flash("Username has been taken")
            else:
                flash("Account creation successful")
    return render_template("login.html")

if __name__ == '__main__':
    app.debug = False
    app.run()
