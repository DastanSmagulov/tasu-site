const FilterPanel: React.FC = () => {
  return (
    <div className="bg-white p-4 shadow-md mb-4 rounded-lg flex space-x-4">
      <input type="text" placeholder="Document Number" className="input" />
      <input type="date" className="input" />
      <input type="date" className="input" />
      <select className="input">
        <option>City</option>
        {/* More options */}
      </select>
      <button className="btn btn-secondary">Clear Filters</button>
    </div>
  );
};

export default FilterPanel;
