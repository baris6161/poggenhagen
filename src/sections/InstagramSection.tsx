import { siteConfig } from "@/config/site";
import { Instagram } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const placeholderPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `ig-${i}`,
  caption: `Matchday vibes 🔥 #TSVPoggenhagen #Kreisliga${i === 0 ? " #Sieg" : ""}`,
}));

export default function InstagramSection() {
  return (
    <section id="instagram" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <Instagram className="w-7 h-7 text-primary" />
            <span className="font-body text-lg text-muted-foreground">@{siteConfig.instagramHandle}</span>
          </div>
          <SectionHeading title="Instagram" />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {placeholderPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.06}>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface aspect-square flex items-center justify-center group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <Instagram className="w-8 h-8 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-xs text-foreground line-clamp-3">{post.caption}</p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 text-center">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-lg hover:border-primary/50 hover:text-primary transition-all text-sm"
            >
              <Instagram className="w-4 h-4" />
              Auf Instagram öffnen
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
