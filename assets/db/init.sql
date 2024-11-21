CREATE DATABASE `web-client`;
CREATE USER `web-client` @'%' IDENTIFIED BY 'web-client';
GRANT ALL ON `web-client`.* TO `web-client` @'%';
--
CREATE DATABASE accounts;
CREATE USER 'accounts' @'%' IDENTIFIED BY 'accounts';
GRANT ALL ON accounts.* TO 'accounts' @'%';