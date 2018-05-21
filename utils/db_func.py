import sqlite3

f="../data/physics.db"

def validate(username, password):
    db = sqlite3.connect(f)
    c = db.cursor()
    st = c.execute("SELECT count(*) FROM users WHERE username = '%s' AND password = '%s'" % (username, password)).fetchall()[0][0] == 1
    db.commit()
    db.close()
    return st

def hasUser(username):
    db = sqlite3.connect(f)
    c = db.cursor()
    st = c.execute("SELECT count(*) FROM users WHERE username = '%s'" % (username)).fetchall()[0][0] == 1
    db.commit()
    db.close()
    return st
