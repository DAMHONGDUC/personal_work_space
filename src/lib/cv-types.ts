/**
 * The shape of the CV data file — the single source of truth for the CV.
 *
 * Text fields hold plain text, never LaTeX: the renderer escapes the special
 * characters and converts typography itself. Write "&" and "get_it", not "\&"
 * and "get\_it". An en dash (–) becomes LaTeX's "--", an em dash (—) becomes
 * "---", and a middle dot (·) becomes a maths "$\cdot$" separator.
 *
 * Kept free of imports so both the Next.js app and the plain-Node build script
 * can pull the types in.
 */

export type ContactKind = "email" | "phone" | "link";

export type Contact = {
  kind: ContactKind;
  /** The visible text. */
  value: string;
  /** Target URL. Optional for `email`, which defaults to `mailto:<value>`. */
  href?: string;
};

export type Education = {
  institution: string;
  location: string;
  period: string;
  degree: string;
};

/** One line of the Skills list: "**name:** items". */
export type Skill = {
  name: string;
  items: string;
};

/** A block of work inside one job, e.g. "Mobile App" or "Web". */
export type ExperienceGroup = {
  title: string;
  /** Stack and team size, shown as the first bullet. */
  meta: string;
  bullets: string[];
};

export type Experience = {
  company: string;
  role: string;
  /** Hybrid / Onsite / Remote. */
  arrangement: string;
  location: string;
  period: string;
  groups: ExperienceGroup[];
  /** Trailing bullet with a bold lead-in, e.g. "Process: Agile — …". */
  note?: { label: string; text: string };
};

export type Project = {
  name: string;
  description: string;
  links: { label: string; href: string }[];
};

export type Cv = {
  /** ISO date shown on the site as the CV's "last updated". */
  lastUpdated: string;
  header: {
    name: string;
    /**
     * Filename inside cv/assets. The CV prints it at 3.2cm, so a JPEG around
     * 800px wide is already past what any printer resolves — anything larger
     * just inflates the PDF.
     */
    photo: string;
    contacts: Contact[];
  };
  aboutMe: string[];
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
};
