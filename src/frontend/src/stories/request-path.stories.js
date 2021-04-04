import { action } from '@storybook/addon-actions'

import RequestPath from '../components/RequestPath'

export default {
  title: 'RequestPath',
  component: RequestPath
}

const RequestPathTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  render () {
    return <RequestPath items={this.items} vOn:item-click={action('click')} />
  }
})

export const Basic = RequestPathTemplate.bind({})
Basic.args = {
  items: [{ text: 'Test', value: 'testing' }, { text: 'Testing', value: 'test' }]
}