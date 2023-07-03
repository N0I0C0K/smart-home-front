export enum nodeType {
  'bool_sensor' = 1,
  'num_sensor' = 2,
  'bool_control' = 11,
  'num_control' = 12,
}

export interface NodeProps {
  id: string
  alive: boolean
  _type: nodeType
  name: string
  position: string
  value?: number
  lastResponseTime?: number
}
