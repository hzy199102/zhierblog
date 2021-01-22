let ready;
const readyPromise = new Promise(r => {
  ready = r;
});
console.log(ready);
console.log(readyPromise);

readyPromise.then(() => console.log(1111));
ready();
readyPromise.then(() => console.log(2222));
