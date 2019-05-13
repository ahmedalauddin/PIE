create table KpiTags
(
    kpiId     int                                not null,
    tag       varchar(60)                        not null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    primary key (kpiId, tag)
);

create index kpiId
    on KpiTags (kpiId);

create table Organizations
(
    id        int auto_increment
        primary key,
    name      varchar(255)                         not null,
    owningOrg tinyint(1) default 0                 null,
    createdAt datetime   default CURRENT_TIMESTAMP null,
    updatedAt datetime   default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table DataSources
(
    id          int auto_increment
        primary key,
    orgId       int                                not null,
    title       varchar(255)                       not null,
    description varchar(255)                       null,
    sourceFile  varchar(512)                       null,
    createdAt   datetime default CURRENT_TIMESTAMP null,
    updatedAt   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint DataSources_ibfk_1
        foreign key (orgId) references Organizations (id)
            on delete cascade
);

create index DataSources_organization_ind
    on DataSources (orgId);

create index DataSources_title_ind
    on DataSources (title);

create table Departments
(
    id          int auto_increment
        primary key,
    name        varchar(100) null,
    description varchar(255) null,
    orgId       int          null,
    createdAt   datetime     null,
    updatedAt   datetime     null,
    constraint Departments_Organizations_id_fk
        foreign key (orgId) references Organizations (id)
            on delete cascade
)
    comment 'Organization departments';

create table Kpis
(
    id                 int auto_increment
        primary key,
    orgId              int                                not null,
    deptId             int                                null,
    title              varchar(255)                       not null,
    description        varchar(255)                       null,
    level              int                                null,
    type               varchar(255)                       null,
    status             varchar(255)                       null,
    projectId          int                                null,
    formulaDescription varchar(255)                       null,
    departmentId       int                                null,
    active             tinyint  default 1                 null,
    createdAt          datetime default CURRENT_TIMESTAMP null,
    updatedAt          datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Kpis_Departments_id_fk
        foreign key (deptId) references Departments (id),
    constraint Kpis_ibfk_1
        foreign key (orgId) references Organizations (id)
            on delete cascade
);

create index Kpis_Organizations_ind
    on Kpis (orgId);

create index kpis_title_ind
    on Kpis (title);

create table Mindmaps
(
    id        int auto_increment
        primary key,
    orgId     int                                not null,
    mapData   json                               null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Mindmaps_ibfk_1
        foreign key (orgId) references Organizations (id)
            on delete cascade
);

create index Mindmaps_Organizations_ind
    on Mindmaps (orgId);

create table Persons
(
    id         int auto_increment
        primary key,
    orgId      int                                  not null,
    firstName  varchar(128)                         null,
    lastName   varchar(128)                         null,
    username   varchar(255)                         null,
    allowLogin tinyint(1) default 0                 null,
    email      varchar(255)                         not null,
    deptId     int                                  null,
    role       varchar(50)                          null,
    pwdhash    varchar(255)                         not null,
    disabled   tinyint(1) default 0                 null,
    lastLogin  datetime                             null,
    createdAt  datetime   default CURRENT_TIMESTAMP null,
    updatedAt  datetime   default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    disabledAt datetime                             null,
    constraint persons_email
        unique (email),
    constraint Persons_Departments_id_fk
        foreign key (deptId) references Departments (id),
    constraint Persons_ibfk_1
        foreign key (orgId) references Organizations (id)
            on delete cascade
);

create index Persons_Organizations_ind
    on Persons (orgId);

create index Persons_login_ind
    on Persons (email, pwdhash, disabled);

create table SequelizeMeta
(
    name varchar(255) not null,
    constraint name
        unique (name)
)
    collate = utf8_unicode_ci;

alter table SequelizeMeta
    add primary key (name);

create table TaskPriorities
(
    id        int                                not null
        primary key,
    label     varchar(30)                        null,
    priority  int                                null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    updatedAt datetime default CURRENT_TIMESTAMP null
);

create table TaskStatuses
(
    id        int                                not null
        primary key,
    label     varchar(30)                        null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    updatedAt datetime default CURRENT_TIMESTAMP null
)
    comment 'List of task statuses';

create table Projects
(
    id            int auto_increment
        primary key,
    orgId         int                                not null,
    title         varchar(255)                       not null,
    description   varchar(512)                       null,
    summary       text                               null,
    businessGoal  varchar(255)                       null,
    progress      int      default 0                 null,
    currentTaskId int                                null,
    startAt       datetime default CURRENT_TIMESTAMP null,
    endAt         date                               null,
    mindmapId     int                                null,
    nodeId        varchar(16)                        null,
    statusId      int                                null,
    mainKpiId     int                                null,
    createdAt     datetime default CURRENT_TIMESTAMP null,
    updatedAt     datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Projects_ibfk_1
        foreign key (orgId) references Organizations (id)
            on delete cascade,
    constraint Projects_ibfk_2
        foreign key (mainKpiId) references Kpis (id)
            on delete cascade,
    constraint Projects_ibfk_3
        foreign key (statusId) references TaskStatuses (id)
);

create table DataSets
(
    id           int auto_increment
        primary key,
    dataSourceId int                                not null,
    projectId    int                                not null,
    title        varchar(255)                       not null,
    description  varchar(255)                       null,
    sourceFile   varchar(512)                       null,
    createdAt    datetime default CURRENT_TIMESTAMP null,
    updatedAt    datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint DataSets_ibfk_1
        foreign key (dataSourceId) references DataSources (id)
            on delete cascade,
    constraint DataSets_ibfk_2
        foreign key (projectId) references Projects (id)
            on delete cascade
);

create index DataSets_DataSources_ind
    on DataSets (dataSourceId);

create index DataSets_Projects_ind
    on DataSets (projectId);

create index DataSets_title_ind
    on DataSets (title);

create table KpiProjects
(
    projectId int                                not null,
    kpiId     int                                not null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    primary key (projectId, kpiId),
    constraint KpiProjects_ibfk_1
        foreign key (kpiId) references Kpis (id)
            on delete cascade,
    constraint KpiProjects_ibfk_2
        foreign key (projectId) references Projects (id)
            on delete cascade
);

create index kpiId
    on KpiProjects (kpiId);

create table ProjectPersons
(
    projectId int                                  not null,
    personId  int                                  not null,
    inProject tinyint(1) default 0                 null,
    owner     tinyint(1) default 0                 null,
    createdAt datetime   default CURRENT_TIMESTAMP null,
    updatedAt datetime   default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    primary key (projectId, personId),
    constraint ProjectPersons_ibfk_1
        foreign key (projectId) references Projects (id)
            on delete cascade,
    constraint ProjectPersons_ibfk_2
        foreign key (personId) references Persons (id)
            on delete cascade
);

create index personId
    on ProjectPersons (personId);

create index Projects_Mindmap_ind
    on Projects (mindmapId, nodeId);

create index Projects_Organizations_ind
    on Projects (orgId);

create index Projects_startAt_ind
    on Projects (startAt);

create index Projects_title_ind
    on Projects (title);

create table Tasks
(
    id          int auto_increment
        primary key,
    projectId   int                                not null,
    assignedTo  int                                not null,
    title       varchar(255)                       not null,
    description varchar(255)                       null,
    priorityId  int                                null,
    statusId    int                                null,
    createdAt   datetime default CURRENT_TIMESTAMP null,
    updatedAt   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint Tasks_ibfk_1
        foreign key (projectId) references Projects (id)
            on delete cascade,
    constraint Tasks_ibfk_2
        foreign key (assignedTo) references Persons (id)
            on delete cascade,
    constraint Tasks_ibfk_3
        foreign key (statusId) references TaskStatuses (id)
            on delete cascade,
    constraint Tasks_ibfk_4
        foreign key (priorityId) references TaskPriorities (id)
            on delete cascade
);

alter table Projects
    add constraint Projects_ibfk_4
        foreign key (currentTaskId) references Tasks (id);

create index Tasks_Projects_ind
    on Tasks (projectId);

create index Tasks_assignedTo_ind
    on Tasks (assignedTo);

create definer = viadmin@`%` view vw_Kpis as
select `K`.`id`                          AS `id`,
       `K`.`orgId`                       AS `orgId`,
       `K`.`deptId`                      AS `deptId`,
       `K`.`title`                       AS `title`,
       `K`.`description`                 AS `description`,
       `K`.`level`                       AS `level`,
       `K`.`type`                        AS `type`,
       `K`.`active`                      AS `active`,
       `K`.`status`                      AS `status`,
       `K`.`projectId`                   AS `projectId`,
       `K`.`formulaDescription`          AS `formulaDescription`,
       `K`.`departmentId`                AS `departmentId`,
       `P`.`title`                       AS `projectTitle`,
       `O`.`name`                        AS `orgName`,
       (select group_concat(`KT`.`tag` separator ',')
        from `mvp2`.`KpiTags` `KT`
        where (`KT`.`kpiId` = `K`.`id`)) AS `tags`
from `mvp2`.`Projects` `P`
         join `mvp2`.`Organizations` `O`
         join `mvp2`.`KpiProjects` `KP`
         join `mvp2`.`Kpis` `K`
where ((`K`.`id` = `KP`.`kpiId`) and (`KP`.`projectId` = `P`.`id`) and (`P`.`orgId` = `O`.`id`));

create definer = viadmin@`%` view vw_ProjectPersonsTemp as
select `Pe`.`id` AS `personId`, `Pr`.`id` AS `projectId`, `O`.`id` AS `orgId`
from `mvp2`.`Persons` `Pe`
         join `mvp2`.`Organizations` `O`
         join `mvp2`.`Projects` `Pr`
where ((`Pe`.`orgId` = `O`.`id`) and (`Pr`.`orgId` = `O`.`id`));

create definer = viadmin@`%` view vw_Tasks as
select `T`.`id`                                     AS `id`,
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

-- comment on view vw_Tasks not supported: View 'mvp2.vw_Tasks' references invalid table(s) or column(s) or function(s) or definer/invoker of view lack rights to use them

create
    definer = viadmin@`%` procedure sp_MostRecentProjects()
begin
    select id,
           title as ProjTitle,
           Pdate as ProjectUpdated,
           greatest(Pdate,
                    COALESCE(Tdate, '2000-01-01'),
                    COALESCE(TCdate, '2000-01-01'),
                    COALESCE(Kdate, '2000-01-01'),
                    COALESCE(KCdate, '2000-01-01')
               ) as MostRecent
    from (
             select P.id                        as id,
                    P.title,
                    P.updatedAt                 as Pdate,
                    (select max(T.updatedAt)
                     from Tasks T
                     where T.projectId = P.id)  as Tdate,
                    (select max(T.createdAt)
                     from Tasks T
                     where T.projectId = P.id)  as TCdate,
                    (select max(K.updatedAt)
                     from Kpis K,
                          KpiProjects KP
                     where K.id = KP.kpiId
                       and P.id = KP.projectId) as Kdate,
                    (select max(K.createdAt)
                     from Kpis K,
                          KpiProjects KP
                     where K.id = KP.kpiId
                       and P.id = KP.projectId) as KCdate
             from Projects P) as Proj
    order by MostRecent desc;
end;

