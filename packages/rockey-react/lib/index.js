import when from 'rockey/when';
import insert from 'rockey/insert';
import condition from 'rockey/condition';

import { getRockeyHoc } from './RockeyHoc';
import assignShorcuts from './assignShorcuts';
import look from './look';

const RootRockeyHoc = getRockeyHoc();

RootRockeyHoc.look = look;
RootRockeyHoc.when = when;
RootRockeyHoc.condition = condition;
RootRockeyHoc.insert = insert;

assignShorcuts(RootRockeyHoc);

export default RootRockeyHoc;
