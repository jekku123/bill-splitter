import {
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
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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
    .references(() => users.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
