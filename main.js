
// (function() {
//   var desc = document.getElementsByClassName('desc'),
//       items = desc.length;
//   for (var i = 0; i < items; i++) {
//       desc[i].innerHTML = '<span class="line-denoted"></span>' + desc[i].innerHTML + '<span class="cl"></span>';
//       var lines = desc[i].innerHTML.split(/\n/).length;
//       for (var j = 0; j < lines; j++) {
//           var lineNum = desc[i].getElementsByTagName('span')[0];
//           lineNum.innerHTML += '<span>' + (j + 1) + '</span>';
//       }
//   }
// })();