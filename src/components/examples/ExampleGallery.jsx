import ExampleCard from './ExampleCard.jsx';

export default function ExampleGallery({ roles, onSelect }) {
  return (
    <section>
      <div className="section-heading">
        <h2>Preview example roles</h2>
        <p>Each sample is intentionally different so HR leaders can see how the output flexes by role type.</p>
      </div>
      <div className="example-grid">
        {roles.map((role) => (
          <ExampleCard key={role.id} role={role} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
