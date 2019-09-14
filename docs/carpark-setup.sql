-- Create database and user then grant priviledges to created user to database
-- INSERT INTO mysql.user (User,Host,authentication_string,ssl_cipher,x509_issuer,x509_subject) VALUES('admin','localhost',PASSWORD('Pa$$word1'),'','','');
-- FLUSH PRIVILEDGES;
-- CREATE DATABASE carpark;
-- GRANT ALL PRIVILEGES ON carpark.* TO 'admin'@'localhost' IDENTIFIED BY 'Pa$$word1';

USE carpark;

-- Create tables
CREATE TABLE IF NOT EXISTS `users` ( 
    `id` smallint unsigned not null auto_increment, 
    `username` varchar(20) not null, 
    `password` varchar(255), 
    `salt` varchar(255), 
    `firstName` varchar(20), 
    `lastname` varchar(20), 
    `userType` varchar (20), 
    `lastLogin` varchar (20), 
    PRIMARY KEY (`id`) );

INSERT INTO `users` ( `username`, `password`, `firstName`, `lastName` ) VALUES ( 'admin', 'admin', 'Admin', 'User' );