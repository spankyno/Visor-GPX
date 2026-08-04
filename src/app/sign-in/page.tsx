import { SignIn } from "@clerk/nextjs";

// routing="hash" evita que Clerk necesite una carpeta catch-all
// ("[[...sign-in]]"), que da problemas en algunos clientes de Git/GitHub
// por los corchetes dobles y los puntos en el nombre de carpeta. Con
// "hash", los pasos internos de Clerk (verificación, SSO, MFA...) se
// gestionan con un fragmento #/... en la misma URL /sign-in.
export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-950 p-4">
      <SignIn routing="hash" signUpUrl="/sign-up" fallbackRedirectUrl="/mis-rutas" />
    </div>
  );
}
