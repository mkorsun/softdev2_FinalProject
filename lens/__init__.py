import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
import utils.db_func as db
import utils.db_builder as builder

USER_SESSION = "logged_in"
DEBUG = True

app = Flask(__name__)
app.secret_key = os.urandom(64)

def is_logged():
    return USER_SESSION in session

def add_session(username, password):
    if db.login(username, password):
        session[USER_SESSION] = username
        return True
    else:
        flash("Incorrect login credentials")
        return False

@app.route('/')
def root():
    return render_template('home.html', logged = is_logged())

@app.route('/diagram')
def diagram():
    return render_template('diagram.html', logged = is_logged())

@app.route('/profile')
def profle():
    if(not is_logged()):
        return redirect(url_for("login"))
    return render_template('profile.html', logged = is_logged(), username = session[USER_SESSION], sessions = db.get_owned_sessions(session[USER_SESSION]))

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
            elif db.does_username_exist(name):
                flash("Username has been taken")
            else:
                db.create_account(name, password)
                flash("Account creation successful")
    return render_template("login.html")

@app.route("/logout")
def logout():
    if is_logged():
        session.pop(USER_SESSION)
    return redirect(url_for("login"))

@app.route("/changepass", methods = ['POST','GET'])
def changepass():
    username = session[USER_SESSION]
    old_pass = request.form["oldpass"]
    new_pass = request.form["newpass"]
    db.change_password(username, old_pass, new_pass)
    flash("Password change successful")
    return redirect(url_for("profile"))

#AJAX CALLS
@app.route("/save", methods = ['POST'])
def save():
    hashcode = request.form["hash"]
    if (hashcode == ""):
        focus = request.form["focus"]
        oHeight = request.form["o_height"]
        oDist = request.form["o_dist"]
        db.create_session(session[USER_SESSION], oDist, oHeight, focus)
        return "Session created"
    elif( check_hash(session[USER_SESSION], hashcode) ):
        focus = request.form["focus"]
        oHeight = request.form["o_height"]
        oDist = request.form["o_dist"]
        db.update_session(hashcode, oDist, oHeight, focus)
        return "Session updated"
    return "Something broke"

if __name__ == '__main__':
    app.debug = DEBUG
    app.run()
