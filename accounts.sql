-- --------------------------------------------------------
-- 主機:                           2001:288:3001:412:145b:3fff:fe44:e952
-- 伺服器版本:                        10.4.15-MariaDB - MariaDB Server
-- 伺服器作業系統:                      Linux
-- HeidiSQL 版本:                  11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 傾印 BBQ4V 的資料庫結構
CREATE DATABASE IF NOT EXISTS `BBQ4V` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `BBQ4V`;

-- 傾印  資料表 BBQ4V.account-groups 結構
CREATE TABLE IF NOT EXISTS `account-groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accountId` int(10) unsigned NOT NULL,
  `groupId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_account-groups_accounts` (`accountId`),
  KEY `FK_account-groups_groups` (`groupId`),
  CONSTRAINT `FK_account-groups_accounts` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_account-groups_groups` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 取消選取資料匯出。

-- 傾印  資料表 BBQ4V.accounts 結構
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(10000) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `role` text COLLATE utf8_unicode_ci NOT NULL DEFAULT 'guest' COMMENT '角色權限',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 取消選取資料匯出。

-- 傾印  資料表 BBQ4V.groups 結構
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 取消選取資料匯出。

-- 傾印  資料表 BBQ4V.register-token 結構
CREATE TABLE IF NOT EXISTS `register-token` (
  `token` text NOT NULL DEFAULT uuid(),
  `role` text NOT NULL DEFAULT 'guest',
  `remaining` int(10) unsigned NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 取消選取資料匯出。

-- 傾印  資料表 BBQ4V.streamer 結構
CREATE TABLE IF NOT EXISTS `streamer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 取消選取資料匯出。

-- 傾印  資料表 BBQ4V.video 結構
CREATE TABLE IF NOT EXISTS `video` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `streamerId` int(10) unsigned NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`) USING HASH,
  KEY `FK__streamer` (`streamerId`),
  CONSTRAINT `FK__streamer` FOREIGN KEY (`streamerId`) REFERENCES `streamer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 取消選取資料匯出。

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
