import { Button } from "@/components/ui/button";

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
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  );
}
