// n is the number to factorize
// inclusive means we include n (and therefore also 1) as factors
export async function Factorize(ns, n, inclusive = true) {
  let answer = [];
  let sqr = Math.floor(Math.sqrt(n));
//  let wait = "";
  for (let i = sqr; i >= 2; i--) {
    if (n % i == 0) {
      answer.push(i);
//      ns.tprint(wait + i);
//      wait = "";
    } else {
//      wait += ".";
    }
  }
  for (let i of answer) {
    let f = n / i;
    if (!answer.includes(f)) {
      answer.unshift(f);
    } 
  }
  if (inclusive) {
    answer.unshift(n);
    answer.push(1);
  }
  return answer;
}

// Checks if n is a prime number by factorizing it. 
// If it has no factors apart from itself and 1, it's a prime
export async function IsPrime(ns, n) {
  let factors = await Factorize(ns, n, false);
  return factors.length == 0;
}