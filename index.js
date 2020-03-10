 //  1.获取数据
  // 2.把数据变为 Dom, 通过瀑布流的方式放到页面上
  // 3.当滚动到底部的时候
    
   var curPage = 1
   var perPageCount = 10
   var colSumHeight = []
   var nodeWidth = $('.item').outerWidth(true) 
   var colNum = parseInt($('#pic-ct').width()/nodeWidth)
   console.log(colNum) 
   for(var i = 0; i < colNum; i++){
     colSumHeight[i] = 0
   } 
    
    var isDataArrive = true
    
    start()
    
    function start(){
      getData(function(newsList){
        console.log(newsList)
        isDataArrive = true
        $.each(newsList, function(idx, news){
          var $node = getNode(news)
          $node.find('img').load(function(){
            $('#pic-ct').append($node)
            console.log($node, 'loaded...')
            waterFallPlace($node)
          })
        })
      })
      isDataArrive = false
    }
    
    $(window).scroll(function(){
      if(!isDataArrive) return
      
      if(isVisible($('#load'))){
        start()
      }
    })
    
    
    function getData(callback){
      $.ajax({
        url: 'https://photo.sina.cn/aj/v2/index?cate=military',
        dataType: 'jsonp',
        jsonp:"callback",
        data: {
          pagesize: perPageCount,
          page: curPage
        }
      }).done(function(ret){
        if(ret && ret.code == 1){
          callback(ret.data);
          curPage++
        }else{
          console.log('get error data');
        }
      });
    }
    
    function getNode(item){
      var tpl = ''
          tpl += '<li class="item">';
          tpl += '<a href="'+item.url+'" class="link"><img src="' +item.thumb+ '" alt=""></a>';
          tpl += ' <h4 class="header">'+ item.stitle +'</h4>';
          tpl += '<p class="desp">' + item.title +'</p>';
          tpl += '</li>';
          
       return $(tpl)
      }
    
    
      function waterFallPlace($node){
        
        var idx = 0
            minSumHeight = colSumHeight[0];
        
        for(var i=0;i<colSumHeight.length; i++){
          if(colSumHeight[i] < minSumHeight){
            idx = i;
            minSumHeight = colSumHeight[i];
          }
        }
        $node.css({
            left: nodeWidth*idx,
            top: minSumHeight,
            opacity: 1
        });
        colSumHeight[idx] = $node.outerHeight(true) + colSumHeight[idx];
        $('#pic-ct').height(Math.max.apply(null,colSumHeight));
      }
    
    
      function isVisible($el){
        var scrollH = $(window).scrollTop(),
            winH = $(window).height(),
            top = $el.offset().top;
        
        if(top < winH +scrollH){
          return true;
        }else{
          return false;
        }
      }
