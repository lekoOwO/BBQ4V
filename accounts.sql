SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+08:00";

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(10000) COLLATE utf8_unicode_ci NOT NULL,
  `password` CHAR(64) NOT NULL COLLATE 'utf8_unicode_ci',
  `role` text COLLATE utf8_unicode_ci NOT NULL DEFAULT 'guest' COMMENT '角色權限',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `accounts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;