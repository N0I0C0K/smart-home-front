import { action, observable, reaction } from 'mobx'
import { NodeProps, nodeType } from '../props'
import { mqttProvider, regist_topic } from './MqttProvider'

const base = 'acddb'
const alive_step_time = 1000 * 30
const AliveListenTopic = `${base}/listen/center/alive`
const AlivePublishTopic = `${base}/publish/center/alive`

export const centerManager = observable<{
  nodes: NodeProps[]
  positions: string[]
  lastCheckTime: number
  init: () => void
  checkAlive: () => void
  addNode: (pars: string[]) => void
  updateNode: (pars: string[]) => void
  controlNode: (nodeid: string, value: number) => void
}>({
  nodes: [],
  positions: ['客厅', '卧室', '厨房', '卫生间'],
  lastCheckTime: 0,
  checkAlive() {
    if (Date.now() - this.lastCheckTime < 5 * 1000) return
    this.lastCheckTime = Date.now()
    mqttProvider.publish(AlivePublishTopic, 'hi')
    //remove not response more than 10 times
    const now = Date.now()
    this.nodes = this.nodes.filter((n) => {
      if (n.lastResponseTime === undefined) return true
      return now - n.lastResponseTime < alive_step_time * 10
    })
  },
  addNode(pars) {
    const [nodeid, nodeType, nodeName, nodePosition, nodeVal] = pars
    const node: NodeProps = {
      id: nodeid,
      alive: true,
      _type: parseInt(nodeType),
      name: nodeName,
      position: nodePosition,
      value: parseInt(nodeVal),
      lastResponseTime: Date.now(),
    }
    //if node already exists, update it
    const index = this.nodes.findIndex((n) => n.id === node.id)
    if (index !== -1) {
      this.nodes[index] = node
      return
    }
    this.nodes.push(node)
    // add node pos to position
    const pos = node.position
    if (this.positions.indexOf(pos) === -1) {
      this.positions.push(pos)
    }
    console.log(` pos: ${pos}, position: ${this.positions}`)
  },
  init() {
    console.log('init center manager')
    regist_topic(`${base}/listen/center/alive`, (topic, message) => {
      const data = message.split('|').filter((s) => {
        return s.length > 0
      })
      if (data.length % 5 !== 0) {
        console.error('Invalid data')
        console.error(data)
        return
      }
      for (let i = 0; i < data.length; i += 5) {
        this.addNode(data.slice(i, i + 5))
      }
    })
    regist_topic(`${base}/publish/sensor/#`, (topic, message) => {
      const data = message.split('|').filter((s) => s.length > 0)
      if (data.length !== 4) {
        console.error('Invalid data')
        console.error(data)
        return
      }
      this.updateNode(data)
    })

    setInterval(
      action(() => {
        for (const node of this.nodes) {
          if (
            !node.lastResponseTime ||
            Date.now() - node.lastResponseTime > alive_step_time * 2
          ) {
            node.alive = false
          }
        }
      }),
      alive_step_time
    )

    // setInterval(() => {
    //   this.checkAlive()
    // }, alive_step_time)
  },
  updateNode(pars) {
    const [nodeid, nodeType, nodeRawVal, nodeParseVal] = pars
    const index = this.nodes.findIndex((n) => n.id === nodeid)
    if (index === -1) {
      console.error('Node not found')
      return
    }
    this.nodes[index].value = parseInt(nodeParseVal)
  },
  controlNode(nodeid: string, value: number) {
    const index = this.nodes.findIndex((n) => n.id === nodeid)
    if (index === -1) {
      console.error('Node not found')
      return
    }
    const node = this.nodes[index]
    if (
      node._type !== nodeType.bool_control &&
      node._type !== nodeType.num_control
    ) {
      console.error('Node is not a control node')
      return
    }
    console.log(`Control node ${nodeid} to ${value}`)
    mqttProvider.publish(
      `${base}/publish/control/${nodeid}`,
      `${nodeid}|${value}`
    )
  },
})

centerManager.init()

// reaction(
//   () => centerManager.nodes.length,
//   () => {
//     console.log('centerManager.nodes.length changed')
//     //Count the pos of all nodes, and output the position according to the number of nodes from large to small
//     const posMap = new Map<string, number>()
//     centerManager.nodes.forEach((n) => {
//       if (posMap.has(n.position)) {
//         posMap.set(n.position, posMap.get(n.position)! + 1)
//       } else {
//         posMap.set(n.position, 1)
//       }
//     })
//     const posArr = Array.from(posMap.entries())
//     posArr.sort((a, b) => {
//       return b[1] - a[1]
//     })
//     centerManager.positions = posArr.map((p) => p[0])
//   }
// )
