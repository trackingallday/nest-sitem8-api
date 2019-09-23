USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[SiteAssignment]    Script Date: 18/09/2019 8:39:40 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[SiteAssignment](
	[SiteAssignmentId] [int] IDENTITY(1,1) NOT NULL,
	[SiteId] [int] NOT NULL,
	[SupervisingWorkerId] [int] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[Archived] [bit] NOT NULL,
	[CanAddWorkerFromLocationTimestamp] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SiteAssignmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[SiteAssignment]  WITH CHECK ADD FOREIGN KEY([SiteId])
REFERENCES [dbo].[Site] ([SiteId])
GO

ALTER TABLE [dbo].[SiteAssignment]  WITH CHECK ADD FOREIGN KEY([SupervisingWorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

