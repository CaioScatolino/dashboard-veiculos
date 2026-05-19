import { relations } from "drizzle-orm/relations";
import { veiculos, gastosVeiculo, users, shoppingItems, games, wishlists } from "./schema";

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