import { Profile } from "../models/Profile.js";
import { StatsSection } from "../models/StatsSection.js";
import { CompaniesSection } from "../models/CompaniesSection.js";
import { Company } from "../models/Company.js";
import { TechStackSection } from "../models/TechStackSection.js";
import { ExperienceSection } from "../models/ExperienceSection.js";
import { Experience } from "../models/Experience.js";
import { ProjectsSection } from "../models/ProjectsSection.js";
import { Project } from "../models/Project.js";
import { SkillsSection } from "../models/SkillsSection.js";
import { ProcessSection } from "../models/ProcessSection.js";
import { Resume } from "../models/Resume.js";
import { ContactSection } from "../models/ContactSection.js";
import { SocialLinks } from "../models/SocialLinks.js";
import { FooterSection } from "../models/FooterSection.js";
import { getOrCreateSingleton } from "../utils/singletonFactory.js";

/**
 * Everything the public portfolio needs in one round trip. Handy for a
 * single top-level fetch; per-section routes still exist for the admin
 * dashboard and for components that would rather fetch independently.
 *
 * Every singleton goes through getOrCreateSingleton, same as its own
 * `GET /api/<section>` route — so this endpoint is never allowed to return
 * `null` for a section, even on a database that's had only `seed:admin`
 * run and no content yet. The portfolio site has no other fallback for a
 * `null` section (only for the whole request failing), so this guarantee
 * has to hold here specifically, not just on the individual routes.
 */
export async function getPortfolio(req, res) {
  const [
    profile,
    stats,
    companiesSection,
    companies,
    techStack,
    experienceSection,
    experience,
    projectsSection,
    projects,
    skills,
    process,
    resume,
    contact,
    social,
    footer,
  ] = await Promise.all([
    getOrCreateSingleton(Profile),
    getOrCreateSingleton(StatsSection),
    getOrCreateSingleton(CompaniesSection),
    Company.find().sort({ order: 1, createdAt: 1 }),
    getOrCreateSingleton(TechStackSection),
    getOrCreateSingleton(ExperienceSection),
    Experience.find().sort({ order: 1, createdAt: 1 }),
    getOrCreateSingleton(ProjectsSection),
    Project.find().sort({ order: 1, createdAt: 1 }),
    getOrCreateSingleton(SkillsSection),
    getOrCreateSingleton(ProcessSection),
    getOrCreateSingleton(Resume),
    getOrCreateSingleton(ContactSection),
    getOrCreateSingleton(SocialLinks),
    getOrCreateSingleton(FooterSection),
  ]);

  res.json({
    success: true,
    data: {
      profile,
      stats,
      companies: { section: companiesSection, items: companies },
      techStack,
      experience: { section: experienceSection, items: experience },
      projects: { section: projectsSection, items: projects },
      skills,
      process,
      resume,
      contact,
      social,
      footer,
    },
  });
}
