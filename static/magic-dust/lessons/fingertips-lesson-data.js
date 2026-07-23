export const HAND_GRID = [
  '000000000',
  '0x00x00x0',
  '0x00x00x0',
  '0xxxxxxx0',
  '0xxxxxxx0',
];

export const FINGERTIP_CELLS = [[1, 1], [1, 4], [1, 7]];

export const SCAN_STEPS = [
  { row:0, col:0, count:0, verdict:'BỎ QUA', reason:'Ô này là 0 — đây là nền.' },
  { row:1, col:1, count:1, verdict:'ĐỈNH NGÓN', reason:'Trên, trái, phải là nền; phía dưới là x.' },
  { row:1, col:2, count:1, verdict:'BỎ QUA', reason:'Ô này là 0 — không cần kiểm tra tiếp.' },
  { row:1, col:4, count:2, verdict:'ĐỈNH NGÓN', reason:'Đủ bốn điều kiện — tăng count lên 2.' },
  { row:1, col:7, count:3, verdict:'ĐỈNH NGÓN', reason:'Đủ bốn điều kiện — tăng count lên 3.' },
  { row:3, col:4, count:3, verdict:'KHÔNG PHẢI ĐỈNH', reason:'Bên trái và bên phải vẫn là x.' },
  { row:4, col:8, count:3, verdict:'QUÉT XONG', reason:'Kết quả cuối cùng là 3.' },
];

export const TEST_CASES = [
  { name:'empty', expected:0, grid:['000','000','000'] },
  { name:'one_finger', expected:1, grid:['0x0','0x0','xxx'] },
  { name:'three_fingers', expected:3, grid:HAND_GRID },
  { name:'finger_at_edge', expected:1, grid:['x00','x00','xx0'] },
  { name:'isolated_pixel_is_not_a_finger', expected:0, grid:['000','0x0','000'] },
];
