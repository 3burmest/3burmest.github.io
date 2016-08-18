function getJSON(url) {  //quick and dirty, just meant for quick proof of concept, no jquery needed
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('id', 'jsonScript');
  script.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function cbfunc(json){
    if(json.query.count) {
        var data = json.query.results.body.div.table.tbody.tr[1].td.div.p[3].table.tbody.tr;
        var table = document.createElement('table');
        table.setAttribute('id', 'liste');
        table.classList += ' tablesorter';
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
        var i=2, l=data.length-4, htm='<tbody>';
        for(;i<l;i++){
            try{
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
            } catch (err) {
                alert(JSON.stringify(entry));
            }
        }
        htm += "</tbody>";
        table.innerHTML += htm;
        document.getElementsByTagName('body')[0].appendChild(table);
        //document.getElementsByTagName('body')[0].innerHTML = '"' + htm + '"';
        $("#liste").tablesorter(); 
    } else {
        alert('Error: nothing found'); return false;
    }
}

function fetchEbayStore(){
   var yql="select *" + 
           " from html" +
           " where url='http://www.hsc-regatta.org/ergebnis/ekang.html'";
   yql="http://query.yahooapis.com/v1/public/yql?q=" +
       encodeURIComponent(yql) +
       "&format=json" +
       "&callback=cbfunc";
   getJSON(yql);
}