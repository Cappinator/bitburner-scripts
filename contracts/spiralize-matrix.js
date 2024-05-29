/** @param {NS} ns */
export async function main(ns, data = ns.args[0], portId = ns.args[1]) {

  let matrix = Array.from(JSON.parse(data));
//  ns.tprint(matrix);
  let ar = [];

  while (matrix.length>0) {
    // top row
    while(matrix.length > 0 && matrix[0].length > 0) {
      ar.push(matrix[0].shift());
    }
    matrix.shift();
    // right col
    for(let i=0;i<matrix.length;i++) {
      ar.push(matrix[i].pop());
    }
    // bottom row
    while(matrix.length > 0 && matrix[matrix.length-1].length > 0) {
      ar.push(matrix[matrix.length-1].pop());
    }
    matrix.pop();
    // left col
    for(let i=matrix.length-1;i>=0;i--) {
      ar.push(matrix[i].shift());
    }
  }
  let answer = ar.filter(c => c != null);
  
//  ns.tprint(answer);

  let output = JSON.stringify(answer);
  ns.writePort(portId, output);

}