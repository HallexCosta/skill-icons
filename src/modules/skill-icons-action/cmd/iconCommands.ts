interface IconAddCommandInput {
  id: string
  defaultTheme: string
  themes: string
  alias: string
}

const commands = new Map()

function add(args: string[]): IconAddCommandInput | null {
  const commandNameIndex = args.findIndex((a) => a === add.name)
  if (commandNameIndex < 0) {
    return null
  }
  const shortFlagThemeIndex = args.findIndex((a) => a === '-t')
  const flagThemeIndex = args.findIndex((a) => a === '--theme')

  if (flagThemeIndex < 0 && shortFlagThemeIndex < 0) {
    console.error('flag -t or --theme is required')
    return null
  }

  const themes =
    flagThemeIndex < 0
      ? args[shortFlagThemeIndex + 1]
      : shortFlagThemeIndex < 0
        ? args[flagThemeIndex + 1]
        : null
  if (!themes) {
    console.error('the flag theme cannot be empty value')
    return null
  }

  const shortFlagAliasIndex = args.findIndex((a) => a === '-a')
  const flagAliasIndex = args.findIndex((a) => a === '--alias')
  const alias =
    flagAliasIndex < 0
      ? args[shortFlagAliasIndex + 1]
      : shortFlagAliasIndex < 0
        ? args[flagAliasIndex + 1]
        : null

  if (!alias) {
    console.error('the flag alias cannot be empty value')
    return null
  }

  const shortFlagIdIndex = args.findIndex((a) => a === '-i')
  const flagIdIndex = args.findIndex((a) => a === '--id')
  const id =
    flagIdIndex < 0
      ? args[shortFlagIdIndex + 1]
      : shortFlagIdIndex < 0
        ? args[flagIdIndex + 1]
        : null

  if (!id) {
    console.error('the flag id cannot be empty value')
    return null
  }

  return {
    themes,
    alias,
    defaultTheme: 'original',
    id
  }
}

function notify(invokeCommandName: string) {
  for (const [name, handler] of commands) {
    if (invokeCommandName === name) handler()
  }
}

export const iconCommands = {
  commands,
  add,
  notify
}
