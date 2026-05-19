-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`external_id` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`thumb_url` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `games_id` PRIMARY KEY(`id`),
	CONSTRAINT `games_external_id_unique` UNIQUE(`external_id`)
);
--> statement-breakpoint
CREATE TABLE `gastos_veiculo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`veiculo_id` int NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`caminho_imagem` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`estabelecimento` varchar(255) NOT NULL,
	CONSTRAINT `gastos_veiculo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shopping_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`quantity` int DEFAULT 1,
	`bought` tinyint(1) DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `shopping_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`telegram_id` bigint NOT NULL,
	`username` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`context` varchar(50) DEFAULT 'main',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_telegram_id_unique` UNIQUE(`telegram_id`)
);
--> statement-breakpoint
CREATE TABLE `veiculos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`placa` varchar(20) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`status_ativo` tinyint(1) DEFAULT 1,
	CONSTRAINT `veiculos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`game_id` int NOT NULL,
	`last_price` decimal(10,2),
	`notified_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `gastos_veiculo` ADD CONSTRAINT `gastos_veiculo_veiculo_id_veiculos_id_fk` FOREIGN KEY (`veiculo_id`) REFERENCES `veiculos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shopping_items` ADD CONSTRAINT `shopping_items_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `veiculos` ADD CONSTRAINT `veiculos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
*/