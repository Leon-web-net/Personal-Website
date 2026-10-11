export const profile = {
  name: 'Leon Etiobi',
  degree: 'MEng Systems Engineering, 2:1 (Hons)',
  university: 'University of Warwick',
  /** Round hero photo. Swap the file in /public/media to change it. */
  photo: '/media/leon-square.jpg',
  photoAlt: 'Leon Etiobi in cap and gown at the University of Warwick School of Engineering',
  email: 'letiobi66@gmail.com',
  github: 'https://github.com/Leon-web-net',
  linkedin: 'https://www.linkedin.com/in/leon-etiobi',
  /**
   * The line sitting next to each hero link. This is where the personality lives, so
   * word it however sounds like you - it is the only prose on the page.
   */
  linkBlurbs: {
    github: 'Have a look at the code',
    linkedin: 'Think you can beat me at LinkedIn Games?',
  },
  // The CV is deliberately not linked from the site. To put it back, uncomment this
  // and add the button back to Hero.tsx / Nav.tsx.
  // cvUrl: '/Leon_Etiobi_CV.pdf',
} as const
