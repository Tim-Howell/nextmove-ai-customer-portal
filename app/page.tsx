export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-16 px-8">
        <h1 className="text-4xl font-bold text-primary">
          NextMove AI Customer Portal
        </h1>
        <p className="text-lg text-secondary text-center max-w-md">
          Welcome to the NextMove AI Customer Portal. This application is under
          development.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
          <button className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-muted transition-colors">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
