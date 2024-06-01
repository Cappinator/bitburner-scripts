/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata);

  let rows = data.length;
  let cols = data[0].length;
  let queue = [];
  queue.push([rows-1, cols-1, "F"]);
  let pathFound = false;
  while(queue.length > 0) {
    let next = queue.shift();
    let row = next[0];
    let col = next[1];
    let c = next[2];
    data[row][col] = c;
    // Start
    if (row == 0 && col == 0) {
      pathFound = true;
      break;
    }
    // UDLR
    if (row-1 >= 0 && data[row-1][col] == "0" && queue.find(e => e[0] == row-1 && e[1] == col) == undefined) {
      queue.push([row-1, col, "D"]);
    }
    if (row+1 < rows && data[row+1][col] == "0" && queue.find(e => e[0] == row+1 && e[1] == col) == undefined) {
      queue.push([row+1, col, "U"]);
    }
    if (col-1 >= 0 && data[row][col-1] == "0" && queue.find(e => e[0] == row && e[1] == col-1) == undefined) {
      queue.push([row, col-1, "R"]);
    }
    if (col+1 < cols && data[row][col+1] == "0" && queue.find(e => e[0] == row && e[1] == col+1) == undefined) {
      queue.push([row, col+1, "L"]);
    }
  }
  let path = [];
  // Resolve path
  if (pathFound) {
    let col = 0;
    let row = 0;
    while(data[row][col] != "F") {
      path.push(data[row][col]);
      switch(data[row][col]) {
        case "U":
          row -= 1;
          break;
        case "D":
          row += 1;
          break;
        case "L":
          col -= 1;
          break;
        case "R":
          col += 1;
          break;
      }
    }
  }

  let answer = JSON.stringify(path.join(""));
  ns.writePort(portId, answer);

}

