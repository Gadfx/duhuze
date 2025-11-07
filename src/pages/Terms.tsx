export default function Terms() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <section className="prose prose-invert max-w-none text-muted-foreground">
        <p>Welcome to Tugwemo. By using our service, you agree to these terms. Please read them carefully.</p>
        <ul className="list-disc pl-6">
          <li>Be respectful to others; harassment is not tolerated.</li>
          <li>No sharing of illegal content or activities.</li>
          <li>We may suspend accounts that violate these terms.</li>
        </ul>
        <p>If you have questions about these terms, please contact us.</p>
      </section>
    </main>
  );
}