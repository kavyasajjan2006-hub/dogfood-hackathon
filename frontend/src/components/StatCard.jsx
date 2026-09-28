
function StatCard({ title, value, icon: Icon, change }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>

      <h2 className="stat-value">{value}</h2>
      <p className="stat-title">{title}</p>
      <span className="stat-change">{change}</span>
    </div>
  );
}

export default StatCard;