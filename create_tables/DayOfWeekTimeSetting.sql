USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[DayOfWeekTimeSetting]    Script Date: 18/09/2019 8:36:48 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DayOfWeekTimeSetting](
	[DayOfWeekTimeSettingId] [int] IDENTITY(1,1) NOT NULL,
	[SiteAssignmentId] [int] NOT NULL,
	[DayInWeek] [int] NOT NULL,
	[WorkingDayEarliestStart] [time](7) NOT NULL,
	[WorkingDayDefaultStart] [time](7) NOT NULL,
	[WorkingDayLatestFinish] [time](7) NOT NULL,
	[WorkingDayDefaultFinish] [time](7) NOT NULL,
	[MinimumLunchStart] [time](7) NOT NULL,
	[DefaultLunchStart] [time](7) NOT NULL,
	[DefaultLunchEnd] [time](7) NOT NULL,
	[MaximumLunchEnd] [time](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DayOfWeekTimeSettingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DayOfWeekTimeSetting]  WITH CHECK ADD FOREIGN KEY([SiteAssignmentId])
REFERENCES [dbo].[SiteAssignment] ([SiteAssignmentId])
GO

