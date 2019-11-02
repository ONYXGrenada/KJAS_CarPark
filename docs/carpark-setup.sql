-- Create database and user then grant priviledges to created user to database
-- INSERT INTO mysql.user (User,Host,authentication_string,ssl_cipher,x509_issuer,x509_subject) VALUES('admin','localhost',PASSWORD('Pa$$word1'),'','','');
-- FLUSH PRIVILEDGES;
-- CREATE DATABASE carpark;
-- GRANT ALL PRIVILEGES ON carpark.* TO 'admin'@'localhost' IDENTIFIED BY 'Pa$$word1';

USE carpark;

-- Create tables
CREATE TABLE IF NOT EXISTS `users` ( 
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `username` TEXT NOT NULL, 
    `password` TEXT, 
    `salt` TEXT, 
    `firstName` TEXT, 
    `lastname` TEXT, 
    `userType` TEXT, 
    `lastLogin` TEXT, 
    PRIMARY KEY (`id`) );

CREATE TABLE IF NOT EXISTS `tickets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `ticketNumber` TEXT, 
    `ticketType` TEXT,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME, 
    `status` TEXT, 
    `rate` REAL, 
    `ticketCost` REAL, 
    `balance` REAL,
    `username` TEXT,
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `specialTickets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `vehicleRegistration` TEXT,
    `ticketType` TEXT, 
    `startDate` DATETIME, 
    `endDate` DATETIME,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME,  
    `rate` REAL, 
    `status` TEXT, 
    `ticketCost` REAL, 
    `balance` REAL, 
    `noOfVisits` SMALLINT,
    `username` TEXT,
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `receipts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `ticketNumber` TEXT, 
    `ticketType` TEXT,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `closedDate` DATETIME, 
    `status` TEXT, 
    `ticketCost` REAL, 
    `amountPaid` REAL, 
    `balance` REAL, 
    `amountDue` REAL, 
    `paymentMethod` TEXT, 
    `chequeNumber` TEXT, 
    `username` TEXT,
    PRIMARY KEY(`id`) );

CREATE TABLE IF NOT EXISTS `ticketType` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, 
    `ticketType` TEXT, 
    `unitCost` REAL, 
    `status` TEXT,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `username` TEXT,
    PRIMARY KEY(`id`) );

-- Insert default data into tables
INSERT INTO `users` ( `username`, `password`, `firstName`, `lastName` ) VALUES ( 'admin', 'admin', 'Admin', 'User' );
INSERT INTO `ticketType` ( `ticketType`, `unitCost`, `status`, `username` ) VALUES ('standard', 2.00, 'active', 'admin');