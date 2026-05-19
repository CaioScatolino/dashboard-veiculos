import { mysqlTable, AnyMySqlColumn, primaryKey, unique, int, varchar, text, timestamp, foreignKey, decimal, bigint, tinyint } from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

export const games = mysqlTable("games", {
	id: int().autoincrement().notNull(),
	externalId: varchar("external_id", { length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	thumbUrl: text("thumb_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "games_id"}),
	unique("games_external_id_unique").on(table.externalId),
]);

export const gastosVeiculo = mysqlTable("gastos_veiculo", {
	id: int().autoincrement().notNull(),
	veiculoId: int("veiculo_id").notNull().references(() => veiculos.id),
	descricao: varchar({ length: 255 }).notNull(),
	valor: decimal({ precision: 10, scale: 2 }).notNull(),
	caminhoImagem: varchar("caminho_imagem", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	estabelecimento: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "gastos_veiculo_id"}),
]);

export const shoppingItems = mysqlTable("shopping_items", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id),
	name: varchar({ length: 255 }).notNull(),
	quantity: int().default(1),
	bought: tinyint().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "shopping_items_id"}),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	telegramId: bigint("telegram_id", { mode: "number" }).notNull(),
	username: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	context: varchar({ length: 50 }).default('main'),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("users_telegram_id_unique").on(table.telegramId),
]);

export const veiculos = mysqlTable("veiculos", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id),
	placa: varchar({ length: 20 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	statusAtivo: tinyint("status_ativo").default(1),
},
(table) => [
	primaryKey({ columns: [table.id], name: "veiculos_id"}),
]);

export const wishlists = mysqlTable("wishlists", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	gameId: int("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	lastPrice: decimal("last_price", { precision: 10, scale: 2 }),
	notifiedAt: timestamp("notified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "wishlists_id"}),
]);

export const gastosVeiculoRelations = relations(gastosVeiculo, ({one}) => ({
	veiculo: one(veiculos, {
		fields: [gastosVeiculo.veiculoId],
		references: [veiculos.id]
	}),
}));

export const veiculosRelations = relations(veiculos, ({one, many}) => ({
	gastosVeiculos: many(gastosVeiculo),
	user: one(users, {
		fields: [veiculos.userId],
		references: [users.id]
	}),
}));

export const shoppingItemsRelations = relations(shoppingItems, ({one}) => ({
	user: one(users, {
		fields: [shoppingItems.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shoppingItems: many(shoppingItems),
	veiculos: many(veiculos),
	wishlists: many(wishlists),
}));

export const wishlistsRelations = relations(wishlists, ({one}) => ({
	game: one(games, {
		fields: [wishlists.gameId],
		references: [games.id]
	}),
	user: one(users, {
		fields: [wishlists.userId],
		references: [users.id]
	}),
}));

export const gamesRelations = relations(games, ({many}) => ({
	wishlists: many(wishlists),
}));
