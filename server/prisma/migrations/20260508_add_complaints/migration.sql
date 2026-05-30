-- CreateTable: complaints
CREATE TABLE IF NOT EXISTS "complaints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "channel" TEXT NOT NULL DEFAULT 'APP',
    "attachmentNote" TEXT,
    "resolution" TEXT,
    "assigned_to" TEXT,
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "complaints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "complaints_ticket_number_key" ON "complaints"("ticket_number");
CREATE INDEX IF NOT EXISTS "complaints_user_id_idx" ON "complaints"("user_id");
CREATE INDEX IF NOT EXISTS "complaints_status_idx" ON "complaints"("status");
CREATE INDEX IF NOT EXISTS "complaints_category_idx" ON "complaints"("category");
