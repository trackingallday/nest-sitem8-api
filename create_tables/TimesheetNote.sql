USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[TimesheetNote]    Script Date: 18/09/2019 8:46:41 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TimesheetNote](
	[TimesheetNoteId] [int] IDENTITY(1,1) NOT NULL,
	[CreationDateTime] [datetime] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[Details] [varchar](160) NOT NULL,
	[TimesheetId] [int] NOT NULL,
	[Priority] [int] NOT NULL,
 CONSTRAINT [PK__Timeshee__9B370785156937F6] PRIMARY KEY CLUSTERED 
(
	[TimesheetNoteId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TimesheetNote] ADD  CONSTRAINT [DF_TimesheetNote_Priority]  DEFAULT ((0)) FOR [Priority]
GO

ALTER TABLE [dbo].[TimesheetNote]  WITH CHECK ADD  CONSTRAINT [FK__Timesheet__Worke__11158940] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[TimesheetNote] CHECK CONSTRAINT [FK__Timesheet__Worke__11158940]
GO

ALTER TABLE [dbo].[TimesheetNote]  WITH CHECK ADD  CONSTRAINT [FK_TimesheetNote_TimesheetNote] FOREIGN KEY([TimesheetId])
REFERENCES [dbo].[Timesheet] ([TimesheetId])
GO

ALTER TABLE [dbo].[TimesheetNote] CHECK CONSTRAINT [FK_TimesheetNote_TimesheetNote]
GO

