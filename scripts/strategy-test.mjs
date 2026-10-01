import assert from 'node:assert/strict';
import {buildSocialExperienceCampaign,validateStrategyInput} from '../lib/strategy.js';

assert.equal(validateStrategyInput({}).ok,false);

const plan=buildSocialExperienceCampaign({
  clientId:'demo',
  campaignId:'demo-month-01',
  objective:'Answer the questions people have before acting.',
  questions:['What is it?','What does it feel like?','Is it for me?','Why here?']
});

assert.equal(plan.validation.ok,true);
assert.equal(plan.weeks.length,4);
assert.equal(plan.weeks.flatMap(week=>week.posts).length,12);
assert.deepEqual(plan.grid.displayOrder,['friday','wednesday','monday']);
assert.equal(plan.weeks[0].posts[0].role,'learn');
assert.equal(plan.weeks[0].posts[1].role,'see');
assert.equal(plan.weeks[0].posts[2].role,'experience');

console.log('strategy-test: ok');
