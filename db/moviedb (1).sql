-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2024 at 09:19 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moviedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `movies-genre`
--

CREATE TABLE `movies-genre` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `ratings` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies-info`
--

CREATE TABLE `movies-info` (
  `id` int(100) NOT NULL,
  `mid` int(100) NOT NULL,
  `adult` varchar(255) DEFAULT NULL,
  `backdrop_path` varchar(255) DEFAULT NULL,
  `genre_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`genre_ids`)),
  `original_language` varchar(255) DEFAULT NULL,
  `original_title` varchar(255) DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `popularity` float DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `title` text DEFAULT NULL,
  `video` int(1) DEFAULT NULL,
  `vote_average` float DEFAULT NULL,
  `vote_count` int(100) DEFAULT NULL,
  `external_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`external_ids`)),
  `status` text DEFAULT NULL,
  `revenue` float DEFAULT NULL,
  `runtime` int(100) DEFAULT NULL,
  `budget` int(100) DEFAULT NULL,
  `countries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies_ratings`
--

CREATE TABLE `movies_ratings` (
  `id` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `types` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_comments`
--

CREATE TABLE `movie_comments` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `comment` longtext NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_likes`
--

CREATE TABLE `movie_likes` (
  `id` int(11) NOT NULL,
  `mid` int(100) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `reaction` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT NULL,
  `favourites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`favourites`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `watch-list`
--

CREATE TABLE `watch-list` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`mid`)),
  `email` varchar(255) NOT NULL,
  `is_shared` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies-genre`
--
ALTER TABLE `movies-genre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movies-info`
--
ALTER TABLE `movies-info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mid` (`mid`),
  ADD KEY `mid_2` (`mid`);

--
-- Indexes for table `movies_ratings`
--
ALTER TABLE `movies_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`mid`),
  ADD KEY `user_email` (`email`);

--
-- Indexes for table `movie_comments`
--
ALTER TABLE `movie_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_email` (`user_email`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `movie_likes`
--
ALTER TABLE `movie_likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_table_id` (`user_email`),
  ADD KEY `mid` (`mid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watch-list`
--
ALTER TABLE `watch-list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movies-info`
--
ALTER TABLE `movies-info`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies_ratings`
--
ALTER TABLE `movies_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movie_comments`
--
ALTER TABLE `movie_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movie_likes`
--
ALTER TABLE `movie_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `watch-list`
--
ALTER TABLE `watch-list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `movies_ratings`
--
ALTER TABLE `movies_ratings`
  ADD CONSTRAINT `movies_ratings_ibfk_1` FOREIGN KEY (`mid`) REFERENCES `movies-info` (`mid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `movies_ratings_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `movie_comments`
--
ALTER TABLE `movie_comments`
  ADD CONSTRAINT `movie_comments_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `movie_comments_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies-info` (`mid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `movie_likes`
--
ALTER TABLE `movie_likes`
  ADD CONSTRAINT `movie_likes_ibfk_1` FOREIGN KEY (`mid`) REFERENCES `movies-info` (`mid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_table_id` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `watch-list`
--
ALTER TABLE `watch-list`
  ADD CONSTRAINT `user_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
