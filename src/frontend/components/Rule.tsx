import { IRule } from '../../rules/Rule.js';

interface RuleProps {
  rule: Partial<IRule>;
}

export const Rule = ({ rule }: RuleProps) => {
  return (
    <div>
      {JSON.stringify(rule, null, 2)}
    </div>
  );
};