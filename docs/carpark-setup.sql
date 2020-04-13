-- Create database and user then grant priviledges to created user to database
-- INSERT INTO mysql.user (User,Host,authentication_string,ssl_cipher,x509_issuer,x509_subject) VALUES('admin','localhost',PASSWORD('Pa$$word1'),'','','');
-- FLUSH PRIVILEDGES;
-- CREATE DATABASE carpark;
-- GRANT ALL PRIVILEGES ON carpark.* TO 'admin'@'localhost' IDENTIFIED BY 'Pa$$word1';

USE carpark;

-- Create tables
CREATE TABLE IF NOT EXISTS `users` ( 
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `username` VARCHAR(25) NOT NULL, 
    `password` VARCHAR(255), 
    `salt` VARCHAR(25), 
    `firstName` VARCHAR(25), 
    `lastname` VARCHAR(25), 
    `userType` VARCHAR(25), 
    `lastLogin` DATETIME, 
    PRIMARY KEY (`id`) );

CREATE TABLE IF NOT EXISTS `tickets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `ticketNumber` VARCHAR(25), 
    `ticketType` VARCHAR(25),
    `description` VARCHAR(25),
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME, 
    `status` VARCHAR(25), 
    `rate` FLOAT, 
    `ticketCost` FLOAT, 
    `balance` FLOAT,
    `username` VARCHAR(25),
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `specialTickets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `vehicleRegistration` VARCHAR(7),
    `ticketType` VARCHAR(25), 
    `description` VARCHAR(25),
    `startDate` DATETIME, 
    `endDate` DATETIME,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME,  
    `rate` FLOAT, 
    `status` VARCHAR(25), 
    `ticketCost` FLOAT, 
    `balance` FLOAT, 
    `noOfVisits` SMALLINT UNSIGNED,
    `username` VARCHAR(25),
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `receipts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `receiptNumber` VARCHAR(25), --New addition to handle receipts without tickets (Lost tickets) 
    `ticketNumber` VARCHAR(25), 
    `ticketType` VARCHAR(25),
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME, 
    `status` VARCHAR(25), 
    `ticketCost` FLOAT, 
    `amountPaid` FLOAT, 
    `balance` FLOAT, 
    `amountDue` FLOAT, 
    `paymentMethod` VARCHAR(25), 
    `chequeNumber` VARCHAR(25), 
    `username` VARCHAR(25),
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `ticketType` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `ticketType` VARCHAR(25), 
    `unitCost` FLOAT, 
    `status` VARCHAR(25),
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `displayName` VARCHAR(25),
    `description` TEXT,
    `username` VARCHAR(25),
    PRIMARY KEY(`id`) );

-- Insert default data into tables
INSERT INTO `users` ( `username`, `password`, `firstName`, `lastName` ) VALUES ( 'admin', 'admin', 'Admin', 'User' );
INSERT INTO `ticketType` ( `ticketType`, `unitCost`, `status`, `displayName`, `description`, `username` ) VALUES 
    ('hourly', 2.00, 'active', 'Hourly', 'Ticket for regular hourly usage.', 'admin'),
    ('lost', 25.00, 'active', 'Lost Ticket', 'Lost ticket type.', 'admin');