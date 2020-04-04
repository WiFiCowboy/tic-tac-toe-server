BEGIN;

  TRUNCATE
  game_users
  RESTART IDENTITY CASCADE;

INSERT INTO game_users
  (user_name, full_name, password, number_wins)
VALUES
  ('Flynn', 'Kevin Flynn', '$2a$12$IRFRlmb9g2jGxZ8nrASa7uroknWQS/sPHt3sOEJSqvVjOtB2vQ1hi', 10),
  ('Clu', 'Jeff Bridges',  '$2a$12$MNe1vrmTgsJTP1Xh75C.buZ3KwoLm2qtXBIapR5kCXKxPWaZv4htK', 25),
  ('Tron', 'Alan Bradly',  '$2a$12$enL5JDU85AD7xSwNkFRPd.1q8h.3hShBvKrxinYpDWbYAwvujZRNq', 50),
  ('Parzival', 'Wade Watts',  '$2a$12$kTmlVcLhgive63ZZ5/F8luOmbCWlV7HZOS4OUSepSzEkuNL95E79O', 75),
  ('Anorak', 'James Halliday',  '$2a$12$Zb8bsV2nO02z2y1SJHZIeeJYQajyM/YQgtzb8ZoS/2M.1BjORbzZe', 100),
  ('WOPR', 'David Lightman',  '$2a$12$Bf0ww.SxN1BdCI8wXbErfuOLho398bGkqZc7QxhFlLRwjQsUb.lOO', 1000);

COMMIT;
