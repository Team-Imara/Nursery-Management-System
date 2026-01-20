import { useState } from 'react';
import { Download, BarChart } from 'lucide-react';
import ReportTabs from '../components/ReportTabs';
import ReportSummary from '../components/ReportSummary';
import GradesTable from '../components/GradesTable';
import BehaviorTable from '../components/BehaviorTable';
import FiltersPanel from '../components/FiltersPanel';
import Layout from './Layout.jsx';


export default function Reports() {
  const [activeTab, setActiveTab] = useState('progress');

  let content;
  if (activeTab === 'progress') {
    content = (
      <>
        <ReportSummary />
        <GradesTable />
        <BehaviorTable />
      </>
    );
  } else {
    content = (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Preview — {activeTab.replace('-', ' ').toUpperCase()}</h2>
        <p className="text-gray-600">Content for this report type is coming soon.</p>
      </div>
    );
  }

  // For backend integration: In a real app, you'd fetch data from your PHP backend here.
  // Example (commented out since backend not set up):
  // useEffect(() => {
  //   fetch('/api/reports?tab=' + activeTab)
  //     .then(res => res.json())
  //     .then(data => {
  //       // Set state for grades, behavior, etc.
  //     });
  // }, [activeTab]);
  // Your PHP backend would query MySQL (e.g., via MySQLi/PDO) and return JSON.
  // Example PHP snippet (for reference, place in a file like api/reports.php):
  // <?php
  // $pdo = new PDO('mysql:host=localhost;dbname=your_db', 'user', 'pass');
  // $stmt = $pdo->query('SELECT * FROM grades');
  // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
  // echo json_encode($data);
  // ?>

  return (
    <Layout>
      <div className="max-w-[1230px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-colors shadow-sm">
              Generate Report
            </button>
          </div>
        </div>

        <div className="mb-6">
          <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {content}
            </div>
          </div>

          <div className="lg:col-span-1">
            <FiltersPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
}