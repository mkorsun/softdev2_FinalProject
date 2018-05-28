import sqlite3, hashlib

f="./data/lens.db"

# Encrypt password - Returns SHA256
def encrypt_password(password):
    encrypted = hashlib.sha256(password).hexdigest()
    return encrypted

# Login - Returns true if successful, false otherwise
def login(username, password):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute("SELECT username, password FROM users WHERE username = '%s'" % (username))
    for account in c:
        print account
        u = account[0]
        p = account[1]
        # Check if usernames and encrypted passwords match
        if username == u and encrypt_password(password) == p:
            return True
    return False

# Create account - Returns true if successful, false otherwise
def create_account(username, password):
    db = sqlite3.connect(f)
    c = db.cursor()
    if not does_username_exist(username):
        # Add user to accounts table
        c.execute("SELECT * FROM users ORDER BY id DESC LIMIT 1")
        user_id = int(c.fetchone()[0]) + 1
        c.execute("INSERT INTO users VALUES(%d, '%s', '%s')" % (user_id, username, encrypt_password(password)))
        db.commit()
        db.close()
        return True
    return False

def does_username_exist(username):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute("SELECT username FROM users WHERE username = '%s'" % (username))
    for account in c:
        return True
    return False