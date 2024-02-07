import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username"),
    email: text("email").notNull(),
    password: text("password").notNull(),
    image: text("image"),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  },
);

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  createdBy: integer("createdBy").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  userId: integer("userId").references(() => users.id),
  groupId: integer("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  payerId: integer("payerId")
    .notNull()
    .references(() => groupMembers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  billId: integer("billId")
    .notNull()
    .references(() => bills.id, { onDelete: "cascade" }),
  payerId: integer("payerId")
    .notNull()
    .references(() => groupMembers.id, { onDelete: "cascade" }),
  amount: decimal("amount").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
