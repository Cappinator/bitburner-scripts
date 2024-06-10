/** @param {NS} ns */
export async function main(ns, ramToBuy = ns.args[0]) {

  if (ramToBuy > 0) {
    let cost = ns.getPurchasedServerCost(ramToBuy);
    let m = ns.getServerMoneyAvailable("home");
    let qty = Math.floor(m/cost);
    for (let i = 0;i<qty;i++) {
      let name = ns.purchaseServer("SERVER_" + i, ramToBuy);
      ns.tprint("Server " + name + " with " + ramToBuy + " GB RAM has been purchased.");
    }
  } else {
    let m = ns.getServerMoneyAvailable("home");
    ns.tprint(m);
    let qty = 0;
    let i = 1;
    do {
      let ram = Math.pow(2, i);
      let cost = ns.getPurchasedServerCost(ram);
      qty = Math.floor(m/cost);
      if (qty > 0) {
        ns.tprint("Can buy " + qty + " servers with " + ram + " GB RAM.")
        i++;
      }
    } while (qty > 0);
  }
}