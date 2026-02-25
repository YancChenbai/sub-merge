import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, index, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const sub = pgTable('sub', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar().unique().notNull(),
  name: varchar().unique().notNull(),
  content: text(),
  main: boolean().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [
  index('sub_idx').on(table.id),
  index('sub_name_idx').on(table.name),
])

export const rule = pgTable('rule', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  value: text().unique().notNull(),
  enabled: boolean().notNull().default(true),
  remark: varchar(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [
  index('rule_idx').on(table.id),
])

export const group = pgTable('group', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().unique().notNull(),
  enabled: boolean().notNull().default(true),
  insertProxies: boolean().notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [
  index('group_idx').on(table.id),
])

export const remoteRule = pgTable('remote_rule', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().unique().notNull(),
  url: varchar().notNull(),
  proxy: varchar().default('DIRECT').notNull(),
  enabled: boolean().notNull().default(true),
  content: text(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [
  index('remote_rule_idx').on(table.id),
  index('remote_rule_name_idx').on(table.name),
])

export type Sub = InferSelectModel<typeof sub>
export type Rule = InferSelectModel<typeof rule>
export type Group = InferSelectModel<typeof group>
export type RemoteRule = InferSelectModel<typeof remoteRule>
