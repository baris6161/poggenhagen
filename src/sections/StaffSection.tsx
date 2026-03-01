"use client";

import Image from "next/image";
import { staff } from "@/data/players";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

export default function StaffSection() {
  return (
    <section id="trainerstab" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Trainerstab" subtitle="Das Team hinter dem Team" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((member, i) => (
            <ScrollReveal key={member.id} delay={i * 0.08}>
              <div className="card-surface p-5 group">
                {/* Staff Image */}
                {member.image ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 group-hover:neon-glow transition-shadow relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 128px, 128px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-2xl font-bold text-muted-foreground">
                      {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-center font-display text-xl font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="text-center text-sm text-primary mt-1">{member.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
