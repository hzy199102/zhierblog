new Promise((resolve, reject) => {
  // resolve('p ok')
  reject("p err");
})
  .then(
    value => {
      console.log("成功1 " + value);
      return "p1";
    },
    error => {
      console.log("失败1 " + error); //←←←←←←输出这里
      return "p1 err";
    }
  )
  .catch(err => {
    console.log("失败2 " + error);
    return "p2 err";
  })
  .then(
    value => {
      console.log("成功3 " + value); //←←←←←←输出这里
      return new Promise((resolve, reject) => {
        reject("新的Promise失败了");
      });
    },
    error => {
      console.log("失败3 " + error);
      return "p3 err";
    }
  )
  .then(
    value => {
      console.log("成功4 " + value);
    },
    error => {
      console.log("失败4 " + error); //←←←←←←输出这里
    }
  );

//输出:
//失败1 p err
//test.html:56 成功3 p1 err
//test.html:66 失败4 新的Promise失败了
