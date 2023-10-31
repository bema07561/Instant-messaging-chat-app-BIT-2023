function randomBackground() {
    var randomNumber = Math.floor(Math.random() * 6) + 0;
      console.log(randomNumber);
    var images = ["https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?auto=format&fit=crop&w=1350&q=80",
                   "https://images.unsplash.com/photo-1469050624972-f03b8678e363?auto=format&fit=crop&w=1350&q=80",
                   "https://images.unsplash.com/photo-1502901930015-158e72cff877?auto=format&fit=crop&w=1350&q=80",
                   "https://images.unsplash.com/photo-1501813722636-45de2fe4f9b4?auto=format&fit=crop&w=1350&q=80",
                   'https://images.unsplash.com/photo-1511029029301-60680e65f7c7?auto=format&fit=crop&w=634&q=80',
                   'https://images.unsplash.com/photo-1417577097439-425fb7dec05e?auto=format&fit=crop&w=1489&q=80'];
      
      var gradient = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), ';
      var url = 'url(' + images[randomNumber] + ')';
      
    $('.login-wrapper__left').css('background-image', gradient + url);
  }
  
  
  
