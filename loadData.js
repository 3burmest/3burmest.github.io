function getJSON(url) {  //quick and dirty, just meant for quick proof of concept, no jquery needed
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('id', 'jsonScript');
  script.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function fun(json, rm){
    if(json.query.count) {
        jso = json;
        var data = json.query.results.body.div.table.tbody.tr.td.div.p[4].table.tbody.tr;
        var table = document.createElement('table');
        table.setAttribute('id', 'liste');
        table.classList ? table.classList.add('tablesorter') : table.className += ' tablesorter';
        var tablehead = '<thead><tr>' + 
            '<th>Ges.Platz</th>' + 
            '<th>Lkg</th>' +
            '<th>S-Nr.</th>' + 
            '<th>Steuerfrau/-mann</th>' + 
            '<th>Club</th>' + 
            '<th>Bootstyp</th>' + 
            '<th>YS</th>' + 
            '<th>Wf.Plz.</th>' + 
            '<th>Wf.Bem.</th>' + 
            '<th>Wf.Pkt.</th>' + 
            '<th>Wf.ges.</th>' + 
            '<th>Ges.Punkte</th>' +
            '</tr></thead>';
        table.innerHTML = tablehead;
        var i=2, l=data.length-5, htm='<tbody>';
        for(;i<l;i++){
            try{
                if (!rm || (data[i].td[7].content !== "0")) {
                    htm += "<tr>";
                    var entry = data[i];
                    var il = entry.td.length;
                    for(var j = 0; j < il; j++) {
                        var d = entry.td[j];
                        if(typeof d === 'string') {
                            htm += "<td>" + d + "</td>";
                        } else {
                            htm += "<td>" + d.content + "</td>";
                        }
                    }
                    htm += "</tr>";
                }
            } catch (err) {
                alert(err.message + "\n\n" + i + "\n\n" + JSON.stringify(data));
            }
        }
        htm += "</tbody>";
        table.innerHTML += htm;
        document.getElementsByTagName('body')[0].appendChild(table);
        //document.getElementsByTagName('body')[0].innerHTML = '"' + htm + '"';
        $("#liste").tablesorter( {sortList: [[5,0], [7, 0]]} ); 
    } else {
        alert('Error: nothing found'); return false;
    }
}

function cbfunc(json) {
    console.log(json);
    try {
        fun(json, empty);
    } catch (err) {
        fun(json, false);
    }
}

function fetchEbayStore(){
   var yql="select *" + 
           " from html" +
           " where url='https://www.hsc-regatta.org/ergebnis/ekang.html'";
   yql="https://query.yahooapis.com/v1/public/yql?q=" +
       encodeURIComponent(yql) +
       "&format=json" +
       "&callback=cbfunc";
   getJSON(yql);
}

function empties() {
    document.body.removeChild(document.getElementById('liste'));
    try{
        if(!empty) {
            empty = true;
            document.getElementById('emptier').innerHTML = "Nicht-Teilnehmer hinzufügen";
        } else {
            empty = false;
            document.getElementById('emptier').innerHTML = "Nicht-teilnehmer entfernen";
        }
    } catch (err) {
        empty = true;
        document.getElementById('emptier').innerHTML = "Nicht-Teilnehmer hinzufügen";
    }
    fun(jso, empty);
}