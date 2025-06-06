-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: localhost
-- Χρόνος δημιουργίας: 06 Ιουν 2025 στις 17:10:05
-- Έκδοση διακομιστή: 10.4.28-MariaDB
-- Έκδοση PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `fosschain`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `license_compatibility_temp`
--

CREATE TABLE `license_compatibility_temp` (
  `id` int(11) NOT NULL,
  `original_license` varchar(255) NOT NULL,
  `compatible_license` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `license_compatibility_temp`
--

INSERT INTO `license_compatibility_temp` (`id`, `original_license`, `compatible_license`) VALUES
(1, 'BSD-3-Clause', 'Apache-2.0'),
(2, 'Apache-2.0', 'MPLv2.0'),
(3, 'Apache-2.0', 'LGPLv2.1'),
(4, 'Apache-2.0', 'LGPLv2.1+'),
(5, 'Apache-2.0', 'LGPLv3 or LGPLv3+'),
(6, 'BSD-2-Clause', 'BSD-3-Clause'),
(7, 'Apache-2.0', 'GPLv2+'),
(8, 'Apache-2.0', 'GPLv3 or GPLv3+'),
(9, 'Apache-2.0', 'AGPLv3'),
(10, 'Apache-2.0', 'AGPLv1+'),
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
(52, 'GPLv2+', 'GPLv2'),
(53, 'GPLv3 or GPLv3+', 'AGPLv3'),
(54, 'GPLv3 or GPLv3+', 'AGPLv1+'),
(55, 'AGPLv1+', 'AGPLv3'),
(56, 'BSD-3-Clause', 'MPLv2.0'),
(57, 'BSD-3-Clause', 'LGPLv2.1'),
(58, 'BSD-3-Clause', 'LGPLv2.1+'),
(59, 'BSD-3-Clause', 'LGPLv3 or LGPLv3+'),
(60, 'BSD-3-Clause', 'GPLv2'),
(61, 'BSD-3-Clause', 'GPLv2+'),
(62, 'BSD-3-Clause', 'GPLv3 or GPLv3+'),
(63, 'BSD-3-Clause', 'AGPLv3'),
(64, 'BSD-2-Clause', 'MPLv2.0'),
(65, 'BSD-2-Clause', 'LGPLv2.1'),
(66, 'BSD-2-Clause', 'LGPLv2.1+'),
(67, 'BSD-2-Clause', 'LGPLv3 or LGPLv3+'),
(68, 'BSD-2-Clause', 'GPLv2'),
(69, 'BSD-2-Clause', 'GPLv2+'),
(70, 'BSD-2-Clause', 'GPLv3 or GPLv3+'),
(72, 'BSD-2-Clause', 'AGPLv3');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `projects`
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
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wallet_address` varchar(42) NOT NULL,
  `private_key` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `wallet_address`, `private_key`) VALUES
(2, 'USER', 'test', '0x9ac0Dab2CcE3d14f79Bd5162809A617269747964', '0xa2aab1f33691c26de658f3becff1e930a395a2abf62d4ff7c753c5c87f2ea6a4');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `license_compatibility_temp`
--
ALTER TABLE `license_compatibility_temp`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `license_compatibility_temp`
--
ALTER TABLE `license_compatibility_temp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT για πίνακα `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
