import mqtt from 'mqtt-browser'
import { action, observable } from 'mobx'

type Callback<T> = (p: T) => void

class Event<T> {
  private actions: Set<Callback<T>> = new Set()

  invoke(p: T): void {
    for (const func of this.actions) {
      func(p)
    }
  }

  add(func: Callback<T>): void {
    this.actions.add(func)
  }

  remove(func: Callback<T>): void {
    this.actions.delete(func)
  }

  clear(): void {
    this.actions.clear()
  }
}
export const mqttProvider = mqtt.connect('http://broker-cn.emqx.io:8083/mqtt', {
  protocol: 'ws',
})

export const mqttStatus = observable<{
  connected: boolean
}>({
  connected: false,
})

var regist_topic_list: {
  topic: string
  callback: (topic: string, message: string) => void
}[] = []

function checkPattern(pattern: string, target: string): boolean {
  const regexPattern = pattern.replace(/#/g, '.*')
  const regex = new RegExp(regexPattern)
  return regex.test(target)
}

export function regist_topic(
  reg_topic: string,
  callback: (topic: string, message: string) => void
) {
  mqttProvider.subscribe(reg_topic, { qos: 1 })
  regist_topic_list.push({ topic: reg_topic, callback: callback })
}

export function cancel_topic(topic: string) {
  const idx = regist_topic_list.findIndex((val) => val.topic === topic)
  if (idx === -1) return
  mqttProvider.unsubscribe(topic)
  regist_topic_list.splice(idx, 1)
}

export function cancel_all_topic() {
  regist_topic_list.forEach((element) => {
    mqttProvider.unsubscribe(element.topic)
  })
  regist_topic_list.length = 0
}

mqttProvider.on('connect', () => {
  mqttStatus.connected = true
  console.log('mqtt connected')
})

mqttProvider.on('message', (topic, message) => {
  console.log('mqtt message', topic, message.toString())
  for (const reg_topic of regist_topic_list) {
    if (checkPattern(reg_topic.topic, topic)) {
      reg_topic.callback(topic, message.toString())
    }
  }
})
