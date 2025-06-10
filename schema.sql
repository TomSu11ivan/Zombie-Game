DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard 
(
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR NOT NULL,
    score INTERGER NOT NULL
);

SELECT * FROM leaderboard ORDER BY score DESC;