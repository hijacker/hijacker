// import { action } from '@storybook/addon-actions'

import ObjectDisplay from '../components/ObjectDisplay'

export default {
  title: 'ObjectDisplay',
  component: ObjectDisplay
}

const ObjectDisplayTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  render () {
    return <ObjectDisplay item={this.item} title={this.title} />
  }
})

export const Basic = ObjectDisplayTemplate.bind({})
Basic.args = {
  title: 'Testing',
  item: {
    val1: 2,
    val2: 3
  }
}