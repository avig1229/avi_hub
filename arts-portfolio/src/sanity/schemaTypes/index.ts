import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './blockContent'
import project from './project'
import siteGuide from './siteGuide'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContent, project, siteGuide],
}
