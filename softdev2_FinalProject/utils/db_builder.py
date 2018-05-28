import sqlite3, hashlib   #enable control of an sqlite database

f="../data/lens.db"
db = sqlite3.connect(f) #open if f exists, otherwise create
c = db.cursor()  #facilitate db ops

#==========================================================
def db_gen():
    c.execute("CREATE TABLE IF NOT EXISTS users(id INTEGER, username TEXT, password TEXT)") #create user table
    c.execute("INSERT INTO users VALUES(0, '%s', '%s')" % ('admin', hashlib.sha256('password').hexdigest()))#stick base user into the db

db_gen()
#==========================================================

db.commit() #save changes
db.close()  #close database
