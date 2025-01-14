import fs from 'node:fs'

const iconsDir = `${process.cwd()}/icons`
const svgIconFiles = fs.readdirSync(iconsDir)
const icons = {}
for (const icon of svgIconFiles) {
  const name = icon.replace('.svg', '').toLowerCase()
  icons[name] = String(fs.readFileSync(`${iconsDir}/${icon.toLowerCase()}`))
}

if (!fs.existsSync('./dist')) fs.mkdirSync('./dist')
fs.writeFileSync('./dist/icons.json', JSON.stringify(icons))
