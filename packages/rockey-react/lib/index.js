import when from 'rockey/when';
import insert from 'rockey/insert';
import condition from 'rockey/condition';

import { getRockeyHoc } from './RockeyHoc';
import assignShortcuts from './assignShortcuts';
import look from './look';

const RootRockeyHoc = getRockeyHoc();

RootRockeyHoc.look = look;
RootRockeyHoc.when = when;
RootRockeyHoc.condition = condition;
RootRockeyHoc.insert = insert;

assignShortcuts(RootRockeyHoc);

export default RootRockeyHoc;
