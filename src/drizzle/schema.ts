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

export const usersRelations = relations(users, ({ many }) => ({
  groups: many(groups, {
    relationName: "user_groups",
  }),
}));

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.creatorId],
    references: [users.id],
    relationName: "user_groups",
  }),
  groupMembers: many(groupMembers, {
    relationName: "groupMembers",
  }),
  bills: many(bills, {
    relationName: "bills",
  }),
}));

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  userId: integer("user_id"),
  groupId: integer("group_id")
    .references(() => groups.id, { onDelete: "cascade" })
    .notNull(),
});

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
      relationName: "groupMembers",
    }),
    payments: many(payments, {
      relationName: "member_payments",
    }),
    shares: many(shares, {
      relationName: "member_shares",
    }),
  }),
);

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => groups.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const billsRelations = relations(bills, ({ one, many }) => ({
  group: one(groups, {
    fields: [bills.groupId],
    references: [groups.id],
    relationName: "bills",
  }),
  payments: many(payments, {
    relationName: "bill_payments",
  }),
  shares: many(shares, {
    relationName: "bill_shares",
  }),
}));

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .references(() => bills.id, { onDelete: "cascade" })
    .notNull(),
  payerId: integer("payer_id").notNull(),
  amount: decimal("amount").notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id],
    relationName: "bill_payments",
  }),
  payer: one(groupMembers, {
    fields: [payments.payerId],
    references: [groupMembers.id],
    relationName: "member_payments",
  }),
}));

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .references(() => bills.id, { onDelete: "cascade" })
    .notNull(),
  groupMemberId: integer("group_member_id").notNull(),
  amount: decimal("amount").notNull(),
});

export const sharesRelations = relations(shares, ({ one }) => ({
  bill: one(bills, {
    fields: [shares.billId],
    references: [bills.id],
    relationName: "bill_shares",
  }),
  member: one(groupMembers, {
    fields: [shares.groupMemberId],
    references: [groupMembers.id],
    relationName: "member_shares",
  }),
}));

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
export type Share = typeof shares.$inferSelect;
export type NewShare = typeof shares.$inferInsert;
