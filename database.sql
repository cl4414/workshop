DROP TABLE IF EXISTS counter;
CREATE TABLE counter (
  id int(11) NOT NULL,
  value int(11) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO counter VALUES (1,0);
