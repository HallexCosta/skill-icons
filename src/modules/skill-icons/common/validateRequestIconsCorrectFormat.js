export const validateRequestIconsCorrectFormat = (requestIcons) => {
  // create a validation regex pattern to allow users input icons in the format of `icon1,icon2,icon3` and configure the theme as `theme:icon1,theme:icon2,icon3`
  // some other symbols different from `,` and `:` are not allowed
  const pattern = /^([a-z0-9-]+)(?::([a-z0-9-]+))?$/i
  return requestIcons.every((icon) => pattern.test(icon))
}
