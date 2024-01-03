-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 03, 2024 at 09:50 PM
-- Server version: 5.7.44
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jk911_pangolin_sightings`
--

-- --------------------------------------------------------

--
-- Table structure for table `sightings`
--

CREATE TABLE `sightings` (
  `id` int(8) NOT NULL,
  `imagePath` varchar(64) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `deadOrAlive` enum('Dead','Alive','Unknown') CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL DEFAULT 'Unknown',
  `deathCause` enum('Fence death: electrocution','Fence death: non-electrified fence','Road death','Other','N/A','Unknown') CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL DEFAULT 'Unknown',
  `location` varchar(32) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL DEFAULT 'Unknown',
  `notes` longtext CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sightings`
--

INSERT INTO `sightings` (`id`, `imagePath`, `deadOrAlive`, `deathCause`, `location`, `notes`) VALUES
(55, '', 'Dead', 'N/A', '2.297274, 33.597405', 'a deserunt mollit anim id est laborum.'),
(56, 'images/1704318373419-pangolin_1.jpg', 'Dead', 'Road death', '2.022407, 29.449415', ''),
(57, 'images/1704318437267-pangolin_1.jpg', 'Dead', 'Other', '-0.294973, 28.845821', ''),
(54, 'images/1704318215085-pangolin_1.jpg', 'Dead', 'N/A', '1.213417, 31.121741', ' ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(53, 'images/1704318149297-pangolin_1.jpg', 'Alive', 'N/A', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sightings`
--
ALTER TABLE `sightings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sightings`
--
ALTER TABLE `sightings`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
