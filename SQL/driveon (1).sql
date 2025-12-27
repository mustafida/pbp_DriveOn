-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2025 at 04:09 PM
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
-- Database: `driveon`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(150) DEFAULT NULL,
  `price_per_day` int(11) NOT NULL,
  `category` enum('Ekonomi','Menengah','Luxury') NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `seat_info` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `plate` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `name`, `type`, `price_per_day`, `category`, `image_path`, `description`, `brand`, `seat_info`, `color`, `transmission`, `year`, `plate`) VALUES
(1, 'Toyota Avanza', 'Matic / Manual', 500000, 'Ekonomi', 'assets/images/toyota_avanza.png', 'Dimensi: Panjang 4.410 mm, lebar 1.700 mm, tinggi 1.475 mm. Toyota Avanza hadir dengan desain modern dan aerodinamis, kabin nyaman, serta efisiensi bahan bakar tinggi.', 'Toyota', '7 Kursi', 'Perak', 'Matic', '2016', 'M 1873 AD'),
(2, 'Daihatsu Xenia', 'Matic / Manual', 750000, 'Ekonomi', 'assets/images/daihatsu_xenia.png', 'Dimensi: Panjang 4.395 mm, lebar 1.735 mm, tinggi 1.690 mm. Daihatsu Xenia memiliki kabin yang lega dan irit bahan bakar.', 'Daihatsu', '7 Kursi', 'Abu-Abu', 'Matic', '2017', 'M 1232 AD'),
(3, 'Honda Brio', 'Matic', 400000, 'Ekonomi', 'assets/images/honda_brio.png', 'Honda Brio tampil sporty dan kompak, mudah dikendarai di perkotaan dengan konsumsi bahan bakar yang irit.', 'Honda', '5 Kursi', 'Putih', 'Matic', '2020', 'M 1223 AD'),
(4, 'Honda Mobilio', 'Matic', 450000, 'Ekonomi', 'assets/images/honda_mobilio.png', 'Honda Mobilio memiliki desain dinamis dengan kabin 7 penumpang yang lega dan nyaman.', 'Honda', '7 Kursi', 'Abu-Abu', 'Matic', '2021', 'L 233 AD'),
(5, 'Toyota Calya', 'Matic / Manual', 350000, 'Ekonomi', 'assets/images/toyota_calya.png', 'Toyota Calya memiliki desain sederhana namun modern, dengan kabin 7 penumpang yang efisien dan nyaman.', 'Toyota', '7 Kursi', 'Hitam', 'Matic', '2016', 'M 1223 AC'),
(6, 'Mitsubishi Xpander', 'Matic / Manual', 600000, 'Ekonomi', 'assets/images/mitsubishi_xpander.png', 'Mitsubishi Xpander hadir dengan desain tangguh dan modern. Kabin luas dengan fitur keselamatan lengkap.', 'Mitsubishi', '7 Kursi', 'Hitam', 'Matic / Manual', '2019', 'L 2343 AG'),
(7, 'Honda CRV', 'Matic', 1300000, 'Menengah', 'assets/images/honda_crv.png', 'Honda CR-V bergaya elegan dengan kabin luas dan performa mesin yang halus serta bertenaga.', 'Honda', '7 Kursi', 'Hitam', 'Matic', '2022', 'L 8888 AC'),
(8, 'Toyota Innova Reborn', 'Matic / Manual', 900000, 'Menengah', 'assets/images/toyota_innova_reborn.png', 'Toyota Innova Reborn menawarkan kenyamanan tinggi dan ruang kabin lega untuk keluarga besar.', 'Toyota', '7 Kursi', 'Hitam', 'Matic', '2021', 'M 1234 AC'),
(9, 'Mitsubishi Pajero Sport', 'Matic', 1800000, 'Menengah', 'assets/images/mitsubishi_pajero_sport.png', 'Mitsubishi Pajero Sport tampil gagah dengan performa tangguh dan desain SUV premium.', 'Mitsubishi', '7 Kursi', 'Hitam', 'Matic', '2021', 'L 9999 AG'),
(10, 'Toyota Fortuner', 'Matic', 1900000, 'Menengah', 'assets/images/toyota_fortuner.png', 'Toyota Fortuner memiliki desain sporty dengan kemampuan off-road dan kenyamanan tinggi.', 'Toyota', '7 Kursi', 'Hitam', 'Matic', '2020', 'L 3456 AF'),
(11, 'Toyota Alphard', 'Matic', 2400000, 'Luxury', 'assets/images/toyota_alphard.png', 'Toyota Alphard menghadirkan kemewahan dan kenyamanan maksimal dengan desain elegan dan interior premium.', 'Toyota', '7 Kursi', 'Hitam', 'Matic', '2022', 'B 1234 AA'),
(12, 'Lexus LM', 'Matic', 7000000, 'Luxury', 'assets/images/lexus_lm.png', 'Lexus LM merupakan MPV mewah dengan kabin eksklusif dan fitur teknologi canggih khas Lexus.', 'Lexus', '4 Kursi', 'Hitam', 'Matic', '2023', 'B 9 LM'),
(13, 'Hyundai Staria', 'Matic', 1750000, 'Luxury', 'assets/images/hyundai_staria.png', 'Hyundai Staria tampil futuristik dengan desain modern dan kenyamanan tinggi untuk keluarga besar.', 'Hyundai', '7 Kursi', 'Hitam', 'Matic', '2022', 'L 7788 ST'),
(14, 'BMW 5 Series', 'Matic', 3500000, 'Luxury', 'assets/images/bmw5_series.png', 'BMW 5 Series menggabungkan performa tinggi, kemewahan, dan teknologi mutakhir.', 'BMW', '5 Kursi', 'Hitam', 'Matic', '2023', 'W 5555 BB');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` enum('unpaid','rented','finished') DEFAULT 'unpaid',
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_expired_at` datetime DEFAULT NULL,
  `payment_reference` varchar(64) DEFAULT NULL,
  `payment_checkout_url` text DEFAULT NULL,
  `payment_method` varchar(32) DEFAULT NULL,
  `payment_status` enum('unpaid','pending','paid','expired','failed') DEFAULT 'unpaid',
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `pickup_location`, `note`, `status`, `rating`, `created_at`, `payment_expired_at`, `payment_reference`, `payment_checkout_url`, `payment_method`, `payment_status`, `paid_at`) VALUES
(2, 1, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'unpaid', NULL, '2025-12-12 04:53:19', '2025-12-12 13:53:19', NULL, NULL, NULL, 'unpaid', NULL),
(3, 1, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'unpaid', NULL, '2025-12-12 04:59:48', '2025-12-12 13:59:48', NULL, NULL, NULL, 'unpaid', NULL),
(4, 1, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'unpaid', NULL, '2025-12-12 05:11:08', '2025-12-12 14:11:08', NULL, NULL, NULL, 'unpaid', NULL),
(5, 1, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'finished', 5, '2025-12-12 05:31:03', '2025-12-12 14:31:03', NULL, NULL, NULL, 'unpaid', NULL),
(6, 4, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'unpaid', NULL, '2025-12-14 16:23:21', '2025-12-15 01:23:21', NULL, NULL, NULL, 'unpaid', NULL),
(7, 5, 1, '2025-12-12 10:00:00', '2025-12-14 10:00:00', 'Bandara Juanda', 'Tolong full bensin ya', 'unpaid', NULL, '2025-12-15 06:49:30', '2025-12-15 15:49:30', NULL, NULL, NULL, 'unpaid', NULL),
(8, 4, 1, '2025-12-23 10:00:00', '2025-12-24 10:00:00', 'Surabaya utara', 'Test order', 'unpaid', NULL, '2025-12-23 04:51:14', '2025-12-23 13:51:14', NULL, NULL, NULL, 'unpaid', NULL),
(9, 7, 1, '2025-12-23 10:00:00', '2025-12-24 10:00:00', 'Surabaya', 'Test order baru', 'unpaid', NULL, '2025-12-23 05:21:02', '2025-12-23 14:21:02', NULL, NULL, NULL, 'unpaid', NULL),
(10, 8, 2, '2025-12-23 10:00:00', '2025-12-24 10:00:00', 'Surabaya selatan', 'Test order baru', 'unpaid', NULL, '2025-12-24 12:16:42', '2025-12-24 21:16:42', NULL, NULL, NULL, 'unpaid', NULL),
(11, 8, 1, '2025-12-23 10:00:00', '2025-12-24 10:00:00', 'Surabaya', 'Test order baru', 'unpaid', NULL, '2025-12-24 12:47:07', '2025-12-24 21:47:07', NULL, NULL, NULL, 'unpaid', NULL),
(12, 8, 1, '2025-12-23 10:00:00', '2025-12-24 10:00:00', 'Surabaya', 'Test order baru', 'unpaid', NULL, '2025-12-25 15:21:11', '2025-12-26 00:21:11', NULL, NULL, NULL, 'unpaid', NULL),
(13, 9, 1, '2025-12-26 10:00:00', '2025-12-27 10:00:00', 'Surabaya', 'Test Tripay', 'rented', NULL, '2025-12-25 16:50:29', '2025-12-26 01:50:29', 'DEV-T47305322804TO5DJ', 'https://tripay.co.id/checkout/DEV-T47305322804TO5DJ', 'QRIS2', 'paid', '2025-12-26 11:21:11');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `payment_url` varchar(255) DEFAULT NULL,
  `status` enum('UNPAID','PAID','EXPIRED') DEFAULT 'UNPAID',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_logs`
--

CREATE TABLE `payment_logs` (
  `id` int(11) NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `raw_json` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `region` varchar(150) DEFAULT 'Pilih wilayah',
  `login_type` enum('google','email') DEFAULT 'google',
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `region`, `login_type`, `password_hash`, `created_at`) VALUES
(1, 'User', 'Dummy', 'dummy@example.com', 'Pilih wilayah', 'google', NULL, '2025-12-12 04:51:07'),
(3, 'Test', 'User', 'test2@gmail.com', 'Pilih wilayah', 'email', '$2b$10$DvgCkzX4n67pBSj7UU.a3ui7pUHAi6FQjg7GYJpQA3Fd3lhpRYCWi', '2025-12-13 13:39:12'),
(4, 'Test', 'User', 'test123@gmail.com', 'Pilih wilayah', 'email', '$2b$10$9vde./FdW014oeB7cAjE7uSfIzgTg97AOIc8baTG4SsajaYzZREVe', '2025-12-14 16:14:41'),
(5, 'Test', 'User', 'test@gmail.com', 'Pilih wilayah', 'email', '$2b$10$p5N5DivowdE9r6HcRY/teuEUmQH0lL4HT2QLCV1NzYoIKL8yj3PT.', '2025-12-15 05:52:20'),
(6, 'Kim', 'A', 'kim@mail.com', 'Pilih wilayah', 'email', '$2b$10$i2Oa71gMOXXuYOOcei.6WOXyNhj08r8ZUtUbUme4AMZOzZKM.uXE.', '2025-12-20 04:29:39'),
(7, 'Kim', 'DriveOn', 'kimdriveon001@gmail.com', 'Pilih wilayah', 'email', '$2b$10$4pvSWeuK6eDgwsHFXD7cwufLeyJVrFcJ0WcnfRzYgZKBJ1MXQtGzi', '2025-12-23 05:16:40'),
(8, 'vi', 'fida', 'fida@gmail.com', 'Pilih wilayah', 'email', '$2b$10$mLQc8bCq9eUECQJ9EkiAFuRtvrnZO.x/xsD9n4ZuxoNulwgDwQ5Uy', '2025-12-24 11:49:14'),
(9, 'vi', 'fida', 'fida+001@gmail.com', 'Pilih wilayah', 'email', '$2b$10$eTmNkyWHvhw8P7AB7EeOO.27rPDg10OgWZ3F/pOCEAkfK7GNbNdXm', '2025-12-25 16:48:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payment_logs`
--
ALTER TABLE `payment_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_logs`
--
ALTER TABLE `payment_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
