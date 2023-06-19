CREATE DATABASE RECORD;
USE RECORD;

CREATE TABLE competition (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    start_day VARCHAR(10) NOT NULL,
    recruits INT NOT NULL
);

CREATE TABLE participant (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    competition_seq INT NOT NULL references competition(seq),
    user_id VARCHAR(20) NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    reg_date DATETIME NOT NULL
);

CREATE TABLE competition_type (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(20) NOT NULL
);

CREATE TABLE record (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    competition_seq INT NOT NULL references competition(seq),
    participant_seq INT NOT NULL references participant(seq),
    complete_status bit(1) NOT NULL,
    competition_type_seq INT NOT NULL references competition_type(seq),
    reg_date DATETIME NOT NULL
);

CREATE TABLE offtherecord (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    title VARCHAR(50) NOT NULL,
    complete_status bit(1) NOT NULL,
    competition_type_seq INT NOT NULL references competition_type(seq),
    reg_date DATETIME NOT NULL
);

CREATE TABLE payment_point (
    seq INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    participant_seq INT NOT NULL references participant(seq),
    record_seq INT NOT NULL references record(seq),
    point INT NOT NULL,
    reg_date DATETIME NOT NULL
);

