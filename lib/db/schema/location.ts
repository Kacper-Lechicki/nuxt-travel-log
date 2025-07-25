import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { user } from './auth';

export const location = sqliteTable('location', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertLocation = createInsertSchema(location, {
  name: z.string({
    error: field => field.input === undefined ? 'Name is required.' : 'Invalid value.',
  }).min(1, 'Name is required.').max(100, 'Name must be less than 100 characters.'),
  description: z.string().max(1000, 'Description must be less than 1000 characters.').optional(),
  lat: z.number({
    error: field => field.input === undefined ? 'Latitude is required.' : 'Invalid value.',
  }).min(-90, 'Latitude must be between -90 and 90.').max(90, 'Latitude must be between -90 and 90.'),
  long: z.number({
    error: field => field.input === undefined ? 'Longitude is required.' : 'Invalid value.',
  }).min(-180, 'Longitude must be between -180 and 180.').max(180, 'Longitude must be between -180 and 180.'),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
