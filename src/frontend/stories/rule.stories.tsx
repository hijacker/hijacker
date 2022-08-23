import type { Story } from '@ladle/react';

import { Rule as RuleType } from '../../rules/Rule.js';
import { Rule } from '../components/Rule.js';

export default {
  title: 'Rule'
};

export const RuleStory: Story<{
  rule: Partial<RuleType>;
}> = ({ rule }) => (
  <Rule rule={rule} />
);

RuleStory.storyName = 'Rule';
RuleStory.args = {
  rule: { baseUrl: 'test' }
};