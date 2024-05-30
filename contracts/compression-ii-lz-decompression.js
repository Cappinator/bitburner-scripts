/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = Array.from(JSON.parse(cdata));

  let output = [];
  output = await GetChunkT1(ns, data, 0, output);

  let answer = JSON.stringify(output.join(""));
  ns.writePort(portId, answer);

}

async function GetChunkT1(ns, data, idx, chunk) {
  let l = Number.parseInt(data[idx++]);

  if (l != 0) {
    chunk = chunk.concat(data.slice(idx, idx+l));
    idx += l;
    if (idx < data.length) {
      chunk = await GetChunkT2(ns, data, idx, chunk);
    }
  } else {
    if (idx < data.length) {
      chunk = await GetChunkT2(ns, data, idx, chunk);
    }
  }
  return chunk;
}

async function GetChunkT2(ns, data, idx, chunk) {
  let len = Number.parseInt(data[idx++]);
  if (len != 0) {
    let ref = Number.parseInt(data[idx++]);
    let chunk2 = []
    while (chunk2.length < len) {
      chunk2 = chunk2.concat(chunk.slice(-ref));
    }
    chunk = chunk.concat(chunk2.slice(0, len));
    if (idx < data.length) {
      chunk = await GetChunkT1(ns, data, idx, chunk);
    }
  } else {
    if (idx < data.length) {
      chunk = await GetChunkT1(ns, data, idx, chunk);
    }
  }
  return chunk;
}