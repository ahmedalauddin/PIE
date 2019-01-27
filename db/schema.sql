-- host: valueinfinity2.cgrq1bgu4ual.us-east-2.rds.amazonaws.com
-- db:   mvp2
-- user: viadmin
-- pwd:  chary-offshoot-which

use `mvp2`;

create table Organizations
(
	id                int             auto_increment,
	name              varchar(255)    not null,
	owningOrg         tinyint(1)      default 0,
	createdAt         datetime        default CURRENT_TIMESTAMP,
	updatedAt         datetime        default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint Organizations_pk
		primary key (id)
);

create table Persons
(
  id        	      int 				    auto_increment,
  orgId     	      int             not null,
  firstName 	      varchar(128)    null,
  lastName  	      varchar(128)    null,
  username  	      varchar(255)    null,
  email     	      varchar(255)    not null,
  hash				      varchar(255)    not null,
  disabled		      tinyint(1) 		  default 0,
  createdAt 	      datetime     	  default CURRENT_TIMESTAMP,
  updatedAt 	      datetime     	  default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  disabledAt 	      datetime 			  null,
  constraint Persons_pk
				primary key (id),
  FOREIGN KEY (orgId)
        REFERENCES Organizations(id)
        ON DELETE CASCADE,
  INDEX Persons_Organizations_ind (orgId),
  INDEX Persons_login_ind (email, hash, disabled)
);

create table Mindmaps
(
  id				        int             auto_increment,
  orgId			        int             not null,
	mapData		        JSON            null,
	createdAt         datetime        default CURRENT_TIMESTAMP,
  updatedAt         datetime        default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint Mindmaps_pk
		primary key (id),
  FOREIGN KEY (orgId)
        REFERENCES Organizations(id)
        ON DELETE CASCADE,
  INDEX Mindmaps_Organizations_ind (orgId)
);

create table Projects
(
  id                int             auto_increment,
  orgId             int             not null,
  title             varchar(255)    not null,
  description       varchar(512)    null,
  businessGoal      varchar(255)    null,
  progress          int             default 0,
  startAt    	      datetime        default CURRENT_TIMESTAMP,
  endAt             date            null,

  createdAt 		    datetime     		default CURRENT_TIMESTAMP,
  updatedAt 		    datetime     		default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint Projects_pk
		primary key (id),
  FOREIGN KEY (orgId)
        REFERENCES Organizations(id)
        ON DELETE CASCADE,
	INDEX Projects_Organizations_ind (orgId),
	INDEX Projects_title_ind (title),
	INDEX Projects_startAt_ind (startAt)
);

create table ProjectPersons
(
  projectId			    int		          not null,
  personId			    int		          not null,
  owner					    tinyint(1)      default 0,
  createdAt 		    datetime        default CURRENT_TIMESTAMP,
  updatedAt 		    datetime        default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  constraint ProjectPersons_pk
		primary key (projectId, personId),
	foreign key (projectId)
		references Projects(id)
		on delete cascade,
	foreign key (personId)
		references Persons(id)
		on delete cascade
);

create table Tasks
(
  id          	int          auto_increment,
  projectId   	int          not null,
  assignedTo  	int          not null,
  title       	varchar(255) not null,
  description 	varchar(255) null,
  status      	varchar(255) null,
  createdAt 		datetime     default CURRENT_TIMESTAMP,
  updatedAt 		datetime     default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint Tasks_pk
		primary key (id),
  FOREIGN KEY (projectId)
        REFERENCES Projects(id)
        ON DELETE CASCADE,
  FOREIGN KEY (assignedTo)
				REFERENCES Persons(id)
				ON DELETE CASCADE,
	INDEX Tasks_Projects_ind (projectId),
	INDEX Tasks_assignedTo_ind (assignedTo),
	INDEX Tasks_status_ind (status)
);

create table Kpis
(
  id          int          	auto_increment,
  orgId				int						not null,
  title       varchar(255) 	not null,
  description varchar(255) 	null,
  level       int          	null,
  type        varchar(255) 	null,
  status      varchar(255) 	null,
  createdAt 	datetime     	default CURRENT_TIMESTAMP,
  updatedAt 	datetime    	default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint Kpis_pk
		primary key (id),
  FOREIGN KEY (orgId)
        REFERENCES Organizations(id)
        ON DELETE CASCADE,
  INDEX Kpis_Organizations_ind (orgId),
	INDEX kpis_title_ind (title)
);

create table KpiProjects
(
  projectId			int		not null,
  kpiId	  			int		not null,
  createdAt 		datetime     default CURRENT_TIMESTAMP,
  updatedAt 		datetime     default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  constraint KpiProjects_pk
		primary key (projectId, kpiId),
	foreign key (kpiId)
		references Kpis(id)
		on delete cascade,
	foreign key (projectId)
		references Projects(id)
		on delete cascade
);

create table DataSources
(
  id          int          auto_increment,
  orgId				int					 not null,
  title  			varchar(255) not null,
  description varchar(255) null,
  sourceFile  varchar(512) null,
  createdAt 	datetime     	default CURRENT_TIMESTAMP,
  updatedAt 	datetime    	default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint DataSources_pk
		primary key (id),
  FOREIGN KEY (orgId)
        REFERENCES Organizations(id)
        ON DELETE CASCADE,
  INDEX DataSources_organization_ind (orgId),
	INDEX DataSources_title_ind (title)
);

create table DataSets
(
  id          	int          auto_increment,
  dataSourceId	int					 not null,
  projectId	  	int					 not null,
  title					varchar(255) not null,
  description 	varchar(255) null,
  sourceFile  	varchar(512) null,
  createdAt 		datetime     	default CURRENT_TIMESTAMP,
  updatedAt 		datetime    	default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	constraint DataSets_pk
		primary key (id),
  FOREIGN KEY (dataSourceId)
        REFERENCES DataSources(id)
        ON DELETE CASCADE,
  FOREIGN KEY (projectId)
        REFERENCES Projects(id)
        ON DELETE CASCADE,
	INDEX DataSets_DataSources_ind (dataSourceId),
	INDEX DataSets_Projects_ind (projectId),
	INDEX DataSets_title_ind (title)
);
