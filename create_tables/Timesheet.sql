USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[Timesheet]    Script Date: 18/09/2019 8:45:44 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Timesheet](
	[TimesheetId] [int] IDENTITY(1,1) NOT NULL,
	[StartDateTime] [datetime] NOT NULL,
	[FinishDateTime] [datetime] NOT NULL,
	[Status] [int] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[CompanyId] [int] NOT NULL,
 CONSTRAINT [PK__Timeshee__848CBE2D4C4F863E] PRIMARY KEY CLUSTERED 
(
	[TimesheetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Timesheet]  WITH CHECK ADD  CONSTRAINT [FK_Timesheet_Worker] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[Timesheet] CHECK CONSTRAINT [FK_Timesheet_Worker]
GO

