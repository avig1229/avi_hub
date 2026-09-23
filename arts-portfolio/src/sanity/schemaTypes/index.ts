import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './blockContent'
import project from './project'
import coreSeries from './coreSeries'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContent, project, coreSeries],
}
