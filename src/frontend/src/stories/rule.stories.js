import Rule from '../components/Rule'

export default {
  title: 'Rule',
  component: Rule
}

const RuleTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  render () {
    return <Rule initial-rule={this.initialRule} />
  }
})

export const Basic = RuleTemplate.bind({})
Basic.args = {
  initialRule: {
    path: '/cars',
    skipApi: true,
    body: {
      Hello: 'World'
    }
  }
}