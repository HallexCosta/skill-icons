import { configExportService } from '../shared/services/configExportService'
import { iconCommands } from './cmd/iconCommands'
import { getOrCreateOctokitInstance } from './providers/getOrCreateOctokitInstance'
import { type Theme, gistService } from './services/gistService'

async function main() {
  const args = process.argv
  const icon = iconCommands.add(args)

  if (!icon) return console.error('Command add not found')

  const GIST_ID_ICONS_DB = configExportService.get('GIST_ID_ICONS_DB')
  const octokit = getOrCreateOctokitInstance()
  const gist = await octokit.gists.get({
    gist_id: GIST_ID_ICONS_DB
  })

  if (!gist.data.files) return console.error('none files in gist')

  const skillIcons = gist.data.files['skill-icons.json'] || null

  if (!skillIcons) return console.error('skill icons not found')

  const skillIconsParsed = JSON.parse(skillIcons.content ?? '{}')
  const newDb = await gistService.addNewIconInDb({
    db: skillIconsParsed,
    id: icon.id,
    icon: {
      alias: icon.alias.split(','),
      themes: icon.themes.split(',') as Theme[],
      defaultTheme: icon.themes.includes('original') ? 'original' : 'dark'
    }
  })

  if (!newDb) {
    console.error('Cannot parsed newDb with icon added')
    return
  }

  await gistService.updateDb(GIST_ID_ICONS_DB, newDb)
  console.log()
  console.log('New icon added with sucessfully:', icon)
  console.log('Gist ref:', GIST_ID_ICONS_DB)
}
main()
