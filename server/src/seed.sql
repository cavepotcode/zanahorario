truncate table "timesheet", "project", "user";
ALTER SEQUENCE user_id_seq RESTART;
ALTER SEQUENCE timesheet_id_seq RESTART;
ALTER SEQUENCE project_id_seq RESTART;

insert into "user" (email, "createdAt", initials, name, password) values
  ('testuser1@cavepot.com', '2019-07-01', 'T1', 'Test User1', 'aec8359f274aba675b2730dd3f29b734df19c33a900131e0f88b8db730d4e0df'),
  ('testuser2@cavepot.com', '2019-07-01', 'T2', 'Test User2','aec8359f274aba675b2730dd3f29b734df19c33a900131e0f88b8db730d4e0df'),
  ('testuser3@cavepot.com', '2019-07-01', 'T3', 'Test User3', 'aec8359f274aba675b2730dd3f29b734df19c33a900131e0f88b8db730d4e0df')
;

insert into project (name, description) values
  ('Project I', ''),
  ('Project II', ''),
  ('Project III', '')
;

insert into timesheet (date, hours, project_id, user_id) values
  (now(), 8, 1, 1),
  (now(), 8, 1, 2),
  (now(), 8, 1, 3)
;
