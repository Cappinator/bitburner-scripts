/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let input = JSON.parse(cdata);
  input.forEach(row => row.map(e => Number.parseInt(e)));
  input.forEach((r, ir) => r.forEach((v, ic) => { if (v == 1) input[ir][ic] = -1; }));

  // For the first row, set all 0's to 1, until we reach the end of the row, or we reach a -1, then stop
  for (let i = 0; i < input[0].length; i++) {
    if (input[0][i] == 0) {
      input[0][i] = 1;
    } else {
      break;
    }
  }

  // Do the same for the first column
  for (let i = 1; i < input.length; i++) {
    if (input[i][0] == 0) {
      input[i][0] = 1;
    } else {
      break;
    }
  }

  for (let i = 1; i < input.length; i++) {
    for (let j = 1; j < input[i].length; j++) {
      if (input[i][j] == -1 || /*input[i-1][j] == 0 || input[i][j-1] == 0 ||*/ (input[i - 1][j] == -1 && input[i][j - 1] == -1)) {
        continue;
      }
      if (input[i-1][j] == -1) {
        input[i][j] = input[i][j-1];
      } else if (input[i][j-1] == -1) {
        input[i][j] = input[i-1][j];
      } else {
        //ns.tprint("row "+ i + ": col " + j + " => (row " + i-1 + ": col " + j + ") " + input[i-1][j] + " + (row " + i + ": col " + j-1 + ") " + input[i][j-1] + " = " + input[i - 1][j] + input[i][j - 1]);
        input[i][j] = input[i - 1][j] + input[i][j - 1];
      }
    }
  }

  let answer = JSON.stringify(input[input.length-1][input[0].length-1]);
  ns.writePort(portId, answer);

}