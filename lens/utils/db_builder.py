import sqlite3, hashlib, os, subprocess  #enable control of an sqlite database

basedir = os.path.abspath(os.path.dirname(__file__))
global f
f=basedir+"/../data/lens.db"
#exist = os.path.exists(f)
#make = True

#if (exist):
#	make = False

db=sqlite3.connect(f) #creates db if doesnt exist, and connect
c=db.cursor() #facilitates b ops


#==========================================================
def db_gen():
    c.execute("CREATE TABLE IF NOT EXISTS users(id INTEGER, username TEXT, password TEXT)") #create user table
    c.execute("INSERT INTO users VALUES(0, '%s', '%s')" % ('admin', hashlib.sha256('password').hexdigest()))#stick base user into the db
    c.execute("CREATE TABLE IF NOT EXISTS sessions(hash_id TEXT, id INTEGER, o_dist INTEGER, o_height INTEGER, focus INTEGER, sign INTEGER)")#create session table

#if (make):
db_gen()

#==========================================================

db.commit() #save changes
db.close()  #close database
