function fromTuplaToEntity(result: any) {
  const icons: any = {}
  for (const [id, icon] of result) {
    icons[id] = icon
  }
  return icons
}

export const iconMapper = {
  fromTuplaToEntity
}
