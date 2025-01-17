import fs from 'node:fs'
import {
  createNewIcon,
  getIconById,
  updateIconAlias,
  updateIconThemes
} from '../../../../db/db.js'

console.time()
for (const svgIconFile of fs.readdirSync(`${process.cwd()}/icons`)) {
  console.log(svgIconFile)
  let [theme, id] = svgIconFile.split(':')
  id = id.replace('.svg', '')
  if (!getIconById(id)) {
    process.exit()
    createNewIcon(id, {
      alias: [id, `${theme}:${id}`],
      themes: [theme],
      defaultTheme: theme
    })
    continue
  }

  updateIconAlias(id, `${theme}:${id}`)
  updateIconThemes(id, theme)
}
console.timeEnd()
