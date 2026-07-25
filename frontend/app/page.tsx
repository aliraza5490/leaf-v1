import {
  Header,
  HeroSection,
  MarqueeSection,
  BenefitsSection,
  FeatureSection,
  BetaSection,
  Footer,
  features,
} from "./components";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <BenefitsSection />
        <div className="divide-y divide-border">
          {features.map((feature, i) => (
            <FeatureSection
              key={feature.label}
              feature={feature}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
        <MarqueeSection />
        <BetaSection />
      </main>
      <Footer />
    </div>
  );
}
