import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import { DateRangeForm } from "./DateRangeForm";
import { StatsDisplay } from "./StatsDisplay";
import { getDashboardData } from "@/lib/data";
import DashboardCharts from "@/app/(admin-panel)/admin-panel/DashboardCharts";

const Dashboard = async (
  props: {
    searchParams: Promise<{ startDate: string; endDate: string }>;
  }
) => {
  const searchParams = await props.searchParams;
  const { startDate, endDate } = searchParams;

  const defaultDates = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  };

  const data = await getDashboardData(
    startDate || defaultDates.startDate,
    endDate || defaultDates.endDate,
  );

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        <DateRangeForm />
        <DashboardCharts data={data.graphData} />
        <StatsDisplay data={data} />
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
