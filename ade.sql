-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2025 at 01:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ade`
--

-- --------------------------------------------------------

--
-- Table structure for table `license_compatibility_temp`
--

CREATE TABLE `license_compatibility_temp` (
  `id` int(11) NOT NULL,
  `original_license` varchar(255) NOT NULL,
  `compatible_license` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `license_compatibility_temp`
--

INSERT INTO `license_compatibility_temp` (`id`, `original_license`, `compatible_license`) VALUES
(1, 'Apache v2.0', 'MPLv1.1'),
(2, 'Apache v2.0', 'MPLv2.0'),
(3, 'Apache v2.0', 'LGPLv2.1'),
(4, 'Apache v2.0', 'LGPLv2.1+'),
(5, 'Apache v2.0', 'LGPLv3 or LGPLv3+'),
(6, 'Apache v2.0', 'GPLv2'),
(7, 'Apache v2.0', 'GPLv2+'),
(8, 'Apache v2.0', 'GPLv3 or GPLv3+'),
(9, 'Apache v2.0', 'AGPLv3'),
(10, 'Apache v2.0', 'AGPLv1+'),
(11, 'MPLv1.1', 'MPLv2.0'),
(12, 'MPLv1.1', 'LGPLv2.1'),
(13, 'MPLv1.1', 'LGPLv2.1+'),
(14, 'MPLv1.1', 'LGPLv3 or LGPLv3+'),
(15, 'MPLv1.1', 'GPLv2'),
(16, 'MPLv1.1', 'GPLv2+'),
(17, 'MPLv1.1', 'GPLv3 or GPLv3+'),
(18, 'MPLv1.1', 'AGPLv3'),
(19, 'MPLv1.1', 'AGPLv1+'),
(20, 'MPLv2.0', 'LGPLv2.1'),
(21, 'MPLv2.0', 'LGPLv2.1+'),
(22, 'MPLv2.0', 'LGPLv3 or LGPLv3+'),
(23, 'MPLv2.0', 'GPLv2'),
(24, 'MPLv2.0', 'GPLv2+'),
(25, 'MPLv2.0', 'GPLv3 or GPLv3+'),
(26, 'MPLv2.0', 'AGPLv3'),
(27, 'MPLv2.0', 'AGPLv1+'),
(28, 'LGPLv2.1', 'LGPLv2.1+'),
(29, 'LGPLv2.1', 'LGPLv3 or LGPLv3+'),
(30, 'LGPLv2.1', 'GPLv2'),
(31, 'LGPLv2.1', 'GPLv2+'),
(32, 'LGPLv2.1', 'GPLv3 or GPLv3+'),
(33, 'LGPLv2.1', 'AGPLv3'),
(34, 'LGPLv2.1', 'AGPLv1+'),
(35, 'LGPLv2.1+', 'LGPLv3 or LGPLv3+'),
(36, 'LGPLv2.1+', 'GPLv2'),
(37, 'LGPLv2.1+', 'GPLv2+'),
(38, 'LGPLv2.1+', 'GPLv3 or GPLv3+'),
(39, 'LGPLv2.1+', 'AGPLv3'),
(40, 'LGPLv2.1+', 'AGPLv1+'),
(41, 'LGPLv3 or LGPLv3+', 'GPLv2'),
(42, 'LGPLv3 or LGPLv3+', 'GPLv2+'),
(43, 'LGPLv3 or LGPLv3+', 'GPLv3 or GPLv3+'),
(44, 'LGPLv3 or LGPLv3+', 'AGPLv3'),
(45, 'LGPLv3 or LGPLv3+', 'AGPLv1+'),
(46, 'GPLv2', 'GPLv2+'),
(47, 'GPLv2', 'GPLv3 or GPLv3+'),
(48, 'GPLv2', 'AGPLv3'),
(49, 'GPLv2', 'AGPLv1+'),
(50, 'GPLv2+', 'GPLv3 or GPLv3+'),
(51, 'GPLv2+', 'AGPLv3'),
(52, 'GPLv2+', 'AGPLv1+'),
(53, 'GPLv3 or GPLv3+', 'AGPLv3'),
(54, 'GPLv3 or GPLv3+', 'AGPLv1+'),
(55, 'AGPLv3', 'AGPLv1+');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `project_description` text NOT NULL,
  `file_path` text NOT NULL,
  `wallet_address` varchar(42) NOT NULL,
  `license_type` varchar(50) NOT NULL,
  `file_hash` text DEFAULT NULL,
  `parent_project_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wallet_address` varchar(42) NOT NULL,
  `private_key` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `wallet_address`, `private_key`) VALUES
(2, 'USER', 'test', '0x9ac0Dab2CcE3d14f79Bd5162809A617269747964', '0xa2aab1f33691c26de658f3becff1e930a395a2abf62d4ff7c753c5c87f2ea6a4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `license_compatibility_temp`
--
ALTER TABLE `license_compatibility_temp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `license_compatibility_temp`
--
ALTER TABLE `license_compatibility_temp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
