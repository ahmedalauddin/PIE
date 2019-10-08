/**
* Project:  ValueInfinity Inovation Platform
* File:     valueinfinity-mvp/db/ValueInfinity full.sql
* Descr:    Full SQL for creating tables, views, constraints, and indexes for the ValueInfinity Innovation Platform
*           database.
* Created:  2019-01-08
* Author:   Brad Kaufman
*------------------------------------------------
* Revised:  2019-10-02
* Changes:  Updated Kpis table to include orgPriority column, for prioritzing kpis.
* 
*/
-- we don't know how to generate root <with-no-name> (class Root) :(
create table mvp2.KpiTags
(
	kpiId int not null,
	tag varchar(60) not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (kpiId, tag)
);

create index kpiId
	on mvp2.KpiTags (kpiId);

create table mvp2.Organizations
(
	id int auto_increment
		primary key,
	name varchar(255) not null,
	owningOrg tinyint(1) default 0 null,
	lockPrioritization tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table mvp2.DataSources
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSources_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index DataSources_organization_ind
	on mvp2.DataSources (orgId);

create index DataSources_title_ind
	on mvp2.DataSources (title);

create table mvp2.Departments
(
	id int auto_increment
		primary key,
	name varchar(100) null,
	description varchar(255) null,
	orgId int null,
	createdAt datetime null,
	updatedAt datetime null,
	constraint Departments_Organizations_id_fk
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
)
comment 'Organization departments';

create fulltext index name
	on mvp2.Departments (name, description);

create table mvp2.Ideas
(
	id int auto_increment
		primary key,
	name varchar(255) null,
	ideaText text null,
	nodeId varchar(20) null,
	orgId int not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Ideas_Organizations_id_fk
		foreign key (orgId) references mvp2.Organizations (id)
);

create table mvp2.Kpis
(
	id int auto_increment
		primary key,
	orgId int not null,
	deptId int null,
	title varchar(255) not null,
	description varchar(255) null,
	level int null,
	mindmapNodeId varchar(20) null,
	type varchar(255) null,
	orgPriority int null,
	status varchar(255) null,
	active tinyint default 1 null,
	projectId int null,
	formulaDescription varchar(255) null,
	departmentId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Kpis_Departments_id_fk
		foreign key (deptId) references mvp2.Departments (id),
	constraint Kpis_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Kpis_Organizations_ind
	on mvp2.Kpis (orgId);

create index kpis_title_ind
	on mvp2.Kpis (title);

create fulltext index title
	on mvp2.Kpis (title, description, formulaDescription, type);

create table mvp2.Mindmaps
(
	id int auto_increment
		primary key,
	orgId int not null,
	mapData json null comment 'JSON data representing the nodes of the mind map.',
	mapName varchar(200) null comment 'Descriptive name for the map we can display when a user selects from the mind maps for their org.',
	mapDescription varchar(500) null comment 'Description of the mind map.',
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Mindmaps_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Mindmaps_Organizations_ind
	on mvp2.Mindmaps (orgId);

create table mvp2.Persons
(
	id int auto_increment
		primary key,
	orgId int not null,
	firstName varchar(128) null,
	lastName varchar(128) null,
	username varchar(255) null,
	allowLogin tinyint(1) default 0 null,
	email varchar(255) not null,
	deptId int null,
	role varchar(50) null,
	pwdhash varchar(255) not null,
	disabled tinyint(1) default 0 null,
	lastLogin datetime null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	disabledAt datetime null,
	fullName varchar(255) as (concat(`lastName`,_utf8mb4', ',`firstName`)),
	constraint persons_email
		unique (email),
	constraint Persons_Departments_id_fk
		foreign key (deptId) references mvp2.Departments (id),
	constraint Persons_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Persons_Organizations_ind
	on mvp2.Persons (orgId);

create index Persons_login_ind
	on mvp2.Persons (email, pwdhash, disabled);

create table mvp2.ProjectStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of project statuses';

create table mvp2.Projects
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	description varchar(512) null,
	summary text null,
	businessGoal varchar(255) null,
	progress int default 0 null,
	currentTaskId int null,
	startAt datetime default CURRENT_TIMESTAMP null,
	endAt date null,
	mindmapId int null,
	nodeId varchar(16) null,
	statusId int null,
	mainKpiId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Projects_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade,
	constraint Projects_ibfk_2
		foreign key (mainKpiId) references mvp2.Kpis (id)
			on delete cascade,
	constraint Projects_ibfk_3
		foreign key (statusId) references mvp2.ProjectStatuses (id)
);

create table mvp2.DataSets
(
	id int auto_increment
		primary key,
	dataSourceId int not null,
	projectId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSets_ibfk_1
		foreign key (dataSourceId) references mvp2.DataSources (id)
			on delete cascade,
	constraint DataSets_ibfk_2
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade
);

create index DataSets_DataSources_ind
	on mvp2.DataSets (dataSourceId);

create index DataSets_Projects_ind
	on mvp2.DataSets (projectId);

create index DataSets_title_ind
	on mvp2.DataSets (title);

create table mvp2.KpiProjects
(
	projectId int not null,
	kpiId int not null,
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, kpiId),
	constraint KpiProjects_ibfk_1
		foreign key (kpiId) references mvp2.Kpis (id)
			on delete cascade,
	constraint KpiProjects_ibfk_2
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade
);

create index kpiId
	on mvp2.KpiProjects (kpiId);

create table mvp2.ProjectPersons
(
	projectId int not null,
	personId int not null,
	inProject tinyint(1) default 0 null,
	owner tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, personId),
	constraint ProjectPersons_ibfk_1
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade,
	constraint ProjectPersons_ibfk_2
		foreign key (personId) references mvp2.Persons (id)
			on delete cascade
);

create index personId
	on mvp2.ProjectPersons (personId);

create index Projects_Mindmap_ind
	on mvp2.Projects (mindmapId, nodeId);

create index Projects_Organizations_ind
	on mvp2.Projects (orgId);

create index Projects_startAt_ind
	on mvp2.Projects (startAt);

create index Projects_title_ind
	on mvp2.Projects (title);

create fulltext index title
	on mvp2.Projects (title, description, summary, businessGoal);

create table mvp2.SearchData
(
	id int auto_increment
		primary key,
	orgId int null,
	foreignId int not null,
	title varchar(100) null,
	description varchar(255) null,
	summary varchar(255) null,
	project varchar(100) null,
	source varchar(50) null
)
comment 'For building our fulltext search index.';

create fulltext index title
	on mvp2.SearchData (title, description, summary);

create table mvp2.SequelizeMeta
(
	name varchar(255) not null,
	constraint name
		unique (name)
)
collate=utf8_unicode_ci;

alter table mvp2.SequelizeMeta
	add primary key (name);

create table mvp2.TaskPriorities
(
	id int not null
		primary key,
	label varchar(30) null,
	priority int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
);

create table mvp2.TaskStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of task statuses';

create table mvp2.Milestones
(
	id int auto_increment
		primary key,
	title varchar(255) not null,
	targetDate date null,
	description varchar(255) null,
	orgId int not null,
	statusId int default 1 null,
	active tinyint default 1 null,
	projectId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Milestones_Projects_id_fk
		foreign key (projectId) references mvp2.Projects (id),
	constraint Milestones_TaskStatuses_id_fk
		foreign key (statusId) references mvp2.TaskStatuses (id)
);

create fulltext index title
	on mvp2.Milestones (title, description);

create table mvp2.Tasks
(
	id int auto_increment
		primary key,
	projectId int not null,
	assignedTo int not null,
	title varchar(255) not null,
	description varchar(255) null,
	comments varchar(255) null,
	priorityId int default 3 null,
	milestoneId int null,
	statusId int default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Tasks_ibfk_1
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade,
	constraint Tasks_ibfk_2
		foreign key (assignedTo) references mvp2.Persons (id)
			on delete cascade,
	constraint Tasks_ibfk_3
		foreign key (statusId) references mvp2.TaskStatuses (id)
			on delete cascade,
	constraint Tasks_ibfk_4
		foreign key (priorityId) references mvp2.TaskPriorities (id)
			on delete cascade,
	constraint Tasks_ibfk_5
		foreign key (milestoneId) references mvp2.Milestones (id)
);

alter table mvp2.Projects
	add constraint Projects_ibfk_4
		foreign key (currentTaskId) references mvp2.Tasks (id);

create index Tasks_Projects_ind
	on mvp2.Tasks (projectId);

create index Tasks_assignedTo_ind
	on mvp2.Tasks (assignedTo);

create fulltext index title
	on mvp2.Tasks (title, description);

create view CHARACTER_SETS as -- missing source code
;

create view COLLATIONS as -- missing source code
;

create view COLLATION_CHARACTER_SET_APPLICABILITY as -- missing source code
;

create view COLUMNS as -- missing source code
;

create view COLUMN_PRIVILEGES as -- missing source code
;

create view COLUMN_STATISTICS as -- missing source code
;

create view ENGINES as -- missing source code
;

create view EVENTS as -- missing source code
;

create view FILES as -- missing source code
;

create view INNODB_BUFFER_PAGE as -- missing source code
;

create view INNODB_BUFFER_PAGE_LRU as -- missing source code
;

create view INNODB_BUFFER_POOL_STATS as -- missing source code
;

create view INNODB_CACHED_INDEXES as -- missing source code
;

create view INNODB_CMP as -- missing source code
;

create view INNODB_CMPMEM as -- missing source code
;

create view INNODB_CMPMEM_RESET as -- missing source code
;

create view INNODB_CMP_PER_INDEX as -- missing source code
;

create view INNODB_CMP_PER_INDEX_RESET as -- missing source code
;

create view INNODB_CMP_RESET as -- missing source code
;

create view INNODB_COLUMNS as -- missing source code
;

create view INNODB_DATAFILES as -- missing source code
;

create view INNODB_FIELDS as -- missing source code
;

create view INNODB_FOREIGN as -- missing source code
;

create view INNODB_FOREIGN_COLS as -- missing source code
;

create view INNODB_FT_BEING_DELETED as -- missing source code
;

create view INNODB_FT_CONFIG as -- missing source code
;

create view INNODB_FT_DEFAULT_STOPWORD as -- missing source code
;

create view INNODB_FT_DELETED as -- missing source code
;

create view INNODB_FT_INDEX_CACHE as -- missing source code
;

create view INNODB_FT_INDEX_TABLE as -- missing source code
;

create view INNODB_INDEXES as -- missing source code
;

create view INNODB_METRICS as -- missing source code
;

create view INNODB_TABLES as -- missing source code
;

create view INNODB_TABLESPACES as -- missing source code
;

create view INNODB_TABLESPACES_BRIEF as -- missing source code
;

create view INNODB_TABLESTATS as -- missing source code
;

create view INNODB_TEMP_TABLE_INFO as -- missing source code
;

create view INNODB_TRX as -- missing source code
;

create view INNODB_VIRTUAL as -- missing source code
;

create view KEYWORDS as -- missing source code
;

create view KEY_COLUMN_USAGE as -- missing source code
;

create view OPTIMIZER_TRACE as -- missing source code
;

create view PARAMETERS as -- missing source code
;

create view PARTITIONS as -- missing source code
;

create view PLUGINS as -- missing source code
;

create view PROCESSLIST as -- missing source code
;

create view PROFILING as -- missing source code
;

create view REFERENTIAL_CONSTRAINTS as -- missing source code
;

create view RESOURCE_GROUPS as -- missing source code
;

create view ROUTINES as -- missing source code
;

create view SCHEMATA as -- missing source code
;

create view SCHEMA_PRIVILEGES as -- missing source code
;

create view STATISTICS as -- missing source code
;

create view ST_GEOMETRY_COLUMNS as -- missing source code
;

create view ST_SPATIAL_REFERENCE_SYSTEMS as -- missing source code
;

create view TABLES as -- missing source code
;

create view TABLESPACES as -- missing source code
;

create view TABLE_CONSTRAINTS as -- missing source code
;

create view TABLE_PRIVILEGES as -- missing source code
;

create view TRIGGERS as -- missing source code
;

create view USER_PRIVILEGES as -- missing source code
;

create view VIEWS as -- missing source code
;

create definer = viadmin@`%` view mvp2.vw_Kpis as select `K`.`id`                                                                                                   AS `id`,
       `P`.`orgId`                                                                                                AS `orgId`,
       `K`.`deptId`                                                                                               AS `deptId`,
       `K`.`title`                                                                                                AS `title`,
       `K`.`description`                                                                                          AS `description`,
       `K`.`level`                                                                                                AS `level`,
       `K`.`type`                                                                                                 AS `type`,
       `K`.`orgPriority`                                                                                          AS `orgPriority`,
       `K`.`active`                                                                                               AS `active`,
       `K`.`status`                                                                                               AS `status`,
       `K`.`projectId`                                                                                            AS `projectId`,
       `K`.`formulaDescription`                                                                                   AS `formulaDescription`,
       `K`.`departmentId`                                                                                         AS `departmentId`,
       `P`.`title`                                                                                                AS `projectTitle`,
       `O`.`name`                                                                                                 AS `orgName`,
       (select group_concat(`KT`.`tag` separator ',')
        from `mvp2`.`KpiTags` `KT`
        where (`KT`.`kpiId` = `K`.`id`))                                                                          AS `tags`
from ((`mvp2`.`Projects` `P` join `mvp2`.`Organizations` `O`)
         join `mvp2`.`Kpis` `K`)
where ((`K`.`projectId` = `P`.`id`) and (`P`.`orgId` = `O`.`id`));

create definer = viadmin@`%` view mvp2.vw_ProjectPersonsTemp as select `Pe`.`id` AS `personId`, `Pr`.`id` AS `projectId`, `O`.`id` AS `orgId`
from `mvp2`.`Persons` `Pe`
         join `mvp2`.`Organizations` `O`
         join `mvp2`.`Projects` `Pr`
where ((`Pe`.`orgId` = `O`.`id`) and (`Pr`.`orgId` = `O`.`id`));

create definer = viadmin@`%` view mvp2.vw_SearchData as select `mvp2`.`Projects`.`id`          AS `id`,
                                                          `mvp2`.`Projects`.`orgId`       AS `orgid`,
                                                          `mvp2`.`Projects`.`title`       AS `title`,
                                                          `mvp2`.`Projects`.`description` AS `description`,
                                                          `mvp2`.`Projects`.`summary`     AS `summary`,
                                                          `mvp2`.`Projects`.`title`       AS `project`,
                                                          'Projects'                      AS `source`
                                                   from `mvp2`.`Projects`
                                                   union
                                                   select `mvp2`.`Kpis`.`id`          AS `id`,
                                                          `mvp2`.`Kpis`.`orgId`       AS `orgid`,
                                                          `mvp2`.`Kpis`.`title`       AS `title`,
                                                          `mvp2`.`Kpis`.`description` AS `description`,
                                                          ''                          AS `summary`,
                                                          `mvp2`.`Projects`.`title`   AS `project`,
                                                          'Kpis'                      AS `source`
                                                   from (`mvp2`.`Kpis`
                                                            join `mvp2`.`Projects`)
                                                   where (`mvp2`.`Kpis`.`projectId` = `mvp2`.`Projects`.`id`)
                                                   union
                                                   select `mvp2`.`Milestones`.`id`          AS `id`,
                                                          `mvp2`.`Milestones`.`orgId`       AS `orgid`,
                                                          `mvp2`.`Milestones`.`title`       AS `title`,
                                                          `mvp2`.`Milestones`.`description` AS `description`,
                                                          ''                                AS `summary`,
                                                          `mvp2`.`Projects`.`title`         AS `project`,
                                                          'Milestones'                      AS `source`
                                                   from (`mvp2`.`Milestones`
                                                            join `mvp2`.`Projects`)
                                                   where (`mvp2`.`Milestones`.`projectId` = `mvp2`.`Projects`.`id`)
                                                   union
                                                   select `mvp2`.`Tasks`.`id`          AS `id`,
                                                          `mvp2`.`Projects`.`orgId`    AS `orgid`,
                                                          `mvp2`.`Tasks`.`title`       AS `title`,
                                                          `mvp2`.`Tasks`.`description` AS `description`,
                                                          `mvp2`.`Tasks`.`comments`    AS `summary`,
                                                          `mvp2`.`Projects`.`title`    AS `project`,
                                                          'Actions'                    AS `source`
                                                   from (`mvp2`.`Tasks`
                                                            join `mvp2`.`Projects`)
                                                   where (`mvp2`.`Tasks`.`projectId` = `mvp2`.`Projects`.`id`)
                                                   union
                                                   select `mvp2`.`Departments`.`id`          AS `id`,
                                                          `mvp2`.`Departments`.`orgId`       AS `orgid`,
                                                          `mvp2`.`Departments`.`name`        AS `title`,
                                                          `mvp2`.`Departments`.`description` AS `description`,
                                                          ''                                 AS `summary`,
                                                          ''                                 AS `project`,
                                                          'Departments'                      AS `source`
                                                   from `mvp2`.`Departments`
                                                   union
                                                   select `mvp2`.`Persons`.`id`       AS `id`,
                                                          `mvp2`.`Persons`.`orgId`    AS `orgid`,
                                                          `mvp2`.`Persons`.`fullName` AS `title`,
                                                          ''                          AS `description`,
                                                          ''                          AS `summary`,
                                                          ''                          AS `project`,
                                                          'Persons'                   AS `source`
                                                   from `mvp2`.`Persons`;

create definer = viadmin@`%` view mvp2.vw_Tasks as select `T`.`id`                                     AS `id`,
       `T`.`projectId`                              AS `projectId`,
       `T`.`assignedTo`                             AS `assignedTo`,
       `T`.`title`                                  AS `title`,
       `T`.`description`                            AS `description`,
       `T`.`status`                                 AS `status`,
       `T`.`createdAt`                              AS `createdAt`,
       `T`.`updatedAt`                              AS `updatedAt`,
       concat(`P`.`firstName`, ' ', `P`.`lastName`) AS `fullName`
from `mvp2`.`Tasks` `T`
         join `mvp2`.`Persons` `P`
where (`T`.`assignedTo` = `P`.`id`);

-- comment on view mvp2.vw_Tasks not supported: View 'mvp2.vw_Tasks' references invalid table(s) or column(s) or function(s) or definer/invoker of view lack rights to use them

create definer = viadmin@`%` function mvp2.getMindmapJsonNode(mindmapId int, id varchar(50)) returns json
begin
    declare
        json_out json;
    -- Replace ".id" with "" to get the full node.
    set json_out = (select json_unquote(json_extract(mapData,
        replace(json_unquote(json_search(mapData, 'one', id)), '.id', '')))
       from Mindmaps m where m.id = mindmapId limit 1);
    return json_out;
END;

create definer = viadmin@`%` procedure mvp2.insert_kpi_with_project(IN p_org_id int, IN p_kpi_title varchar(255), IN p_kpi_descr varchar(255), IN p_kpi_formula varchar(255), IN p_mindmap_node_id varchar(30), IN p_proj_title varchar(100), IN p_proj_descr varchar(300))
BEGIN
    set @kpiId = 0;

    insert into Kpis (orgId, title, description, formulaDescription, mindmapNodeId, active)
    values (p_org_id, p_kpi_title, p_kpi_descr, p_kpi_formula, p_mindmap_node_id, 1);
    -- insert into Kpis (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription)
    -- values (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription);

    -- Get the inserted value for the new kpi ID.
    set @kpiId = LAST_INSERT_ID();
    SELECT concat('kpi id = ', @kpiId);

    insert into Projects (orgId, title, description, mainKpiId)
    values (p_org_id, p_proj_title, p_proj_descr, @kpiId);

END;

create definer = viadmin@`%` procedure mvp2.setProject(IN kpiId int, IN organizationId int, IN projectTitle varchar(100), IN projectDescription varchar(300))
begin
    declare projectId integer;
    declare notFound INTEGER DEFAULT 0;
    declare projectCursor cursor for select id from Projects where mainKpiId = kpiId
        and orgId = organizationId;

    declare CONTINUE HANDLER
        FOR NOT FOUND SET notFound = 1;
    open projectCursor;

    FETCH projectCursor INTO projectId;
    select 'project id = ' + projectId;

    close projectCursor;

    IF notFound = 1 THEN
        -- add project
        insert into Projects (title, description, mainKpiId, orgId)
        values (projectTitle, projectDescription, kpiId, organizationId);
        -- set returnText = concat('Project ''', projectTitle, ''' has been created.');
    else
        update Projects
        set title = projectTitle,
            description = projectDescription
            where id = projectId and orgId = organizationId;
        -- set returnText = concat('Project ''', projectTitle, ''' has been updated.');
    END IF;
END;

create definer = viadmin@`%` procedure mvp2.sp_MostRecentProjects()
begin
    select id, title as ProjTitle, Pdate as ProjectUpdated,
          greatest(Pdate,
                  COALESCE(Tdate, '2000-01-01'),
                  COALESCE(TCdate, '2000-01-01'),
                  COALESCE(Kdate, '2000-01-01'),
                  COALESCE(KCdate, '2000-01-01')
            ) as MostRecent from
  (
  select  P.id as id, P.title , P.updatedAt as Pdate ,
       (select max(T.updatedAt) from Tasks T where
         T.projectId = P.id) as Tdate,
       (select max(T.createdAt) from Tasks T where
         T.projectId = P.id) as TCdate,
      (select max(K.updatedAt) from Kpis K, KpiProjects KP where
          K.id = KP.kpiId
          and P.id = KP.projectId) as Kdate,
      (select max(K.createdAt) from Kpis K, KpiProjects KP where
          K.id = KP.kpiId
          and P.id = KP.projectId) as KCdate
   from Projects P) as Proj
  order by MostRecent desc;
end;

