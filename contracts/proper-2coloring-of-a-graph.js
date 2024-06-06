/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let cdata2 = JSON.parse(cdata);

  let n = cdata2[0];
  let data = cdata2[1];
  data.forEach(ar => ar.sort((a, b) => a - b));
  data.sort((a, b) => a[0] - b[0]);

  let result = []
  for (let i = 0; i < n; i++) result.push(null);
  let colors = [0, 1];
  let fail = false;
  let queue = [];

  while (data.length > 0 || queue.length > 0) {
    let pair;
    if (queue.length > 0) {
      pair = queue.shift();
    } else if (data.length > 0) {
      pair = data.shift();
    }
    let p1 = pair[0];
    let p2 = pair[1];
    let toQueue = [];
    if (result[p1] == null) {
      if (result[p2] == null) {
        result[p1] = colors[0];
        result[p2] = colors[1];
        // add p1 and p2 matches to queue
        toQueue = [p1, p2];
      } else {
        result[p1] = colors[(result[p2] + 1) % 2];
        // add p1 matches to queue
        toQueue = [p1];
      }
    } else {
      if (result[p2] == null) {
        result[p2] = colors[(result[p1] + 1) % 2];
        // add p2 matches to queue
        toQueue = [p2];
      } else {
        if (result[p1] == result[p2]) {
          fail = true;
          break;
        }
      }
    }

    toQueue.forEach(q => {
      for(let i=0;i<data.length;i++) {
        if (data[i].includes(q)) {
          queue.push(data.splice(i--,1)[0]);
        }
      }
    });
  }
  if (fail) {
    result = [];
  }

  let answer = JSON.stringify(result);
  ns.writePort(portId, answer);
}
