
urlDatos ='https://www.datos.gov.co/resource/734h-gxtn.json'

var raiz = {};
var departamentos = {};
var lengua = {};

var data = {};

    function callData() {
        fetch(
            urlDatos
        )
          .then((resp) => resp.json())
          .then((data) => {
            //console.log(data)
        
            departamentos = [...new Set(data.map(item => item.departamento))];
            //console.log(departamentos)

            arrDepa = []

            departamentos.forEach(depart => {

                //console.log(depart)

                arreglo = [];


                data.forEach(element => {

                    //console.log(element)

                    if(depart == element.departamento ){
                        
                        lengua = {"name": element.nombre_de_lengua , "children": [ {"name": element.n_mero_de_hablantes} ]  }
                        arreglo.push(lengua)
                       // console.log(lengua)

                    }
                    
                });

                depHijos = { "name": depart ,  "children": arreglo }
                arrDepa.push(depHijos)
                //console.log(depHijos)        
            });

            //console.log(arrDepa)

            raiz = { "name": "Lenguas Nativas" , "children":arrDepa }

            console.log(raiz)

            pintar(raiz);
          });
      }




      const width = 975;
      const height = 975;


var pintar = (pdata) => {

    data = pdata

    //console.log(data)

    const root = tree(data);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = d3.select(".dataL > svg")
      .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
  
  const g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
    
  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x));
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");
  
  return svg.node();
}




tree = data => {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  }




callData();


