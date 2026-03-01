import { staff } from "@/data/players";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export default function StaffSection() {
  return (
    <section id="trainerstab" className="py-20 md:py-28">
      <div className="container">
        <ScrollReveal>
          <SectionHeading title="Trainerstab" subtitle="Das Team hinter dem Team" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {staff.map((member, i) => (
            <ScrollReveal key={member.id} delay={i * 0.08}>
              <div className="card-surface p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-lg font-bold text-muted-foreground">
                    {getInitials(member.name)}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
