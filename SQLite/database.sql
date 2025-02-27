-- CTRL + SHIFT + Q ---> RUN THE QUERY

-- CREATE TABLE DMS(Week INTEGER NOT NULL PRIMARY KEY, Session1_predicted_label TEXT, Session1_depression_score INTEGER, 
-- Session2_predicted_label TEXT, Session2_depression_score INTEGER, Session3_predicted_label TEXT, Session3_depression_score INTEGER,
-- Final_predicted_label TEXT, Final_depression_score INTEGER);

--.schema DMS

-- .tables

-- CREATE TABLE User_Info(Username TEXT NOT NULL PRIMARY KEY, Name TEXT NOT NULL, Email TEXT NOT NULL, 
-- Password TEXT NOT NULL);

-- .schema User_Info

.tables

SELECT * FROM User_Info;

-- .schema info_NainaS25;

-- SELECT * FROM info_NainaS25;

-- SELECT * FROM User_Info WHERE Username = 'KhushiM25 ';

-- DELETE FROM User_Info

-- DELETE FROM User_Info WHERE Username = 'recruiter25 ';

-- ALTER TABLE User_Info ADD COLUMN IsLoggedIn BOOLEAN;

-- UPDATE User_Info SET IsLoggedIn = FALSE;

-- ALTER TABLE User_Info ADD COLUMN Week INTEGER;

-- UPDATE User_Info SET Week = 0;

-- UPDATE User_Info SET IsLoggedIn = FALSE WHERE Username = 'KhushiM25 ';

-- UPDATE User_Info SET IsLoggedIn = TRUE WHERE Username = 'KhushiM25 ';

-- ALTER TABLE User_Info ADD COLUMN IsChosenExpert BOOLEAN;

-- UPDATE User_Info SET IsChosenExpert = FALSE;

-- ALTER TABLE User_Info ADD COLUMN Expert_Selected TEXT;

UPDATE User_Info SET IsChosenExpert = 0;

DROP TABLE info_aarti;
