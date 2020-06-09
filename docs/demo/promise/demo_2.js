new Promise((resolve, reject) => {
  xxx;
  // resolve("ok")
  // reject('no')
  // xxx;
})
  .then(
    value => {
      //xxx;
      console.log(value); //输出位置0
    },
    err => {
      //xxx;
      console.log("err1", err); //输出位置1
    }
  )
  .catch(err => {
    console.log("err2", err); //输出位置2
  });
