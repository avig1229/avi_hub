import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './blockContent'
import project from './project'
import siteGuide from './siteGuide'
import musicRec from './musicRec'
import recordCrate from './recordCrate'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContent, project, siteGuide, musicRec, recordCrate],
}
