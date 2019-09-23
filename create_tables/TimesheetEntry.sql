USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[TimesheetEntry]    Script Date: 18/09/2019 8:46:21 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TimesheetEntry](
	[TimesheetEntryId] [int] IDENTITY(1,1) NOT NULL,
	[TimesheetId] [int] NOT NULL,
	[StartDateTime] [datetime] NOT NULL,
	[FinishDateTime] [datetime] NOT NULL,
	[ModifiedWorkerId] [int] NULL,
	[SiteId] [int] NULL,
	[Travel] [bit] NOT NULL,
	[Description] [nvarchar](50) NULL,
	[SiteAssignmentId] [int] NULL,
	[WorkerAssignmentStatus] [int] NULL,
 CONSTRAINT [PK__Timeshee__5338D53CECB9B32F] PRIMARY KEY CLUSTERED 
(
	[TimesheetEntryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TimesheetEntry]  WITH CHECK ADD  CONSTRAINT [FK__Timesheet__Modif__339FAB6E] FOREIGN KEY([ModifiedWorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[TimesheetEntry] CHECK CONSTRAINT [FK__Timesheet__Modif__339FAB6E]
GO

ALTER TABLE [dbo].[TimesheetEntry]  WITH CHECK ADD  CONSTRAINT [FK__Timesheet__SiteI__3493CFA7] FOREIGN KEY([SiteId])
REFERENCES [dbo].[Site] ([SiteId])
GO

ALTER TABLE [dbo].[TimesheetEntry] CHECK CONSTRAINT [FK__Timesheet__SiteI__3493CFA7]
GO

ALTER TABLE [dbo].[TimesheetEntry]  WITH CHECK ADD  CONSTRAINT [FK__Timesheet__Times__32AB8735] FOREIGN KEY([TimesheetId])
REFERENCES [dbo].[Timesheet] ([TimesheetId])
GO

ALTER TABLE [dbo].[TimesheetEntry] CHECK CONSTRAINT [FK__Timesheet__Times__32AB8735]
GO

