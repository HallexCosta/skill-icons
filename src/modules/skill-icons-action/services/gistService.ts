import { iconMapper } from '../mappers/iconMapper'
import { getOrCreateOctokitInstance } from '../providers/getOrCreateOctokitInstance'

export type Theme = 'light' | 'dark' | 'original'

export interface Icon {
  defaultTheme: Theme
  themes: Theme[]
  alias: string[]
}

interface AddNewIconParams {
  db: any
  id: string
  icon: Icon
}

function addNewIconInDb({ db, id, icon }: AddNewIconParams) {
  const alreadyIconExists = db[id]
  if (alreadyIconExists) {
    console.error('Id already in use, try another: ', id, icon)
    return
  }
  db[id.toLowerCase()] = {
    themes: icon.themes.map((theme) => theme.toLowerCase()),
    alias: icon.alias.map((alias) => alias.toLowerCase()),
    defaultTheme: icon.defaultTheme.toLowerCase()
  }
  const sortedDb = [...new Map<string, Icon>(Object.entries(db))].sort(sortByAZ)
  return iconMapper.fromTuplaToEntity(sortedDb)
}

function sortByAZ(a: [string, Icon], b: [string, Icon]) {
  const currentId = a[0].toLowerCase()
  const nextId = b[0].toLowerCase()
  if (currentId > nextId) return 1 // move a to right b
  if (currentId < nextId) return -1 // move a to left b
  return 0
}

async function updateDb(gistId: string, db: Record<string, Icon>) {
  const octokit = getOrCreateOctokitInstance()
  return await octokit.gists.update({
    gist_id: gistId,
    description: 'Testing',
    files: {
      'skill-icons.json': {
        content: JSON.stringify(db, null, 2)
      }
    }
  })
}

export const gistService = {
  sortByAZ,
  addNewIconInDb,
  updateDb
}
