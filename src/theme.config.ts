import { defineThemeConfig } from './types'

export default defineThemeConfig({
  site: 'https://ase-nsbm.github.io/',
  title: 'Association of' + ' ' + ' Software Engineering',
  titleParts: ['Association of', 'Software Engineering'], // Added for components that need to split the title
  description:
    'The official Web of the Association of Software Engineering, NSBM Green University Town',
  author: 'ASENSBM',
  navbarItems: [
    { label: 'Blog', href: '/posts/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Tags', href: '/tags/' },
    { label: 'About', href: '/about/' },
    {
      label: 'Other pages',
      children: [
        { label: 'Landing page', href: '/' },
        { label: '404 page', href: '/404' },
        { label: 'Author: ASENSBM', href: '/authors/FjellOverflow/' },
        { label: 'Tag: documentation', href: '/tags/documentation/' }
      ]
    }
  ],
  footerItems: [
    {
      icon: 'tabler--brand-github',
      href: 'https://github.com/ASE-NSBM',
      label: 'Github'
    },
    {
      icon: 'tabler--brand-instagram',
      href: 'https://www.instagram.com/sesa.nsbm/',
      label: 'instagram'
    },
    {
      icon: 'tabler--brand-linkedin',
      href: 'https://www.linkedin.com/company/sesansbm/ ',
      label: 'Github'
    },
    {
      icon: 'tabler--brand-facebook',
      href: 'https://www.facebook.com/scse.nsbm',
      label: 'Facebook'
    },
    {
      icon: 'tabler--brand-tiktok',
      href: 'https://www.tiktok.com/@sesa.nsbm',
      label: 'tiktok'
    },
    {
      icon: 'tabler--brand-x',
      href: 'https://x.com/ASE_NSBM',
      label: 'X'
    }
  ],

  // optional settings
  locale: 'en',
  mode: 'dark',
  modeToggle: true,
  colorScheme: 'scheme-aurora',
  openGraphImage: undefined,
  postsPerPage: 4,
  projectsPerPage: 3,
  scrollProgress: false,
  scrollToTop: true,
  tagIcons: {
    tailwindcss: 'tabler--brand-tailwind',
    astro: 'tabler--brand-astro',
    documentation: 'tabler--book'
  },
  shikiThemes: {
    light: 'vitesse-light',
    dark: 'vitesse-black'
  }
})
