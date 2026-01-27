-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2025 at 08:59 AM
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
-- Database: `budget`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `details`
--

CREATE TABLE `details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_detail` varchar(255) NOT NULL,
  `spend_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `details`
--

INSERT INTO `details` (`id`, `name_detail`, `spend_id`, `created_at`, `updated_at`) VALUES
(1, 'Prof de math', 1, '2025-08-13 08:26:09', '2025-08-13 08:26:09'),
(2, 'Prof de svt', 1, '2025-08-13 17:44:15', '2025-08-13 17:44:15');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `makes`
--

CREATE TABLE `makes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `detail_id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `price_spend` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `makes`
--

INSERT INTO `makes` (`id`, `detail_id`, `resource_id`, `price_spend`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 100, '2025-08-13 08:35:57', '2025-08-13 08:47:41'),
(2, 2, 1, 100, '2025-08-13 17:44:15', '2025-08-13 17:44:15');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_20_102404_create_personal_access_tokens_table', 1),
(5, '2025_07_21_075451_create_projects_table', 1),
(6, '2025_08_13_073518_create_spends_table', 1),
(7, '2025_08_13_074023_create_resources_table', 1),
(8, '2025_08_13_082543_create_details_table', 1),
(9, '2025_08_13_082701_create_makes_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '40a6773c196654343c9479b36e9e2d6b586655425a50bf8aa5bef1a0f426e064', '[\"*\"]', NULL, NULL, '2025-08-13 05:51:10', '2025-08-13 05:51:10'),
(2, 'App\\Models\\User', 1, 'auth_token', 'acc36c56d4600df3ff731fb69317094e45927ad938bb919a02b2c2d1b9b30c4a', '[\"*\"]', '2025-08-13 14:32:11', NULL, '2025-08-13 14:30:15', '2025-08-13 14:32:11'),
(3, 'App\\Models\\User', 1, 'auth_token', '55b992f1f7cc65f6004383e4ba86d7cdfb0038e280bf95da5f24ae5ea26dc4cf', '[\"*\"]', '2025-08-13 14:34:05', NULL, '2025-08-13 14:32:46', '2025-08-13 14:34:05'),
(4, 'App\\Models\\User', 1, 'auth_token', '4af2d0a9b03862d54604a1b78e8be1eca90f24c61b1ea0f8b553130727c87da7', '[\"*\"]', NULL, NULL, '2025-08-13 14:34:11', '2025-08-13 14:34:11'),
(5, 'App\\Models\\User', 1, 'auth_token', 'e8817d37e84c846637ff6057d6b6d8163dce182ba5b4061ca900ebe915a7cdaa', '[\"*\"]', '2025-08-13 14:39:49', NULL, '2025-08-13 14:37:06', '2025-08-13 14:39:49'),
(6, 'App\\Models\\User', 1, 'auth_token', 'cd29299f8ca635920d02841679721e0550dce811e57aaadc2d511b3160373ed5', '[\"*\"]', NULL, NULL, '2025-08-13 14:39:54', '2025-08-13 14:39:54'),
(7, 'App\\Models\\User', 1, 'auth_token', '7e8c1032e05fe24e06afe3a58ca9a962297d28344ad3470a956db684f41fc8c0', '[\"*\"]', '2025-08-13 14:45:26', NULL, '2025-08-13 14:44:23', '2025-08-13 14:45:26'),
(8, 'App\\Models\\User', 1, 'auth_token', '9e7dcc5a4fd013d0c47dbb9dadb12499699a9351808be0a2fcf466e00ca8c4a2', '[\"*\"]', '2025-08-13 14:47:45', NULL, '2025-08-13 14:45:36', '2025-08-13 14:47:45'),
(9, 'App\\Models\\User', 1, 'auth_token', 'b2bdf04c8f4dd24b2e09bb3931ac15e90e8f3bbe0d8191920b52e070d810fe89', '[\"*\"]', '2025-08-13 14:51:40', NULL, '2025-08-13 14:47:50', '2025-08-13 14:51:40'),
(10, 'App\\Models\\User', 1, 'auth_token', 'd534f50138f323796414fce189485b11742e639b3f78b61f2e680c4477582e29', '[\"*\"]', '2025-08-13 15:08:07', NULL, '2025-08-13 15:02:28', '2025-08-13 15:08:07'),
(11, 'App\\Models\\User', 1, 'auth_token', '5dbcc66d12da21454b069fafb98dc1ed78b33244de9508ebcd9a4e66c87893b6', '[\"*\"]', NULL, NULL, '2025-08-13 15:08:17', '2025-08-13 15:08:17'),
(12, 'App\\Models\\User', 1, 'auth_token', '2277c81eeda670243fbf01ed8b082d2adef7454899834d662d7b8769ff43eca0', '[\"*\"]', '2025-08-13 15:09:47', NULL, '2025-08-13 15:08:35', '2025-08-13 15:09:47'),
(13, 'App\\Models\\User', 1, 'auth_token', '801d5c05e00cc08d28ffd114b4544b8966ffc51adf93bc8c23b1313725b1422f', '[\"*\"]', NULL, NULL, '2025-08-13 15:09:41', '2025-08-13 15:09:41'),
(14, 'App\\Models\\User', 1, 'auth_token', 'da1242287b3ee828f2a00b55e3988259304f5df1dbd5ae00d42bf83ffc5dee6b', '[\"*\"]', '2025-08-13 15:10:55', NULL, '2025-08-13 15:09:59', '2025-08-13 15:10:55'),
(15, 'App\\Models\\User', 1, 'auth_token', 'dc13fdaa21c1050ab90f75ebab25abdf9dd5d90b20698671f038ac5f2fbaf244', '[\"*\"]', '2025-08-13 15:11:24', NULL, '2025-08-13 15:10:58', '2025-08-13 15:11:24'),
(16, 'App\\Models\\User', 1, 'auth_token', '86f115c54ed2cc1b11d1672ba4109f21ef25b14b9167c8dd83b948dd90b6cde2', '[\"*\"]', NULL, NULL, '2025-08-13 15:13:32', '2025-08-13 15:13:32'),
(17, 'App\\Models\\User', 1, 'auth_token', '272606625c305e37f3383932a4c9d5f95f03808211ccffc333e2a391d90eeba9', '[\"*\"]', NULL, NULL, '2025-08-13 15:14:09', '2025-08-13 15:14:09'),
(18, 'App\\Models\\User', 1, 'auth_token', 'b8cc106390d2f950c1d9d1b1394d25e374d83aff99e5e02a76b0a7501f865324', '[\"*\"]', '2025-08-13 15:15:23', NULL, '2025-08-13 15:14:16', '2025-08-13 15:15:23'),
(19, 'App\\Models\\User', 1, 'auth_token', 'f3b205df719e6fd7d0a63396790b39123f75b011fd904e0d67556b48059b2dcb', '[\"*\"]', NULL, NULL, '2025-08-13 15:15:33', '2025-08-13 15:15:33'),
(20, 'App\\Models\\User', 1, 'auth_token', '5911dd07ab802697f22a159bacb35434ca8ce153695c7b3924fdcd5db4c3c369', '[\"*\"]', '2025-08-13 15:20:52', NULL, '2025-08-13 15:15:43', '2025-08-13 15:20:52'),
(21, 'App\\Models\\User', 1, 'auth_token', '565f86736867b2d05afe4baae70a9572a44018001aa4f5244420d632c90c9923', '[\"*\"]', '2025-08-13 15:45:54', NULL, '2025-08-13 15:21:05', '2025-08-13 15:45:54'),
(22, 'App\\Models\\User', 1, 'auth_token', '22897f084a4a3e88797cf464df5e34d0690d4335a2b8aae7ba3c2e2684f0ea6b', '[\"*\"]', '2025-08-13 16:30:24', NULL, '2025-08-13 15:46:45', '2025-08-13 16:30:24'),
(23, 'App\\Models\\User', 1, 'auth_token', 'ac3bfc11e3f54c68b86dfecedc880f871669de3addc26c2110f6051e65d21329', '[\"*\"]', NULL, NULL, '2025-08-13 16:30:44', '2025-08-13 16:30:44'),
(24, 'App\\Models\\User', 1, 'auth_token', '4b234f746108f40346e7351f5ff556546f976eb99c24f3268e22640225da1c2b', '[\"*\"]', NULL, NULL, '2025-08-13 16:30:58', '2025-08-13 16:30:58'),
(25, 'App\\Models\\User', 1, 'auth_token', '56d447fb14ccf9943011bc44057213093e59bbc6866bc1076ed46acde0130a06', '[\"*\"]', '2025-08-13 20:32:23', NULL, '2025-08-13 16:31:41', '2025-08-13 20:32:23'),
(26, 'App\\Models\\User', 1, 'auth_token', '29e47253668b9d3f6cadadfa1c72762a0258515a5451985bdd2ec2a7c55b78c2', '[\"*\"]', NULL, NULL, '2025-08-13 20:33:16', '2025-08-13 20:33:16'),
(27, 'App\\Models\\User', 1, 'auth_token', '7b7a0312ec12c7ee8c07d9d8a5a88914cb90380bdfecec04e1784193fcd09d3a', '[\"*\"]', '2025-08-13 20:33:39', NULL, '2025-08-13 20:33:28', '2025-08-13 20:33:39');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_project` varchar(255) NOT NULL,
  `description_project` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name_project`, `description_project`, `user_id`, `created_at`, `updated_at`, `active`) VALUES
(1, 'budget 2024', '', 1, '2025-08-13 06:54:41', '2025-08-13 06:54:41', 1);

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `origine_resource` varchar(255) NOT NULL,
  `price_resource` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `project_id`, `origine_resource`, `price_resource`, `created_at`, `updated_at`) VALUES
(1, 1, 'VOI', 1000, '2025-08-13 08:23:58', '2025-08-13 08:23:58');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `spends`
--

CREATE TABLE `spends` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `name_spend` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spends`
--

INSERT INTO `spends` (`id`, `project_id`, `name_spend`, `created_at`, `updated_at`) VALUES
(1, 1, 'Salaire', '2025-08-13 08:26:08', '2025-08-13 08:26:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Prov Anosy', '$2y$12$IdjACe4Ps2t8kHmSxRd.aO6q1RETZe7QwjSK99jQZjss8j6xLxtJ.', NULL, '2025-08-13 05:51:01', '2025-08-13 05:51:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `details`
--
ALTER TABLE `details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `details_spend_id_foreign` (`spend_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `makes`
--
ALTER TABLE `makes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `makes_detail_id_foreign` (`detail_id`),
  ADD KEY `makes_resource_id_foreign` (`resource_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `projects_name_project_unique` (`name_project`),
  ADD KEY `projects_user_id_foreign` (`user_id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resources_project_id_foreign` (`project_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `spends`
--
ALTER TABLE `spends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spends_project_id_foreign` (`project_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_name_unique` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `details`
--
ALTER TABLE `details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `makes`
--
ALTER TABLE `makes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `spends`
--
ALTER TABLE `spends`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `details`
--
ALTER TABLE `details`
  ADD CONSTRAINT `details_spend_id_foreign` FOREIGN KEY (`spend_id`) REFERENCES `spends` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `makes`
--
ALTER TABLE `makes`
  ADD CONSTRAINT `makes_detail_id_foreign` FOREIGN KEY (`detail_id`) REFERENCES `details` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `makes_resource_id_foreign` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spends`
--
ALTER TABLE `spends`
  ADD CONSTRAINT `spends_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
