import tablemark from 'tablemark'
import { getSkillIconsDb } from '../shared/services/getSkillIconsDb.js'

import fs from 'node:fs/promises'

const html = String.raw

const wrapperSvg = (svgs) =>
  html`<div style="display: flex; align-items: center; justify-content: center; gap: 10px;">${svgs}</div>`

const mapToSvgImg = (theme, id) =>
  html`<img src="../icons/${theme}:${id}.svg" />`

const mapToTablemark = (skillIcons) => {
  return Object.keys(skillIcons).map((id) => ({
    id,
    svg: wrapperSvg(
      skillIcons[id].themes.map((theme) => mapToSvgImg(theme, id)).join('')
    ),
    ...skillIcons[id]
  }))
}

export const main = async () => {
  const table = tablemark(mapToTablemark(await getSkillIconsDb()))
  const dir = `${process.cwd()}/docs/ICONS_AVAILABLES.md`
  fs.writeFile(dir, table)
  console.log('Great! available on dir', dir)
}

main()
