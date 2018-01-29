var table;

const buildTable = () => {
  var t = new Array([], [], []);
  t.map(l => {
    for (var i = 0; i < 3; i++) {
      l.push(undefined);
    }
    return l;
  });
  return t;
}

const buildHTMLTable = (table) => {
  var gameArea = document.getElementById('game');
  var i = 0;
  if ((typeof table !== "undefined") && (typeof table.map !== "undefined")) {
    table.map(l => {
      var j = 0;
      var lHTML = document.createElement('div');
      lHTML.className = "line";
      lHTML.attributes.index = i;
      l.map(s => {
        var sub = document.createElement('div');
        sub.className = "case";
        sub.attributes.lineIndex = i;
        sub.attributes.caseIndex = j;
        lHTML.append(sub);
        j++;
      });
      gameArea.append(lHTML);
      i++;
      return l;
    });
  }
}

const tableIsCompleted = (table) => {
  var ret = true;
  if ((typeof table !== "undefined") && (typeof table.map !== "undefined")) {
    table.map(l => {
      if (typeof l.map !== "undefined") {
        l.map(s => {
          if (typeof s === "undefined") {
            ret = false;
          }
          return s;
        });
        return l;
      } else {
        console.error("Sub Table object sent is not an array");
      }
    });
    return ret;
  } else {
    console.error("Table object sent is not an array");
  }
}


table = buildTable();
buildHTMLTable(table);
/*console.log(tableIsCompleted(table));*/
