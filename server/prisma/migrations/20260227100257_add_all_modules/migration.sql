-- CreateTable
CREATE TABLE "financial_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "monthly_income" REAL NOT NULL DEFAULT 0,
    "monthly_expenses" REAL NOT NULL DEFAULT 0,
    "current_balance" REAL NOT NULL DEFAULT 0,
    "risk_score" REAL NOT NULL DEFAULT 0,
    "stress_level" TEXT NOT NULL DEFAULT 'LOW',
    "last_assessed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "financial_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "transaction_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stress_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "assigned_employee_id" TEXT,
    "alert_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'LOW',
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "stress_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stress_alerts_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shield_checkins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employee_id" TEXT NOT NULL,
    "stress_score" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "notes" TEXT,
    "difficult_cases_count" INTEGER NOT NULL DEFAULT 0,
    "peer_support_requested" BOOLEAN NOT NULL DEFAULT false,
    "shift_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shield_checkins_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sage_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "sage_response" TEXT NOT NULL,
    "helpful" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sage_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "interest_rate" REAL NOT NULL,
    "processing_fee" REAL NOT NULL DEFAULT 0,
    "annual_fee" REAL NOT NULL DEFAULT 0,
    "prepayment_penalty" REAL NOT NULL DEFAULT 0,
    "min_amount" REAL NOT NULL DEFAULT 0,
    "max_amount" REAL NOT NULL DEFAULT 0,
    "risk_level" TEXT NOT NULL DEFAULT 'LOW',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_comparisons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "total_cost" REAL NOT NULL,
    "hidden_fees_total" REAL NOT NULL DEFAULT 0,
    "better_alternative_id" TEXT,
    "reasoning" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_comparisons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "financial_products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_comparisons_better_alternative_id_fkey" FOREIGN KEY ("better_alternative_id") REFERENCES "financial_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "details" TEXT,
    "ip_address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_profiles_user_id_key" ON "financial_profiles"("user_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_category_idx" ON "transactions"("category");

-- CreateIndex
CREATE INDEX "transactions_transaction_date_idx" ON "transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "stress_alerts_user_id_idx" ON "stress_alerts"("user_id");

-- CreateIndex
CREATE INDEX "stress_alerts_assigned_employee_id_idx" ON "stress_alerts"("assigned_employee_id");

-- CreateIndex
CREATE INDEX "stress_alerts_status_idx" ON "stress_alerts"("status");

-- CreateIndex
CREATE INDEX "stress_alerts_severity_idx" ON "stress_alerts"("severity");

-- CreateIndex
CREATE INDEX "shield_checkins_employee_id_idx" ON "shield_checkins"("employee_id");

-- CreateIndex
CREATE INDEX "shield_checkins_shift_date_idx" ON "shield_checkins"("shift_date");

-- CreateIndex
CREATE INDEX "sage_conversations_user_id_idx" ON "sage_conversations"("user_id");

-- CreateIndex
CREATE INDEX "sage_conversations_topic_idx" ON "sage_conversations"("topic");

-- CreateIndex
CREATE INDEX "financial_products_type_idx" ON "financial_products"("type");

-- CreateIndex
CREATE INDEX "financial_products_provider_idx" ON "financial_products"("provider");

-- CreateIndex
CREATE INDEX "financial_products_is_active_idx" ON "financial_products"("is_active");

-- CreateIndex
CREATE INDEX "product_comparisons_user_id_idx" ON "product_comparisons"("user_id");

-- CreateIndex
CREATE INDEX "product_comparisons_product_id_idx" ON "product_comparisons"("product_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_idx" ON "audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
