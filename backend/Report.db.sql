BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "roles" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "departments" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"department_name"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"user_name"	text,
	"password"	text,
	"employee_name"	text,
	"email"	text,
	"role_id"	integer,
	"department_id"	integer,
	CONSTRAINT "fk_users_department" FOREIGN KEY("department_id") REFERENCES "departments"("id"),
	CONSTRAINT "fk_roles_users" FOREIGN KEY("role_id") REFERENCES "roles"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "status" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"status_name"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "employees" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"employee_name"	text,
	"email"	text,
	"user_id"	integer,
	"role_id"	integer,
	"department_id"	integer,
	CONSTRAINT "fk_users_employee" FOREIGN KEY("user_id") REFERENCES "users"("id"),
	CONSTRAINT "fk_employees_department" FOREIGN KEY("department_id") REFERENCES "departments"("id"),
	CONSTRAINT "fk_roles_employee" FOREIGN KEY("role_id") REFERENCES "roles"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "file_uploads" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	"size"	integer,
	"type"	text,
	"content"	blob,
	"path"	text,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "report_problems" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"notification_date"	datetime,
	"pending_date"	datetime,
	"complete_date"	datetime,
	"end_date"	datetime,
	"heading"	text,
	"description"	text,
	"employee_id"	integer,
	"status_id"	integer,
	"department_id"	integer,
	"file_upload_id"	integer,
	CONSTRAINT "fk_report_problems_status" FOREIGN KEY("status_id") REFERENCES "status"("id"),
	CONSTRAINT "fk_report_problems_department" FOREIGN KEY("department_id") REFERENCES "departments"("id"),
	CONSTRAINT "fk_report_problems_file_upload" FOREIGN KEY("file_upload_id") REFERENCES "file_uploads"("id"),
	CONSTRAINT "fk_report_problems_employee" FOREIGN KEY("employee_id") REFERENCES "employees"("id"),
	PRIMARY KEY("id")
);
INSERT INTO "roles" VALUES (1,'2023-06-08 13:10:24.491432+07:00','2023-06-08 13:10:24.491432+07:00',NULL,'employee');
INSERT INTO "roles" VALUES (2,'2023-06-08 13:10:24.5002388+07:00','2023-06-08 13:10:24.5002388+07:00',NULL,'admin');
INSERT INTO "departments" VALUES (1,'2023-06-08 13:10:24.4508627+07:00','2023-06-08 13:10:24.4508627+07:00',NULL,'บุคคล');
INSERT INTO "departments" VALUES (2,'2023-06-08 13:10:24.4588162+07:00','2023-06-08 13:10:24.4588162+07:00',NULL,'ลูกค้าสัมพันธ์');
INSERT INTO "departments" VALUES (3,'2023-06-08 13:10:24.4670901+07:00','2023-06-08 13:10:24.4670901+07:00',NULL,'บัญชี/การเงิน');
INSERT INTO "departments" VALUES (4,'2023-06-08 13:10:24.4752311+07:00','2023-06-08 13:10:24.4752311+07:00',NULL,'การตลาด');
INSERT INTO "departments" VALUES (5,'2023-06-08 13:10:24.483154+07:00','2023-06-08 13:10:24.483154+07:00',NULL,'IT');
INSERT INTO "users" VALUES (1,'2023-06-08 13:10:26.8536142+07:00','2023-06-08 13:10:26.8536142+07:00',NULL,'B111','$2a$14$prUAJT2.h5kgPhZYtRpRNuGQZX5e9M0bU2orbIQ/IBcDmDlXAt7Ra','','',1,1);
INSERT INTO "users" VALUES (2,'2023-06-08 13:10:26.8640828+07:00','2023-06-08 13:10:26.8640828+07:00',NULL,'B222','$2a$14$VaW1qXhd5K.UcS0Wq/omv.mbig.T1Uu6HcIpNRK8Kpu3qc9C2j2Te','','',2,5);
INSERT INTO "status" VALUES (1,'2023-06-08 13:10:24.417068+07:00','2023-06-08 13:10:24.417068+07:00',NULL,'Send request');
INSERT INTO "status" VALUES (2,'2023-06-08 13:10:24.4256734+07:00','2023-06-08 13:10:24.4256734+07:00',NULL,'Pending');
INSERT INTO "status" VALUES (3,'2023-06-08 13:10:24.434038+07:00','2023-06-08 13:10:24.434038+07:00',NULL,'Complete');
INSERT INTO "status" VALUES (4,'2023-06-08 13:10:24.4422015+07:00','2023-06-08 13:10:24.4422015+07:00',NULL,'End');
INSERT INTO "employees" VALUES (1,'2023-06-08 13:10:26.8718982+07:00','2023-06-08 13:10:26.8718982+07:00',NULL,'Jirawat','jirawatkeng086@gmail.com',1,1,1);
INSERT INTO "employees" VALUES (2,'2023-06-08 13:10:26.8801537+07:00','2023-06-08 13:10:26.8801537+07:00',NULL,'จิรวัฒน์','keng-085@hotmail.com',2,2,5);
INSERT INTO "file_uploads" VALUES (1,'2023-06-08 13:10:26.8878924+07:00','2023-06-08 13:10:26.8878924+07:00',NULL,'file1.txt',1000,'text/plain','This is a test file','');
INSERT INTO "report_problems" VALUES (1,'2023-06-08 13:10:26.8960037+07:00','2023-06-08 13:10:26.8960037+07:00',NULL,'2023-06-08 13:10:26.894013+07:00','0001-01-01 00:00:00+00:00','0001-01-01 00:00:00+00:00','0001-01-01 00:00:00+00:00','กรอกหัวข้อ','กรอกรายละเอียด',1,1,1,1);
CREATE INDEX IF NOT EXISTS "idx_roles_deleted_at" ON "roles" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_departments_department_name" ON "departments" (
	"department_name"
);
CREATE INDEX IF NOT EXISTS "idx_departments_deleted_at" ON "departments" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_user_name" ON "users" (
	"user_name"
);
CREATE INDEX IF NOT EXISTS "idx_users_deleted_at" ON "users" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_status_name" ON "status" (
	"status_name"
);
CREATE INDEX IF NOT EXISTS "idx_status_deleted_at" ON "status" (
	"deleted_at"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_employees_employee_name" ON "employees" (
	"employee_name"
);
CREATE INDEX IF NOT EXISTS "idx_employees_deleted_at" ON "employees" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_file_uploads_deleted_at" ON "file_uploads" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_report_problems_deleted_at" ON "report_problems" (
	"deleted_at"
);
COMMIT;
