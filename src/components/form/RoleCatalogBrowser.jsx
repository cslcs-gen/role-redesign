import { useMemo, useState } from 'react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import { roleCatalog } from '../../data/roleCatalog.js';

export default function RoleCatalogBrowser({ onSelectRole }) {
  const [query, setQuery] = useState('');
  const [activePillar, setActivePillar] = useState('Policy Pillar');
  const [activeGroup, setActiveGroup] = useState('');

  // Reset active group when pillar changes
  const handlePillarChange = (pillar) => {
    setActivePillar(pillar);
    setActiveGroup('');
  };

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roleCatalog.map((pillar) => {
      if (!q) return pillar;
      return {
        ...pillar,
        groups: pillar.groups
          .map((group) => ({
            ...group,
            roles: group.roles.filter((role) => role.toLowerCase().includes(q) || group.name.toLowerCase().includes(q))
          }))
          .filter((group) => group.roles.length > 0)
      };
    }).filter((pillar) => pillar.groups.length > 0);
  }, [query]);

  const activePillarData = useMemo(() => {
    return filteredCatalog.find((p) => p.pillar === activePillar) || filteredCatalog[0];
  }, [filteredCatalog, activePillar]);

  // Set first group as default if none selected
  const currentGroup = useMemo(() => {
    if (!activePillarData || activePillarData.groups.length === 0) return null;
    return activePillarData.groups.find((g) => g.name === activeGroup) || activePillarData.groups[0];
  }, [activePillarData, activeGroup]);

  return (
    <section className="results-stack">
      <Card>
        <div className="section-heading compact">
          <h2>Select a Role Concept</h2>
          <p>Explore concepts by choosing a division and profile below. Selecting a role will immediately generate the AI workforce impact analysis.</p>
        </div>
        <div className="search-tabs-row">
          <label className="field search-field">
            <span>Filter profiles</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter roles..." />
          </label>
        </div>
        
        <div className="pillar-tabs">
          {roleCatalog.map((p) => (
            <button
              key={p.pillar}
              type="button"
              className={`pillar-tab-btn ${activePillar === p.pillar ? 'active' : ''}`}
              onClick={() => handlePillarChange(p.pillar)}
            >
              {p.pillar}
            </button>
          ))}
        </div>
      </Card>

      {activePillarData && activePillarData.groups.length > 0 ? (
        <div className="catalog-layout">
          <aside className="group-sidebar">
            <Card>
              <h4>Divisions / Groups</h4>
              <div className="sidebar-links">
                {activePillarData.groups.map((group) => (
                  <button
                    key={group.name}
                    type="button"
                    className={`sidebar-link-btn ${currentGroup?.name === group.name ? 'active' : ''}`}
                    onClick={() => setActiveGroup(group.name)}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <main className="roles-content">
            <Card>
              <h3>{currentGroup?.name}</h3>
              {currentGroup?.divisions?.length ? (
                <div className="divisions-subtitle">
                  <strong>Key Divisions:</strong> {currentGroup.divisions.join(' · ')}
                </div>
              ) : null}
              <p className="section-intro">Select a role profile to generate analysis:</p>
              <div className="role-chip-grid">
                {currentGroup?.roles.map((role) => (
                  <Button key={role} variant="secondary" onClick={() => onSelectRole({ pillar: activePillar, group: currentGroup.name, role })}>
                    {role}
                  </Button>
                ))}
              </div>
            </Card>
          </main>
        </div>
      ) : (
        <Card><p>No matching roles found.</p></Card>
      )}
    </section>
  );
}
