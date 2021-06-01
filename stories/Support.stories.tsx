import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

const stories = storiesOf('Components', module);
const Test = () => <></>;
stories.addDecorator(withInfo);
stories.add('Support', () => <Test />, { info: { inline: true } });
