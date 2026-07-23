import { CORE_NODE_LECTURES } from './lectures/core-nodes.js';
import { VISUAL_LECTURES } from './lectures/visual.js';
import { PARTICLE_PROJECT_LECTURES } from './lectures/particle-projects.js';
import { SIDE_BASIC_LECTURES } from './lectures/side-basics.js';
import { DATA_PRACTICE_LECTURES } from './lectures/data-practice.js';
import { BRANCH_TOWER_LECTURES } from './lectures/branches-towers.js';

const toList = collection => Array.isArray(collection) ? collection : Object.values(collection);
export const LECTURES = [
  ...toList(CORE_NODE_LECTURES),
  ...toList(VISUAL_LECTURES),
  ...toList(PARTICLE_PROJECT_LECTURES),
  ...toList(SIDE_BASIC_LECTURES),
  ...toList(DATA_PRACTICE_LECTURES),
  ...toList(BRANCH_TOWER_LECTURES),
];
const byId = new Map(LECTURES.map(lecture => [lecture.id, lecture]));
export const getLecture = id => byId.get(id) || null;
