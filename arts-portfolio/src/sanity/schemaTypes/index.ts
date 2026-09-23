import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './blockContent'
import project from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContent, project],
}
