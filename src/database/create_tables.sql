USE agendapro_beauty;

create table if not exists areas (
	id INT primary key auto_increment,
	name VARCHAR(100) unique,
	description VARCHAR(255)
);

create table if not exists services (
	id INT primary key auto_increment,
	area_id INT, 
	name varchar(100) unique,
	min_duration int,
	price decimal(7,2),
	foreign key (area_id)
	references areas(id)
);

-- EXTRA: To standardize authorization roles
create table if not exists roles (
	id int primary key auto_increment,
	name varchar(30)
);

-- Users have distinct emails
create table if not exists users (
	id int primary key auto_increment,
	name varchar(100),
	email varchar(100) unique,
	password_hash varchar(255),
	role_id int,
	created_at timestamp,
	foreign key (role_id)
	references roles(id)
);

-- EXTRA: To standardize specialities
create table if not exists specialities (
	id int primary key auto_increment,
	name varchar(100)
);

-- VERIFY: Can professionals have more than one speciality?
create table if not exists professionals (
	id int primary key auto_increment,
	name varchar(100),
	speciality_id int,
	phone varchar(20),
	active boolean default true, -- NEED TO VALIDATE THE RIGHT TYPE
	foreign key (speciality_id)
	references specialities(id)
);

create table if not exists schedule_status (
	id int primary key auto_increment,
	name varchar(100),
	description varchar(255)
);

create table if not exists schedules (
	id int primary key auto_increment,
	user_id int,
	professional_id int,
	service_id int,
	status_id int,
	start_date_hour datetime,
	end_date_hour datetime,
	created_at timestamp,
	foreign key (user_id)
	references users(id),
	foreign key (professional_id)
	references professionals(id),
	foreign key (service_id)
	references services(id),
	foreign key (status_id)
	references schedule_status(id)
);

create table if not exists working_hours (
	id int primary key auto_increment,
	professional_id int,
	weekday tinyint check (weekday between 0 and 6),
	start_hour time,
	end_hour time
);

create table if not exists blocked_hours (
	id int primary key auto_increment,
	professional_id int,
	start datetime,
	end datetime,
	reason varchar(255)
);