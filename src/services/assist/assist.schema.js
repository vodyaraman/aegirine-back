import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const assistSchema = {
  $id: 'Assist',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' }
  }
}
export const assistValidator = getValidator(assistSchema, dataValidator)
export const assistResolver = resolve({})

export const assistExternalResolver = resolve({})

// Schema for creating new data
export const assistDataSchema = {
  $id: 'AssistData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...assistSchema.properties
  }
}
export const assistDataValidator = getValidator(assistDataSchema, dataValidator)
export const assistDataResolver = resolve({})

// Schema for updating existing data
export const assistPatchSchema = {
  $id: 'AssistPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...assistSchema.properties
  }
}
export const assistPatchValidator = getValidator(assistPatchSchema, dataValidator)
export const assistPatchResolver = resolve({})

// Schema for allowed query properties
export const assistQuerySchema = {
  $id: 'AssistQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(assistSchema.properties)
  }
}
export const assistQueryValidator = getValidator(assistQuerySchema, queryValidator)
export const assistQueryResolver = resolve({})
