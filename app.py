from flask import Flask, render_template, request
from database import get_db, close_db

app = Flask(__name__, static_url_path="/static")
app.teardown_appcontext(close_db)
app.config["SECRET-KEY"] = "this-is-my-secret-key"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/game")
def game():
    return render_template("game.html")

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])

@app.route("/how_to_play")
def how_to_play():
    return render_template("howToPlay.html")

@app.route("/add_to_leaderboard", methods=["POST"])
def add_to_leaderboard():
    score = int(request.form["score"])
    username = request.form["name"]
    db = get_db()
    db.execute("""INSERT INTO leaderboard (username, score) VALUES (?, ?)""", (username, score))
    db.commit()
    return "success"

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    leaderboard = db.execute("""SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10;""").fetchall()
    return render_template("leaderboard.html", leaderboard=leaderboard)

