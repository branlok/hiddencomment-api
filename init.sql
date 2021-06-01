
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  created_on timestamp NOT NULL,
  last_login timestamp
);

INSERT INTO users (
     username, password, email, created_on
) VALUES('bee', 'dee', 'bd@bd.com', now());

CREATE TABLE videos (
  video_id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  title VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255) NOT NULL,
  channel VARCHAR(255) NOT NULL,
  created_on timestamp
);

CREATE TABLE comments (
  comment_id SERIAL NOT NULL PRIMARY KEY,
  body VARCHAR(400),
    created_on timestamp,
  user_id INTEGER NOT NULL REFERENCES  users(user_id),
  video_id VARCHAR(50) NOT NULL REFERENCES  videos(video_id),
  reply_to INTEGER,
  num_of_replies INTEGER default 0

);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
