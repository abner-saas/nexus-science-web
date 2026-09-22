export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <circle cx="9" cy="9" r="7" fill="none" stroke="#dadce0" strokeWidth="2" />
      <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type GoogleSignInButtonProps = {
  status: "loading" | "ready" | "off";
  busy?: boolean;
  onClick: () => void;
};

export function GoogleSignInButton({ status, busy, onClick }: GoogleSignInButtonProps) {
  if (status === "off") return null;

  if (status === "loading") {
    return (
      <div
        className="mt-5 h-11 w-full animate-pulse rounded-lg bg-[#f1f3f4]"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-4 text-[14px] font-medium tracking-[0.15px] text-[#1f1f1f] transition hover:bg-[#f8f9fa] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:cursor-wait disabled:opacity-80"
    >
      {busy ? <Spinner /> : <GoogleMark />}
      {busy ? "Redirecionando…" : "Entrar com o Google"}
    </button>
  );
}
