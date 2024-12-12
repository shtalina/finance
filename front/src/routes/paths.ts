export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  userRoot: 'users',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pagesRoot}/dashboard`,
  features: `/${rootPaths.pagesRoot}/features`,
  users: `/${rootPaths.userRoot}/list`, //
  pricing: `/${rootPaths.pagesRoot}/pricing`,
  integrations: `/${rootPaths.pagesRoot}/integrations`,
  settings: `/${rootPaths.pagesRoot}/settings`,
  templatePages: `/${rootPaths.pagesRoot}/template-pages`,
  accountSettings: `/${rootPaths.pagesRoot}/account-settings`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  resetPassword: `/${rootPaths.authRoot}/reset-password`,
  
  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,
};
