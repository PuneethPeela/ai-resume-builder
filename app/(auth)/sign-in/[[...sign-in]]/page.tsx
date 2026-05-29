import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center gradient-bg">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "glass shadow-2xl border-0",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "bg-secondary hover:bg-secondary/80 border-border text-foreground",
              formFieldInput:
                "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground",
            },
          }}
        />
      </div>
    </div>
  );
}
