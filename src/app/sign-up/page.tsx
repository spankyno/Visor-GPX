import { SignUp } from "@clerk/nextjs";

// Ver comentario en sign-in/page.tsx: routing="hash" evita la carpeta
// catch-all "[[...sign-up]]".
export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-950 p-4">
      <SignUp routing="hash" signInUrl="/sign-in" fallbackRedirectUrl="/mis-rutas" />
    </div>
  );
}
