// Keepwise DB schema — Drizzle table definitions, Postgres dialect.
//
// Two layers:
//   1. Better Auth core tables (user/session/account/verification) — schema
//      is dictated by the library; Better Auth's CLI migrate command
//      generates matching SQL from this shape.
//   2. Keepwise domain tables (household / householdMember / item / alert)
//      — our own. All item/alert reads MUST join on householdId so a
//      request authenticated as one user can never read another household's
//      receipts. This is the EOP (elevation-of-privilege) control.

import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  varchar,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

// ---------- Better Auth core tables ---------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- Keepwise domain tables ----------------------------------------

export const household = pgTable(
  "household",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    plan: text("plan", { enum: ["free", "plus"] }).notNull().default("free"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("household_owner_idx").on(t.ownerUserId)],
);

export const householdMember = pgTable(
  "household_member",
  {
    householdId: text("household_id")
      .notNull()
      .references(() => household.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "member"] }).notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.householdId, t.userId] })],
);

export const item = pgTable(
  "item",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .notNull()
      .references(() => household.id, { onDelete: "cascade" }),
    merchant: text("merchant").notNull(),
    merchantInitial: varchar("merchant_initial", { length: 1 }).notNull(),
    itemName: text("item_name").notNull(),
    category: text("category").notNull(),
    total: text("total").notNull(),
    currency: text("currency", { enum: ["USD", "NGN"] }).notNull(),
    purchaseDate: timestamp("purchase_date").notNull(),
    deadline: timestamp("deadline").notNull(),
    deadlineType: text("deadline_type", {
      enum: ["return", "warranty", "custom"],
    }).notNull(),
    status: text("status", {
      enum: ["soon", "covered", "expired", "active"],
    }).notNull(),
    confidence: integer("confidence").notNull(),
    receiptVariant: text("receipt_variant", {
      enum: ["bestbuy", "allbirds", "frametv", "williams", "amazon", "apple"],
    }).notNull(),
    lineItems: jsonb("line_items")
      .$type<Array<{ name: string; price: string }>>()
      .notNull(),
    policyNote: text("policy_note").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("item_household_idx").on(t.householdId),
    index("item_deadline_idx").on(t.deadline),
  ],
);

export const alert = pgTable(
  "alert",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    scheduledFor: timestamp("scheduled_for").notNull(),
    channel: text("channel", { enum: ["email", "in-app"] }).notNull(),
    subject: text("subject").notNull(),
    status: text("status", {
      enum: ["delivered", "queued", "opened"],
    }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("alert_item_idx").on(t.itemId),
    index("alert_status_idx").on(t.status),
  ],
);