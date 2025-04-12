export function LeadsDashboard() {
  return (
    <div className="p-4 glass-card">
      <h2 className="text-lg font-bold mb-4">Leads Dashboard</h2>
      <p>This dashboard will display leads gathered from various sources and categorized into different funnels.</p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-lg text-center shadow-md card-3d" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: '1.5px solid var(--petgas-green)', color: 'var(--petgas-black)' }}>
          <div className="text-2xl font-bold">Citizen Participation</div>
          <div>[Number of leads]</div>
        </div>
        <div className="p-4 rounded-lg text-center shadow-md card-3d" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: '1.5px solid var(--petgas-green)', color: 'var(--petgas-black)' }}>
          <div className="text-2xl font-bold">Waste Disposal</div>
          <div>[Number of leads]</div>
        </div>
        <div className="p-4 rounded-lg text-center shadow-md card-3d" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: '1.5px solid var(--petgas-green)', color: 'var(--petgas-black)' }}>
          <div className="text-2xl font-bold">Investors/Companies</div>
          <div>[Number of leads]</div>
        </div>
      </div>
    </div>
  );
}
