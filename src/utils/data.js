/* eslint-disable */
import { Vector3 } from 'three'

export const rooms = [
  {
    name: '客厅',
    key: 'living-room',
    map: '/assets/images/map/map_living.jpg',
    // map: '/assets/images/map/map_bed_room.jpg',
    showSwitch: true,
    position: new Vector3(0, 0, 0), //应该全是0，待会改回来
  },
  {
    name: '卧室',
    key: 'bed-room',
    map: '/assets/images/map/map_bed_room.jpg',
    showSwitch: true,
    position: new Vector3(-32, 0, 0),
  },
  {
    name: '书房',
    key: 'study-room',
    map: '/assets/images/map/map_study_room.jpg',
    showSwitch: true,
    position: new Vector3(32, 0, 0),
  },

]
