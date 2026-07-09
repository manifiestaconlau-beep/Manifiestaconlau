export default function SuscripcionVencidaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="font-heading text-3xl text-pink mb-4">Tu acceso no está activo</h1>
        <p className="text-white/80 mb-6">
          Para entrar a tu ritual diario necesitás una suscripción activa. Si ya pagaste y ves
          este mensaje, puede que estemos procesando tu pago — esperá unos minutos y volvé a
          intentar.
        </p>
        <a
          href="https://pay.hotmart.com/TU-PRODUCTO-AQUI"
          className="inline-block rounded-lg bg-pink hover:bg-pink/90 transition-colors px-6 py-3 font-semibold"
        >
          Quiero suscribirme
        </a>
      </div>
    </main>
  );
}
