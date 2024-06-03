/** @param {NS} ns */
export async function main(ns, data = ns.args[0], portId = ns.args[1]) {

  // Total number of paths is calculated as follows:
  //  | 1  2  3  4  5  6  7  8
  // -+------------------------
  // 1| 1  1  1  1  1  1  1  1
  // 2| 1  2  3  4  5  6  7  8
  // 3| 1  3  6 10 15 21 28 36
  // 4| 1  4 10 20 35 56 84 ...
  // 5| 1  5 15 35 70 ...
  // 6| 1  6 21 56 ...
  // 7| 1  7 28 84 ...
  // 8| 1  8 36 ...
  //
  // In other words:
  //   - first row and colum all have a sum of 1
  //   - each other cell is the sum of the result of the cells above and to the left of it

  let input = JSON.parse(data);
  let rows = input[0];
  let cols = input[1];

  let cells = new Array(rows);
  for (let i=0;i<rows;i++) {
    let row = new Array(cols);
    if (i==0) {
      row.fill(1);
    } else {
      row[0] = 1;
      for (let j=1;j<cols;j++) {
        row[j] = row[j-1]+cells[i-1][j];
      }
    }
    cells[i] = row;
  }

  let answer = JSON.stringify(cells[rows-1][cols-1]);
  ns.writePort(portId, answer);
  
}