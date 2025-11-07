export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <section className="max-w-2xl text-muted-foreground">
        <p className="mb-4">Have questions or feedback? We’d love to hear from you.</p>
        <div className="space-y-2">
          <p>Email: <a className="text-primary underline" href="mailto:support@tugwemo.app">support@tugwemo.app</a></p>
          <p>Twitter/X: <a className="text-primary underline" href="#">@tugwemo</a></p>
        </div>
      </section>
    </main>
  );
}