# hd-base-nodejs

### Prepare
1. Install [NodeJs](https://nodejs.org/en/)
2. TIP: you should use [WebStorm](https://www.jetbrains.com/webstorm/)

### I. Create database
<b>We use mysql-server to manager database.<br>
I will config database and phpmyadmin on [Ubuntu 16.04.5 Desktop (64-bit)](http://releases.ubuntu.com/16.04/ubuntu-16.04.5-desktop-amd64.iso.torrent?_ga=2.217581910.1188550486.1539747401-1372677801.1538617402)
</b>
1. Install mysql-server
```
> apt-get install mysql-server
> mysql_secure_installation
> systemctl status mysql.service
> mysqladmin -p -u root version
> service mysql start
```

2. Install apache2
```
> apt-get install apache2
```

3. Install phpmyadmin
```
> apt-get install phpmyadmin
```

4. Create database and user
```
> mysql -u root -p
> <enter password of root>

mysql> CREATE DATABASE first_project_database;
mysql> CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON  first_project_database.*  TO 'newuser'@'localhost';
mysql> FLUSH PRIVILEGES;
```

5. Create table
- Option 1
```
mysql> use first_project_database;
mysql> create table user (
       id                  int(10)         not null        auto_increment      primary key,
       username            varchar(50)     not null,
       password            varchar(191)    not null,
       created_at          timestamp       not null        default now(),
       updated_at          timestamp       not null        default now() on update now()
       ) collate 'utf8_unicode_ci';
mysql> create table user_token (
       id                  int(10)         not null        auto_increment      primary key,
       user_id             int(10)         not null,
       token               varchar(191)    not null,
       status              int(10)         not null        default 1,
       created_at          timestamp       not null        default now(),
       updated_at          timestamp       not null        default now() on update now(),
       foreign key (user_id) references user(id)
       ) collate 'utf8_unicode_ci';
```
- Option 2
```
mysql> exit;

> wget https://github.com/duonghd7/hd-base-nodejs/raw/master/aDocument/mysql.sql
> mysql -h localhost -D first_project_database -u newuser -p < mysql.sql
> <enter password of newuser>
```

- Final, we check tables of <b>first_project_database</b>
```
> mysql -h localhost -D first_project_database -u newuser -p
> <enter password of newuser>

mysql> show tables;

+----------------------------------+
| Tables_in_first_project_database |
+----------------------------------+
| user                             |
| user_token                       |
+----------------------------------+
2 rows in set (0.00 sec)
```

6. Note
* Edit port listen
```
> nano /etc/apache2/ports.conf
```

* Fix no select server with phpmyadmin
```
> sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
> sudo a2enconf phpmyadmin.conf
> sudo service apache2 reload
```

### II. Config
1. Environment
- [./config/development_config.json](https://github.com/duonghd7/hd-base-nodejs/blob/master/config/development_config.json)
- [./config/production_config.json](https://github.com/duonghd7/hd-base-nodejs/blob/master/config/production_config.json)

2. Swagger
- [./config/swagger.json](https://github.com/duonghd7/hd-base-nodejs/blob/master/config/swagger.json)
- [./config/development_swagger.json](https://github.com/duonghd7/hd-base-nodejs/blob/master/config/development_swagger.json)
- [./config/production_swagger.json](https://github.com/duonghd7/hd-base-nodejs/blob/master/config/production_swagger.json)

### III. Run
1. Install package
```
> npm install
```

2. Build
```
> npm run build OR npm run build --env=development
> npm run build --env=production

Note
* config in file package.json 
* use gulp tasks
* template: npm run build --env=[name-env]
```

3. Run
```
> npm start
```

### IV. Information
Circle<br>
user: call api<br>
----> controllers receive data<br>
--------> call service<br>
------------> call repository<br>
----------------> call database

### V. Tutorial
1. Create model
2. Create repository
3. Create service
4. Create controller
