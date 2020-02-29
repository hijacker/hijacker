import { object } from '@storybook/addon-knobs'

import Rule from '../components/Rule'

export default {
  component: Rule,
  title: 'Rule'
}

export const basic = () => ({
  props: {
    rule: {
      type: Object,
      default: () => (object('Rule', {
        path: '/cars',
        skipApi: true,
        body: {
          Hello: 'World'
        }
      }))
    }
  },
  render () {
    return <Rule initial-rule={this.rule} />
  }
})
