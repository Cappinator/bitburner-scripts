/** @param {NS} ns */
export async function main(ns, data = ns.args[0], portId = ns.args[1]) {

  let input = JSON.parse(data);
  let rows = input[0];
  let cols = input[1];
  //rows = ns.args[0], cols = ns.args[1]

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