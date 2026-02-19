"use client";

import { useState } from "react";
import { StatCard } from "../../../components/StatCard";
import { RetentionMetrics } from "../../../components/RetentionMetrics";
import { StudentsActivityChart } from "../../../components/StudentsActivityChart";
import { StruggleRangeSliders } from "../../../components/StruggleRangeSliders";
import { AdminNavbar } from "../../../components/AdminNavbar";
import { DownloadReportDialog, DownloadReportFormData } from "../../../components/DownloadReportDialog";

export default function AnalyticsPage() {
  const [showDownloadReportDialog, setShowDownloadReportDialog] = useState(false);

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
          title="1,890"
          supportiveText="+8% last month"
          supportiveTextColor="green"
          subtitle="Total Students"
          iconSrc="/assets/icons/admin/students.svg"
          iconAlt="Students icon"
          className="w-[364px] shrink-0"
        />

        {/* Card 2: Students improved results */}
        <StatCard
          title="285"
          supportiveText="+15% vs last week"
          supportiveTextColor="green"
          subtitle="Students improved results."
          iconSrc="/assets/icons/admin/analytics.svg"
          iconAlt="Analytics icon"
          className="w-[364px] shrink-0"
        />

        {/* Card 3: Avg. Session Time */}
        <StatCard
          title="24"
          supportiveText="Daily average per active student"
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
        <RetentionMetrics percentage={66} changePercentage={4} />

        {/* Right: Students Activity Chart and Struggle Sliders stacked */}
        <div className="flex flex-col gap-[24px] items-start">
          {/* Students Activity Chart */}
          <StudentsActivityChart totalStudents={213} />

          {/* Struggle Range Sliders - directly under Students Activity Chart */}
          <StruggleRangeSliders />
        </div>
      </div>

      {/* Download Report Dialog */}
      <DownloadReportDialog
        open={showDownloadReportDialog}
        onClose={() => setShowDownloadReportDialog(false)}
        onDownload={handleDownloadReport}
        onReset={handleResetReport}
      />
    </div>
  );
}

