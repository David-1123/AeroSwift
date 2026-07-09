import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CustomQuote } from "@/components/CustomQuote";
import { BASE_FARE_USD, SUR_FARE_USD } from "@/lib/pricing";

const services = [
  {
    n: "01",
    title: "Traslados al aeropuerto",
    body: "Servicio puntual desde y hacia Tababela, con monitoreo de vuelos incluido.",
  },
  {
    n: "02",
    title: "Eventos y turismo",
    body: "Conexión directa a hoteles, eventos corporativos y destinos turísticos.",
  },
  {
    n: "03",
    title: "Viajeros y parejas",
    body: "Sedán ejecutivo con espacio cómodo para ti, tu acompañante y el equipaje.",
  },
];

const steps = [
  { n: 1, title: "Cotiza tu ruta", body: "Elige tu zona en Quito. El precio se calcula al instante." },
  { n: 2, title: "Elige tu pago", body: "Transferencia Banco Pichincha o Deuna!, sin pasarelas complicadas." },
  { n: 3, title: "Confirma por WhatsApp", body: "Envías tu comprobante y quedas confirmado al instante." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-onyx text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Quito · Traslados privados 24/7
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Tu vuelo no espera. Nosotros tampoco.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-bone/70">
            Traslados ejecutivos entre Quito y el Aeropuerto de Tababela, con conductor
            profesional y precio cerrado desde el primer clic.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reservar"
              className="rounded bg-gold px-6 py-3 text-center text-sm font-semibold text-onyx transition hover:bg-[#cdae7c]"
            >
              Cotizar mi traslado
            </Link>
            <a
              href="#servicios"
              className="rounded border border-white/25 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver servicios
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-bone/60">
            <li className="flex items-center gap-2"><Dot /> Puntualidad garantizada</li>
            <li className="flex items-center gap-2"><Dot /> Conductores verificados</li>
            <li className="flex items-center gap-2"><Dot /> Transferencia o Deuna!</li>
          </ul>
        </div>
      </section>

      {/* Tarifas fijas */}
      <section id="tarifas" className="border-b border-line/70 bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">Tarifas</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-onyx">
              Precio cerrado, sin sorpresas.
            </h2>
            <p className="mt-3 text-ink-soft">
              Una sola tarifa por zona, ida o vuelta al aeropuerto. Lo que ves es lo que pagas.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <FareCard
              price={BASE_FARE_USD}
              zone="Norte · Centro · Valles"
              detail="Tarifa estándar para la mayor parte de la ciudad."
            />
            <FareCard
              price={SUR_FARE_USD}
              zone="Sur de Quito"
              detail="Tarifa para el sur de la ciudad, por la mayor distancia a Tababela."
              highlight
            />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Más que transporte, soluciones
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold text-onyx">
          Conectamos toda la ciudad con el aeropuerto.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.n}
              className="rounded-lg border border-line bg-surface-card p-6 shadow-sm"
            >
              <span className="font-display text-3xl font-bold text-gold">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-onyx">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cotización personalizada (otros destinos / eventos / turismo) */}
      <section id="otros-destinos" className="border-t border-line/70 bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
                Cotización personalizada
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-onyx">
                ¿Otro destino o servicio? Lo cotizamos a tu medida.
              </h2>
              <p className="mt-3 text-ink-soft">
                Viajes a otras ciudades (Riobamba, Baños, Otavalo…), eventos, turismo o traslados
                especiales. Cuéntanos a dónde vas y te enviamos un precio cerrado por WhatsApp.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                <li className="flex items-center gap-2"><Dot /> Precio a tu medida, sin sorpresas</li>
                <li className="flex items-center gap-2"><Dot /> Sedán ejecutivo o vehículo según el grupo</li>
                <li className="flex items-center gap-2"><Dot /> Respuesta rápida por WhatsApp</li>
              </ul>
            </div>
            <CustomQuote />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="cobertura" className="border-y border-line/70 bg-onyx text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            Cómo funciona
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">Reserva en tres pasos.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 font-display text-lg font-bold text-gold">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-bone/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 text-center sm:px-6 lg:px-10">
        <h2 className="font-display text-3xl font-bold text-onyx sm:text-4xl">
          ¿Listo para tu próximo viaje?
        </h2>
        <p className="mt-3 text-ink-soft">
          Cotiza en menos de un minuto y confirma por WhatsApp.
        </p>
        <Link
          href="/reservar"
          className="mt-7 inline-block rounded bg-onyx px-7 py-3 text-sm font-semibold text-white transition hover:bg-onyx-deep"
        >
          Reservar mi traslado
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}

function FareCard({
  price,
  zone,
  detail,
  highlight,
}: {
  price: number;
  zone: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-7 ${
        highlight ? "border-gold bg-gold-soft/50" : "border-line bg-surface-card"
      }`}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display text-5xl font-bold text-onyx tabular">${price}</span>
        <span className="text-sm text-ink-soft">/ viaje</span>
      </div>
      <p className="mt-3 text-base font-semibold text-onyx">{zone}</p>
      <p className="mt-1 text-sm text-ink-soft">{detail}</p>
    </div>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />;
}
