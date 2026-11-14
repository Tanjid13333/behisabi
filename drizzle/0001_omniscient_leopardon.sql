CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`dueDate` timestamp NOT NULL,
	`status` enum('upcoming','paid','overdue') NOT NULL DEFAULT 'upcoming',
	`recurring` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` varchar(80) NOT NULL,
	`month` varchar(7) NOT NULL,
	`limitAmount` decimal(14,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emiPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`installmentAmount` decimal(14,2) NOT NULL,
	`tenureMonths` int NOT NULL,
	`nextDueDate` timestamp NOT NULL,
	`paidInstallments` int NOT NULL DEFAULT 0,
	`remainingLiability` decimal(14,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emiPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(120) NOT NULL,
	`targetAmount` decimal(14,2) NOT NULL,
	`currentAmount` decimal(14,2) NOT NULL DEFAULT '0.00',
	`deadline` timestamp,
	`status` enum('active','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`direction` enum('given','taken') NOT NULL,
	`person` varchar(120) NOT NULL,
	`principal` decimal(14,2) NOT NULL,
	`repaid` decimal(14,2) NOT NULL DEFAULT '0.00',
	`dueDate` timestamp,
	`status` enum('active','settled') NOT NULL DEFAULT 'active',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savingsPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`kind` enum('savings','dps') NOT NULL,
	`targetAmount` decimal(14,2) NOT NULL,
	`currentAmount` decimal(14,2) NOT NULL DEFAULT '0.00',
	`maturityDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savingsPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`walletId` int NOT NULL,
	`kind` enum('income','expense') NOT NULL,
	`title` varchar(120) NOT NULL,
	`category` varchar(80) NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`note` text,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(80) NOT NULL,
	`kind` varchar(40) NOT NULL DEFAULT 'cash',
	`openingBalance` decimal(14,2) NOT NULL DEFAULT '0.00',
	`color` varchar(16) NOT NULL DEFAULT '#0E2C22',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
