const hamburger = document.querySelector(".hamburger");
const navmenu = document.querySelector(".nav-menu");
hamburger.addEventListener("click", function () {
  this.classList.toggle("is-active");
  navmenu.classList.toggle("active");
});

// let zz = setInterval(nft, 3000);
// var k = parseInt(document.getElementById("h4s1").textContent);
// var k1 = 1000;
// function nft() {
//   for (var i = 1; i < 2; i++) {
//     var n = Math.random();
//     var m = n * 0.1;
//     k = k + k * m;
//     k = Math.floor(k);
//     var p = k - k1;
//     console.log(k);
//     console.log(p);
//   }
//   document.getElementById("h4s1").textContent = k;
//   document.getElementById("h4s2").textContent = p;
// }
