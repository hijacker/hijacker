/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import Rule from '../components/Rule'

export default {
  component: Rule,
  title: 'Rule'
}

export const basic = () => ({
  props: {
    rule: {
      type: Object,
      default: () => ({
        path: "/cars",
        skipApi: true,
        body: {
          Hello: "World"
        }
      })
    }
  },
  render() {
    return <Rule initial-rule={this.rule} />;
  }
})
