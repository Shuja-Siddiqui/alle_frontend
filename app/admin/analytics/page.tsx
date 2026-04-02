"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../../../components/StatCard";
import { RetentionMetrics } from "../../../components/RetentionMetrics";
import { StudentsActivityChart } from "../../../components/StudentsActivityChart";
import { StruggleRangeSliders } from "../../../components/StruggleRangeSliders";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { DownloadReportDialog, DownloadReportFormData } from "../../../components/DownloadReportDialog";
import { AdminAnalyticsSkeleton } from "../../../components/Skeletons/AdminAnalyticsSkeleton";
import { api } from "../../../lib/api-client";

type DailyActivityPoint = {
  day: string;
  students: number;
  date?: string;
};

type StruggleData = {
  module: string;
  percentage: number;
  struggling: number;
  total: number;
};

export default function AnalyticsPage() {
  const [showDownloadReportDialog, setShowDownloadReportDialog] = useState(false);
  const [dailyActivity, setDailyActivity] = useState<DailyActivityPoint[]>([]);
  const [totalStudentsThisWeek, setTotalStudentsThisWeek] = useState<number>(0);
  const [engagementRate, setEngagementRate] = useState<number>(66);
  const [engagementChange, setEngagementChange] = useState<number>(4);
  const [totalStudentsInSchool, setTotalStudentsInSchool] = useState<number>(0);
  const [studentsGrowthPercent, setStudentsGrowthPercent] = useState<number | null>(null);
  const [avgAccuracyThisWeek, setAvgAccuracyThisWeek] = useState<number | null>(null);
  const [avgAccuracyChange, setAvgAccuracyChange] = useState<number | null>(null);
  const [avgSessionMinutesThisWeek, setAvgSessionMinutesThisWeek] = useState<number | null>(null);
  const [struggleData, setStruggleData] = useState<StruggleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyActiveUsers() {
      try {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 6); // Last 7 days including today

        const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
        const startDate = toIsoDate(start);
        const endDate = toIsoDate(today);

        const response = await api.get<any>(
          `/reports/daily-active-users?startDate=${startDate}&endDate=${endDate}`
        );

        const raw: any[] = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        const countsByDate = new Map<string, number>();
        for (const row of raw) {
          const dateKey =
            typeof row.date === "string"
              ? row.date.slice(0, 10)
              : row.date
              ? new Date(row.date).toISOString().slice(0, 10)
              : null;
          if (!dateKey) continue;
          const count = Number(row.activeCount ?? row.active_count ?? 0);
          countsByDate.set(dateKey, count);
        }

        const points: DailyActivityPoint[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = toIsoDate(d);
          const count = countsByDate.get(key) ?? 0;

          points.push({
            day: d.toLocaleDateString(undefined, { weekday: "short" }),
            date: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
            students: count,
          });
        }

        const total = points.reduce((sum, p) => sum + p.students, 0);
        setDailyActivity(points);
        setTotalStudentsThisWeek(total);
      } catch (error) {
        console.error("Failed to load daily active users for analytics page:", error);
        setDailyActivity([]);
        setTotalStudentsThisWeek(0);
      }
    }

    fetchDailyActiveUsers().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    async function fetchSchoolWeeklyEngagement() {
      try {
        const response = await api.get<any>("/reports/school-weekly-engagement");
        const data = response?.data ?? response ?? {};
        const rate =
          data.engagementRateThisWeek != null
            ? Number(data.engagementRateThisWeek)
            : engagementRate;
        const change =
          data.changeInPercentagePoints != null
            ? Number(data.changeInPercentagePoints)
            : engagementChange;

        setEngagementRate(rate);
        setEngagementChange(change);
      } catch (error) {
        console.error("Failed to load school weekly engagement for analytics page:", error);
        // Keep defaults on error
      }
    }

    fetchSchoolWeeklyEngagement();
  }, []);

  useEffect(() => {
    async function fetchSchoolWeeklyAccuracy() {
      try {
        const response = await api.get<any>("/reports/school-weekly-accuracy");
        const data = response?.data ?? response ?? {};
        const avgThis =
          data.avgAccuracyThisWeek != null ? Number(data.avgAccuracyThisWeek) : null;
        const change =
          data.changeInPercentagePoints != null
            ? Number(data.changeInPercentagePoints)
            : null;

        setAvgAccuracyThisWeek(avgThis);
        setAvgAccuracyChange(change);
      } catch (error) {
        console.error("Failed to load school weekly accuracy for analytics page:", error);
        setAvgAccuracyThisWeek(null);
        setAvgAccuracyChange(null);
      }
    }

    fetchSchoolWeeklyAccuracy();
  }, []);

  useEffect(() => {
    async function fetchSchoolWeeklySessionTime() {
      try {
        const response = await api.get<any>("/reports/school-weekly-session-time");
        const data = response?.data ?? response ?? {};
        const minutes =
          data.avgSessionMinutesPerStudent != null
            ? Number(data.avgSessionMinutesPerStudent)
            : null;
        setAvgSessionMinutesThisWeek(minutes);
      } catch (error) {
        console.error("Failed to load school weekly session time for analytics page:", error);
        setAvgSessionMinutesThisWeek(null);
      }
    }

    fetchSchoolWeeklySessionTime();
  }, []);

  useEffect(() => {
    async function fetchMostStruggledLessons() {
      try {
        const response = await api.get<any>("/reports/most-struggled-lessons?limit=3");
        const rows: any[] = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        const mapped: StruggleData[] = rows.map((row) => {
          const struggling = Number(row.studentsWhoFailed ?? 0);
          const total = Number(row.totalStudentsAttempted ?? struggling);

          return {
            module: row.lessonTitle
              ? `Lesson ${row.lessonOrder || 0}: ${row.lessonTitle}`
              : `Lesson ${row.lessonOrder || 0}`,
            percentage: Number(row.percentageOnLesson ?? 0),
            struggling,
            total,
          };
        });

        setStruggleData(mapped);
      } catch (error) {
        console.error("Failed to load most struggled lessons for analytics page:", error);
        setStruggleData([]);
      }
    }

    fetchMostStruggledLessons();
  }, []);

  useEffect(() => {
    async function fetchTotalStudents() {
      try {
        const response = await api.get<any>("/dashboard/stats");
        const payload = response?.data ?? response ?? {};
        const total = payload.totalStudents != null ? Number(payload.totalStudents) : 0;
        const growth =
          payload.studentsGrowthPercentage != null
            ? Number(payload.studentsGrowthPercentage)
            : null;
        setTotalStudentsInSchool(total);
        setStudentsGrowthPercent(growth);
      } catch (error) {
        console.error("Failed to load total students for analytics page:", error);
        setTotalStudentsInSchool(0);
        setStudentsGrowthPercent(null);
      }
    }

    fetchTotalStudents();
  }, []);

  function handleNotificationClick() {
    // TODO: Implement notification click handler
    console.log("Notification clicked");
  }

  function handleDownloadReportClick() {
    setShowDownloadReportDialog(true);
  }

  function handleDownloadReport(data: DownloadReportFormData) {
    // TODO: Implement download report API call
    console.log("Downloading report:", data);
    setShowDownloadReportDialog(false);
  }

  function handleResetReport() {
    // Reset is handled inside the dialog
  }

  return (
    <div
      className="flex-1 overflow-auto"
      style={{
        padding: "40px 40px 32px 40px",
      }}
    >
      {loading ? (
        <AdminAnalyticsSkeleton />
      ) : (
        <>
      {/* Navbar */}
      <div style={{ marginBottom: "24px" }}>
        <AdminNavbar
          title="Analytics"
          onNotificationClick={handleNotificationClick}
          onDownloadReportClick={handleDownloadReportClick}
          showDownloadReport={true}
        />
      </div>

      {/* Stats Cards Row */}
      <div className="flex gap-[24px] items-center" style={{ marginBottom: "24px" }}>
        {/* Card 1: Total Students */}
        <StatCard
          title={String(totalStudentsInSchool)}
          supportiveText={
            studentsGrowthPercent != null
              ? `${studentsGrowthPercent >= 0 ? "+" : ""}${studentsGrowthPercent}% vs last month`
              : "vs last month"
          }
          supportiveTextColor="green"
          subtitle="Total Students"
          iconSrc="/assets/icons/admin/students.svg"
          iconAlt="Students icon"
          className="w-[364px] shrink-0"
        />

        {/* Card 2: Students improved results */}
        <StatCard
          title={
            avgAccuracyThisWeek != null ? String(avgAccuracyThisWeek) : "–"
          }
          supportiveText={
            avgAccuracyChange != null
              ? `${avgAccuracyChange >= 0 ? "+" : ""}${avgAccuracyChange}% vs last week`
              : "vs last week"
          }
          supportiveTextColor="green"
          subtitle="Avg accuracy (this week)."
          iconSrc="/assets/icons/admin/analytics.svg"
          iconAlt="Analytics icon"
          className="w-[364px] shrink-0"
        />

        {/* Card 3: Avg. Session Time */}
        <StatCard
          title={
            avgSessionMinutesThisWeek != null
              ? String(avgSessionMinutesThisWeek)
              : "–"
          }
          supportiveText="Avg session time per student (this week)"
          supportiveTextColor="gray"
          subtitle="Avg. Session Time"
          iconSrc="/assets/icons/admin/modules.svg"
          iconAlt="Modules icon"
          className="w-[364px] shrink-0"
        />
      </div>

      {/* Charts Row */}
      <div className="flex gap-[24px] items-start">
        {/* Left: Retention Metrics Chart */}
        <RetentionMetrics percentage={engagementRate} changePercentage={engagementChange} />

        {/* Right: Students Activity Chart and Struggle Sliders stacked */}
        <div className="flex flex-col gap-[24px] items-start">
          {/* Students Activity Chart */}
          <StudentsActivityChart dailyData={dailyActivity} totalStudents={totalStudentsThisWeek} />

          {/* Struggle Range Sliders - directly under Students Activity Chart */}
          <StruggleRangeSliders struggleData={struggleData} />
        </div>
      </div>

      {/* Download Report Dialog */}
      <DownloadReportDialog
        open={showDownloadReportDialog}
        onClose={() => setShowDownloadReportDialog(false)}
        onDownload={handleDownloadReport}
        onReset={handleResetReport}
      />
      </>
      )}
    </div>
  );
}

