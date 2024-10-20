CREATE TABLE IF NOT EXISTS "report_requests" (
    "report_id" INTEGER PRIMARY KEY,
    "region" TEXT,
    "product" TEXT,
    "mode" TEXT,
    "value_end_use" INTEGER,
    "value_first_use" INTEGER,
    "value_mining" INTEGER,
    "value_recycling" INTEGER,
    "value_refining" INTEGER,
    "contribution_input" INTEGER,
    "contribution_value_added" INTEGER,
    "effect_direct_effect" INTEGER,
    "effect_first_round" INTEGER,
    "effect_income_effect" INTEGER,
    "effect_industrial_support" INTEGER
);