import { tutorConcepts, conceptForSkill } from "./lib/tutor-content";
import { skills, problems } from "./lib/catalog";
import { tutorVisual } from "./lib/tutor-visuals";
import { crossSubjectAnimations } from "./lib/cross-subject-animations";
import { writeFileSync } from "node:fs";
const concepts = [...tutorConcepts.values()].map((c) => {
  const visuals = c.examples.map((_, ex) => tutorVisual(c.id, ex, 1));
  return { ...c, visuals };
});
const skillConcept: Record<string,string|null> = {};
for (const s of skills) skillConcept[s.id] = (conceptForSkill(s.id) as any)?.id ?? null;
const out = { skills, problems, concepts, skillConcept, animations: crossSubjectAnimations };
writeFileSync("out.json", JSON.stringify(out));
console.log(skills.length, problems.length, concepts.length, crossSubjectAnimations.length);
console.log(Object.entries(skillConcept).filter(([,v])=>!v).map(([k])=>k).join(","));
