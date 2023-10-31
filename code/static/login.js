function randomBackground() {
  var randomNumber = Math.floor(Math.random() * 6) + 0;
    console.log(randomNumber);
  var images = ["https://images.pexels.com/photos/4406642/pexels-photo-4406642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                 "https://images.unsplash.com/photo-1469050624972-f03b8678e363?auto=format&fit=crop&w=1350&q=80",
                 "https://images.unsplash.com/photo-1502901930015-158e72cff877?auto=format&fit=crop&w=1350&q=80",
                 "https://images.pexels.com/photos/3771676/pexels-photo-3771676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                 'https://images.pexels.com/photos/1857308/pexels-photo-1857308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                 'https://images.unsplash.com/photo-1417577097439-425fb7dec05e?auto=format&fit=crop&w=1489&q=80',
                'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              'https://images.pexels.com/photos/10118239/pexels-photo-10118239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'];
    
    var gradient = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), ';
    var url = 'url(' + images[randomNumber] + ')';
    
  $('.login-wrapper__left').css('background-image', gradient + url);
}

