import { observable } from 'mobx'
import { NodeProps, nodeType } from '../props'

export const centerManager = observable<{
  nodes: NodeProps[]
  checkAlive: () => void
  addAliveNode: () => void
}>({
  nodes: [],
  checkAlive() {},
  addAliveNode() {
    this.nodes.push({
      nodeid: '1',
      alive: true,
      nodeType: nodeType.bool_control,
    })
  },
})
