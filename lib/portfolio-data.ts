import {
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Rocket,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { SiFlutter, SiFreecodecamp, SiHackerrank, SiKubernetes, SiNodedotjs, SiOpenai, SiReact } from "react-icons/si";
import educationJson from "@/data/portfolio/education.json";
import profileJson from "@/data/portfolio/profile.json";
import type {
  Capability,
  Certification,
  ContactMethod,
  Education,
  PortfolioIcon,
  Profile,
  Project,
  SkillCategory,
  SocialLink,
  Stat,
  TimelineItem,
} from "@/types/portfolio";
import { formatWhatsappLink } from "@/lib/utils";

type IconKey = keyof typeof iconMap;
type ProfileField = keyof typeof profileJson;

type RawIconItem = {
  icon: IconKey;
};

type RawContactMethod = RawIconItem & {
  label: string;
  value?: string;
  valueFromProfile?: ProfileField;
  href?: string;
  hrefFromProfile?: ProfileField;
};

type RawSocialLink = RawIconItem & {
  label: string;
  href?: string;
  hrefFromProfile?: ProfileField;
};

type JsonModule<T extends object> = T | { default: T };

type WebpackJsonContext<T extends object> = {
  keys(): string[];
  (id: string): JsonModule<T>;
};

type WebpackRequire = typeof require & {
  context<T extends object>(directory: string, useSubdirectories: boolean, regExp: RegExp): WebpackJsonContext<T>;
};

const iconMap = {
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  FaGithub,
  FaLinkedin,
  FaTelegramPlane,
  FaWhatsapp,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Rocket,
  SiFlutter,
  SiFreecodecamp,
  SiHackerrank,
  SiKubernetes,
  SiNodedotjs,
  SiOpenai,
  SiReact,
} satisfies Record<string, PortfolioIcon>;

function hydrateIcon<T extends RawIconItem>(item: T): Omit<T, "icon"> & { icon: PortfolioIcon } {
  const { icon: iconKey, ...itemData } = item;

  return {
    ...itemData,
    icon: iconMap[iconKey],
  };
}

function resolveProfileValue(field: ProfileField) {
  return profile[field];
}

function resolveProfileHref(field: ProfileField) {
  if (field === "email") {
    return `mailto:${profile.email}`;
  }

  if (field === "whatsapp") {
    return formatWhatsappLink(profile.whatsapp);
  }

  return resolveProfileValue(field);
}

function hydrateContactMethod(item: RawContactMethod): ContactMethod {
  return {
    label: item.label,
    value: item.value ?? (item.valueFromProfile ? resolveProfileValue(item.valueFromProfile) : ""),
    href: item.href ?? (item.hrefFromProfile ? resolveProfileHref(item.hrefFromProfile) : undefined),
    icon: iconMap[item.icon],
  };
}

function hydrateSocialLink(item: RawSocialLink): SocialLink {
  return {
    label: item.label,
    href: item.href ?? (item.hrefFromProfile ? resolveProfileHref(item.hrefFromProfile) : "#"),
    icon: iconMap[item.icon],
  };
}

function loadJsonContext<T extends object>(jsonContext: WebpackJsonContext<T>) {
  return jsonContext
    .keys()
    .sort((first, second) => first.localeCompare(second))
    .map((key) => {
      const jsonModule = jsonContext(key);

      return "default" in jsonModule ? jsonModule.default : jsonModule;
    });
}

export const profile: Profile = profileJson;

export const stats: Stat[] = loadJsonContext<Stat>(
  (require as WebpackRequire).context<Stat>("../data/portfolio/stats", false, /\.json$/),
);

export const capabilities: Capability[] = loadJsonContext<RawIconItem & Omit<Capability, "icon">>(
  (require as WebpackRequire).context<RawIconItem & Omit<Capability, "icon">>("../data/portfolio/capabilities", false, /\.json$/),
).map((item) => hydrateIcon(item));

export const certifications: Certification[] = loadJsonContext<Certification>(
  (require as WebpackRequire).context<Certification>("../data/portfolio/certifications", false, /\.json$/),
);

export const skillCategories: SkillCategory[] = loadJsonContext<RawIconItem & Omit<SkillCategory, "icon">>(
  (require as WebpackRequire).context<RawIconItem & Omit<SkillCategory, "icon">>("../data/portfolio/skills", false, /\.json$/),
).map((item) => hydrateIcon(item));

export const timeline: TimelineItem[] = loadJsonContext<TimelineItem>(
  (require as WebpackRequire).context<TimelineItem>("../data/portfolio/timeline", false, /\.json$/),
);

export const projects: Project[] = loadJsonContext<Project>(
  (require as WebpackRequire).context<Project>("../data/portfolio/projects", false, /\.json$/),
);

export const contactMethods: ContactMethod[] = loadJsonContext<RawContactMethod>(
  (require as WebpackRequire).context<RawContactMethod>("../data/portfolio/contact", false, /\.json$/),
).map((item) => hydrateContactMethod(item));

export const socialLinks: SocialLink[] = loadJsonContext<RawSocialLink>(
  (require as WebpackRequire).context<RawSocialLink>("../data/portfolio/social", false, /\.json$/),
).map((item) => hydrateSocialLink(item));

export const education: Education = hydrateIcon(educationJson as RawIconItem & Omit<Education, "icon">);
