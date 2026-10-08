// Regla única de acceso: sirve para el middleware y para el dashboard.
// Tiene acceso quien (a) tiene suscripción paga vigente o (b) está dentro de su prueba gratis.

export type ProfileAccess =
  | {
      subscription_status?: string | null;
      subscription_expires_at?: string | null;
      trial_ends_at?: string | null;
    }
  | null
  | undefined;

export function getAccess(profile: ProfileAccess) {
  const now = Date.now();

  const isPaid =
    profile?.subscription_status === 'active' &&
    (!profile.subscription_expires_at || new Date(profile.subscription_expires_at).getTime() > now);

  const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at).getTime() : 0;
  const inTrial = !isPaid && trialEnd > now;
  const trialDaysLeft = inTrial ? Math.ceil((trialEnd - now) / 86400000) : 0;

  return { hasAccess: isPaid || inTrial, isPaid, inTrial, trialDaysLeft };
}
