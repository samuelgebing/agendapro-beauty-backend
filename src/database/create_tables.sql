-- Usa o banco de dados
USE agendapro_beauty;

create table if not exists areas (
	id INT primary key auto_increment,
	nome VARCHAR(100) unique,
	descricao VARCHAR(255)
);

create table if not exists servicos (
	id INT primary key auto_increment,
	area_id INT, 
	nome varchar(100) unique,
	duracao_min int,
	preco decimal(7,2),
	foreign key (area_id)
	references areas(id)
);

-- EXTRA: Para padronizar os perfis
create table if not exists perfis (
	id int primary key auto_increment,
	nome varchar(30)
);

-- Permite a mesma pessoa ter vários usuários,
-- mas com e-mails distintos
create table if not exists usuarios (
	id int primary key auto_increment,
	nome varchar(100),
	email varchar(100) unique,
	senha_hash varchar(255),
	perfil_id int,
	criado_em timestamp,
	foreign key (perfil_id)
	references perfis(id)
);

-- EXTRA: Para padronizar as especialidades
create table if not exists especialidades (
	id int primary key auto_increment,
	nome varchar(100)
);

-- Profissional pode ter mais de uma especialidade
create table if not exists profissionais (
	id int primary key auto_increment,
	nome varchar(100),
	especialidade_id int,
	telefone varchar(20),
	ativo boolean default true,
	foreign key (especialidade_id)
	references especialidades(id)
);

create table if not exists status_agendamento (
	id int primary key auto_increment,
	nome varchar(100),
	descricao varchar(255)
);

create table if not exists agendamentos (
	id int primary key auto_increment,
	usuario_id int,
	profissional_id int,
	servico_id int,
	status_id int,
	data_hora_inicio datetime,
	data_hora_fim datetime,
	criado_em timestamp,
	foreign key (usuario_id)
	references usuarios(id),
	foreign key (profissional_id)
	references profissionais(id),
	foreign key (servico_id)
	references servicos(id),
	foreign key (status_id)
	references status_agendamento(id)
);

create table if not exists horarios_trabalho (
	id int primary key auto_increment,
	profissional_id int,
	dia_semana tinyint check (dia_semana between 0 and 6),
	hora_inicio time,
	hora_fim time
);

create table if not exists horarios_bloqueados (
	id int primary key auto_increment,
	profissional_id int,
	inicio datetime,
	fim datetime,
	motivo varchar(255)
);