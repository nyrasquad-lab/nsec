const steps = [
  { number: '01', title: 'Assessment', desc: 'We evaluate your current IT infrastructure and identify areas for improvement.' },
  { number: '02', title: 'Planning', desc: 'We develop a comprehensive strategy tailored to your business goals and budget.' },
  { number: '03', title: 'Implementation', desc: 'Our team executes the plan with minimal disruption to your operations.' },
  { number: '04', title: 'Support', desc: 'Ongoing monitoring, maintenance, and support to keep everything running smoothly.' },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Process</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A proven approach to delivering IT excellence
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 text-4xl font-bold text-primary/20">{step.number}</div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
