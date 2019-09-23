USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[WorkerAssignment]    Script Date: 18/09/2019 8:47:29 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[WorkerAssignment](
	[WorkerAssignmentId] [int] IDENTITY(1,1) NOT NULL,
	[SiteAssignmentId] [int] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[AssignedStatus] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[WorkerAssignmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[WorkerAssignment]  WITH CHECK ADD FOREIGN KEY([SiteAssignmentId])
REFERENCES [dbo].[SiteAssignment] ([SiteAssignmentId])
GO

ALTER TABLE [dbo].[WorkerAssignment]  WITH CHECK ADD FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

