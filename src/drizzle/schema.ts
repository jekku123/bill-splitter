import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
  groups: many(groups),
}));

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.creatorId],
    references: [users.id],
  }),
  groupMembers: many(groupMembers),
  bills: many(bills),
}));

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  userId: integer("user_id"),
  groupId: integer("group_id").notNull(),
});

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

export const groupMembersRelations = relations(
  groupMembers,
  ({ one, many }) => ({
    user: one(users, {
      fields: [groupMembers.userId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [groupMembers.groupId],
      references: [groups.id],
    }),
    payments: many(payments),
    shares: many(shares),
  }),
);

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;

export const billsRelations = relations(bills, ({ one, many }) => ({
  group: one(groups, {
    fields: [bills.groupId],
    references: [groups.id],
  }),
  payments: many(payments, {
    relationName: "payments",
  }),
  shares: many(shares, {
    relationName: "shares",
  }),
}));

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").notNull(),
  payerId: integer("payer_id").notNull(),
  amount: decimal("amount").notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const paymentsRelations = relations(payments, ({ one }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id],
    relationName: "payments",
  }),
  payer: one(groupMembers, {
    fields: [payments.payerId],
    references: [groupMembers.id],
  }),
}));

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").notNull(),
  groupMemberId: integer("group_member_id").notNull(),
  amount: decimal("amount").notNull(),
});

export type Share = typeof shares.$inferSelect;
export type NewShare = typeof shares.$inferInsert;

export const sharesRelations = relations(shares, ({ one }) => ({
  bill: one(bills, {
    fields: [shares.billId],
    references: [bills.id],
    relationName: "shares",
  }),
  member: one(groupMembers, {
    fields: [shares.groupMemberId],
    references: [groupMembers.id],
  }),
}));
