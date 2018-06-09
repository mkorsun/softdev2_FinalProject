import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
import utils.db_func as db
import utils.db_builder as builder

os.system("chown www-data:www-data www/lens/lens/data/")
os.system("chown www-data:www-data www/lens/lens/data/lens.db")

USER_SESSION = "logged_in"
DEBUG = False

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
    print request.args
    h = None
    if("h" in request.args):
        h = db.get_session(request.args["h"])
    return render_template('diagram.html', logged = is_logged(), h = h)

@app.route('/profile')
def profle():
    if(not is_logged()):
        return redirect(url_for("login"))
    return render_template('profile.html', logged = is_logged(), username = session[USER_SESSION], sessions = db.get_user_sessions_details(session[USER_SESSION]))

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
    username = request.form["username"]
    focus = request.form["focus"] if request.form["focus"] != 'NaN' else 'null'
    oHeight = request.form["o_height"] if request.form["o_height"] != 'NaN' else 'null'
    oDist = request.form["o_dist"] if request.form["o_dist"] !='NaN' else 'null'
    sign = request.form["sign"] if request.form["sign"] != 'NaN' else 'null'
    if (hashcode == ""):
        print "hash doens't exist"
        db.create_session(username, oDist, oHeight, focus, sign)
        return "Session created"
    elif( db.check_hash(username, hashcode) ):
        print "Checking user"
        db.update_session(hashcode, oDist, oHeight, focus, sign)
        return "Session updated"
    return "Error: You are unable to save because you are not the owner"

if __name__ == '__main__':
    app.debug = DEBUG
    app.run()
