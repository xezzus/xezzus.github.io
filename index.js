$(function(){
  $.fn.ruler = function(size,count,a,b){

    // default
    $this = this;
    var id = $this.prop('id');
    var a = a-0;
    var b = b-0;
    var count = count-0;
    if(isNaN(a) == true || isNaN(b) == true || isNaN(count) == true || isNaN(size) == true ) return false;


    // SVG library
    var draw = SVG(id).size(size, 400)
    draw.viewbox(0,0,size,400)

    // rect ruler
    var rect = draw.rect(size, 75).attr({ fill: '#ECE8C4', ry:'10' , y:'325'})

    // equation
    var equation = draw.foreignObject(1000,109).attr({id: 'equation',x:0,y:25});
    $('#equation').append('<div class="content"><div class="a"></div><div class="plus"></div><div class="b"></div><div class="equally"></div><div class="x"></div></div>');
    var equationA = $('#equation > div.content > div.a');
    var equationB = $('#equation > div.content > div.b');
    var equationX = $('#equation > div.content > div.x');
    equationA.text(a);
    $('#equation > div.content > div.plus').text('+');
    equationB.text(b);
    $('#equation > div.content > div.equally').text('=');
    $('#equation > div.content > div.x').text('?');



    // lines for ruler
    var lineMain = draw.line(size-40, 342.5, 40, 342.5).stroke({ width: 0.5 , color:'#555'});
    var lineSize = size-80;
    var symbol1 = draw.symbol();
    var symbol2 = draw.symbol();
    symbol1.line(0,332.5,0,352.5).stroke({width:1,color:'#000'});
    symbol2.line(0,332.5,0,352.5).stroke({width:3.5,color:'#000'});
    var lineDivide = function(x,number,strong=false){
      var x = x+40;
      var text = draw.text(number.toString());
      if(strong == false){
        draw.use(symbol1).move(x,0);
        text.font({size:13});
      } else {
        draw.use(symbol2).move(x,0);
        text.font({size:16,'font-weight':'bold'});
      }
      text.move(x-4,355);
      // ---
    };

    // create divides
    var divide = lineSize/count;
    var number = 0;
    var strong = 0;
    var numberPoint = {};
    for(var i = 0; i <= count; i++){
      var x = i*divide;
      numberPoint[i] = x;
      if(strong == 0 || strong == 5){
        lineDivide(x,number,true);
        strong = 0;
      } else {
        lineDivide(x,number,false);
      }
      number++;
      strong++;
    }

    // animate liner number one
    var path = draw.path('M41,342.5 Q 41 342.5 41 342.5').fill('none').stroke({width:2.5,color:'#FD0063'});
    var point = numberPoint[a]+40;
    path.animate(1000,'<>').plot('M41,342.5 Q '+point/2+' 200 '+point+' 342.5').after(function(){
      $.fn.inputIs = function(callback){
        var $this = this;
        var id = $this.parent().prop('id');
        switch(id){
          case "inputA":
            var number = a;
            var equation = equationA;
          break;
          case "inputB":
            var number = b;
            var equation = equationB;
          break;
          default:
            var number = a+b;
            var equation = false;
          break;
        };
        $this.focus();
        $this.off('input').on('input',function(e){
          var val = $(e.target).val()-0;
          if(val !== number){
            $this.addClass('error');
            if(equation !== false) equation.addClass('active');
          } else {
            $this.hide();
            if(equation != false) equation.removeClass('active');
            callback(true);
          }
        });
      };
      var inputA = draw.foreignObject(100,100).attr({id: 'inputA',x:(point/2)-15,y:'230'});
      inputA.appendChild("input",{"type":"text"});
      // input number a
      $('#inputA input').inputIs(function(is){
        draw.text(a.toString()).move(point/2,230).font({size:32});

        // animate liner number two
        var inputBpath = draw.path('M'+(numberPoint[a]+40)+',342.5 Q '+(numberPoint[a]+40)+' 342.5 '+(numberPoint[a]+40)+' 342.5').fill('none').stroke({width:2.5,color:'#FD0063'});
        var inputBpoint = numberPoint[b]+numberPoint[a]+40;
        var inputBcenter = (numberPoint[a]+40)+(divide*b/2);

        inputBpath.animate(1000,'<>').plot('M'+(numberPoint[a]+40)+',342.5 Q '+inputBcenter+' 200 '+inputBpoint+' 342.5').after(function(){
          var inputB = draw.foreignObject(100,100).attr({id: 'inputB',x:inputBcenter-25,y:'230'});
          inputB.appendChild("input",{"type":"text"});
          // input number b
          $('#inputB input').inputIs(function(is){
            draw.text(b.toString()).move(inputBcenter-10,230).font({size:32});
            equationX.html('<input typex="text" id="inputX">');
            equationX.find('input').inputIs(function(is){
              equationX.text(a+b);
            });
          });
        });
      });
    });



  };

  //
  // begin
  //

  $('#doc').append('<div id="ruler"></div>'); 
  $('#ruler').ruler('1000',20,7,4);

});
