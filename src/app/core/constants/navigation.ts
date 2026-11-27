/**
 * The public site is a single page with anchored sections. The header renders
 * the same destinations twice (desktop bar and mobile drawer), so the list is
 * defined once here instead of being duplicated in the template.
 */
export interface PublicNavLink {
  label: string;
  /** Id of the section on the home page. */
  fragment: string;
}

export const PUBLIC_NAV_LINKS: readonly PublicNavLink[] = [
  { label: 'صفحه اصلی', fragment: 'home' },
  { label: 'خدمات', fragment: 'services' },
  { label: 'آموزش و سلامت', fragment: 'education' },
  { label: 'گالری', fragment: 'gallery' },
  { label: 'مقالات', fragment: 'articles' },
  { label: 'درباره ما', fragment: 'doctorProfile' },
  { label: 'تماس با ما', fragment: 'footer' },
];
