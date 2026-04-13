'use server'

import { handleServerFunctions as handler } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import type { ServerFunctionClient } from 'payload'

export const serverFunction: ServerFunctionClient = async ({ name, args }) => {
  return handler({
    name,
    args,
    config,
    importMap,
  })
}
