const Roles = {
  Translator: 'Translator',
  Transcriber: 'Transcriber',
  Dubber: 'Dubber',
  ['Thumbnail Designer']: 'Thumbnail Designer',
  Reviewer: 'Reviewer',
};

const PermissionSet = {
  Transcibe: ['Transcriber'],
  Translate: ['Translator'],
  Dub: ['Dubber'],
  Review: ['Reviewer',],
  Thumbnail: ['Thumbnail Designer'],
};

const hasPermisions = (action, adminRole) => {
  if (!adminRole || !action) return false;
  return PermissionSet[action].includes(adminRole);
};

export { Roles, PermissionSet, hasPermisions };
