export interface FaqItem {
  question: string;
  answer: string;
}

export default function LandingFaq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
      <div className="mt-4 space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question} className="border-b border-rule pb-4">
            <h3 className="font-medium text-ink">{faq.question}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
