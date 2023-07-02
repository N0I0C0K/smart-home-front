import mqtt from 'mqtt'
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
export const mqttProvider = mqtt.connect('test.mosquitto.org', {
  port: 1883,
})

export const mqttStatus = observable<{
  connected: boolean
}>({
  connected: false,
})

mqttProvider.on('connect', () => {
  mqttStatus.connected = true
  mqttProvider.on('message', (topic, message) => {})
})
