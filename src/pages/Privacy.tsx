export default function Privacy() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <section className="prose prose-invert max-w-none text-muted-foreground">
        <p>Your privacy matters. We collect only the data necessary to provide our service and never sell your data.</p>
        <ul className="list-disc pl-6">
          <li>We use tokens to authenticate users.</li>
          <li>Basic analytics may be collected to improve the service.</li>
          <li>You can request data deletion by contacting support.</li>
        </ul>
      </section>
    </main>
  );
}