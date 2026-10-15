export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] px-6 py-6 text-[#18231b] sm:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <a className="text-xl font-black tracking-tight" href="#inicio">
          NEXO<span className="text-[#e6673c]">.</span>
        </a>
        <a
          className="rounded-full bg-[#18231b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e6673c]"
          href="mailto:hola@ejemplo.com"
        >
          Hablemos
        </a>
      </nav>

      <section
        id="inicio"
        className="mx-auto grid max-w-6xl gap-12 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-32"
      >
        <div>
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#e6673c]">
            Ideas que avanzan
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-7xl">
            Haz que tu próximo paso cuente.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#536057]">
            Estrategia, diseño y tecnología para convertir buenas ideas en resultados reales.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              className="rounded-full bg-[#e6673c] px-6 py-3 font-bold text-white transition hover:bg-[#c9512b]"
              href="mailto:hola@ejemplo.com"
            >
              Empezar ahora
            </a>
            <a className="rounded-full border border-[#b9c0b9] px-6 py-3 font-bold transition hover:border-[#18231b]" href="#servicios">
              Ver servicios
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#c9e7cd] p-7 sm:p-10">
          <div className="mb-16 flex h-14 w-14 items-center justify-center rounded-full bg-[#18231b] text-2xl text-white">
            +
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#47614d]">Nuestro enfoque</p>
          <p className="mt-3 text-3xl font-bold leading-tight tracking-tight">
            Menos ruido. Más claridad. Mejor impacto.
          </p>
        </div>
      </section>

      <section id="servicios" className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-3xl bg-[#d7dcd6] sm:grid-cols-3">
        {[
          ["01", "Estrategia", "Definimos dónde enfocar tu energía."],
          ["02", "Identidad", "Creamos una marca que se reconoce."],
          ["03", "Digital", "Construimos experiencias que funcionan."],
        ].map(([number, title, text]) => (
          <article key={number} className="bg-white p-7 sm:p-9">
            <span className="text-sm font-bold text-[#e6673c]">{number}</span>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-3 leading-7 text-[#667068]">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
