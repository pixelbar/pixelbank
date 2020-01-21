import { Request, Response } from 'express'

function extractRequestObject(req: Request, res: Response, fields: [string]): boolean {
  if (typeof req.body != 'object' || req.body === null || req.body === undefined) {
    res.json({ success: false, message: 'Missing JSON body' })
    return false
  }
  for (const field of fields) {
    if (!req.body.hasOwnProperty(field)) {
      res.json({ success: false, message: 'Missing one or multiple fields', fields })
      return false
    }
  }
  return true
}

export { extractRequestObject }
