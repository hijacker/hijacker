import type { Story } from '@ladle/react';

import { IRule } from '../../rules/Rule.js';
import { Rule } from '../components/Rule.js';

export default {
  title: 'Rule'
};

export const RuleStory: Story<{
  rule: Partial<IRule>;
}> = ({ rule }) => (
  <Rule rule={rule} />
);

RuleStory.storyName = 'Rule';
RuleStory.args = {
  rule: { baseUrl: 'test' }
};