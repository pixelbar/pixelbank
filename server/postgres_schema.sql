DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX "idx_user_name_unique" ON "user"(name);

DROP TABLE IF EXISTS "product";

CREATE TABLE "product" (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE UNIQUE INDEX "idx_product_code_unique" ON product(code);

