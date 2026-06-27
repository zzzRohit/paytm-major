INSERT INTO "User" ("name", "email", "phone", "password")
VALUES (
  'Test User',
  'testuser@example.com',
  '9876543210',
  '$2b$10$dDdKPiwoFNDQfr8WhlTfe.iRAmLr4SmD86bIUgnF5E05fxub39ZwG'
)
ON CONFLICT ("phone") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "email" = EXCLUDED."email",
  "password" = EXCLUDED."password";
