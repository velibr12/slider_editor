$(document).ready(function(){
   
   /*
   *  FOTORAMA INIT
   **/   

   // 1. Initialize fotorama manually.
   var $fotoramaDiv = $('#fotorama').fotorama();

   // 2. Get the API object.
   var fotorama = $fotoramaDiv.data('fotorama');

   // 3. Setting Options
   fotorama.setOptions({
      width : '100%',
      nav : false,
      fit : 'cover',
      loop : true,
      arrows : false,
//      allowfullscreen: true
   });

   
   /*
   *  Slideshow buttons
   **/
   var $playBtn = $('#play');
   var $stopBtn = $('#stop');
   
   var $fullScreenBtn = $('#fullscreen');
   
   $playBtn.on('click', fotorama.startAutoplay.bind(null, 3000));
   $stopBtn.on('click', fotorama.stopAutoplay);
//   $fullScreenBtn.on('click', fotorama.requestFullScreen);
   
   /*
   *  Drag'n'Drop functionality
   **/
   var $thumbnails = $('.js-thumbnail');
   var $slots = $('.js-slot');   
      
   //Collects slotted images addresses and return as array
   function collectImagesInfo(){
      var imagesAddresses = [];
      
      $slots.each(function(el){
         $this = $(this);
         var img = {};
         if(!$this.hasClass('filled')){
            img.html = $("<div class=\"player__img--blank\"></div>");   
         }else{
            img.img = $this.children().attr("src");
            img.class = "player__img";
         }         
         imagesAddresses.push(img);
      });
      return imagesAddresses;
   }
   
   // Needs array with images addresses
   function setPlayerImages(addressArray){
      /* Loads images into fotorama*/
      fotorama.load(addressArray);      
   }
   
   function resetPlayerImages(){
      var addresses = collectImagesInfo();
      setPlayerImages(addresses);
   }
   
   function clearSlot($slot){
      $slot.removeClass("filled");
      $slot.empty();
      resetPlayerImages();
   }
      
   $thumbnails
      .on('dragstart', function(e){
      var $this = $(this);  
//      $this.css('opacity', '.5');
      
      //In order to drop allow copy effect
      e.originalEvent.dataTransfer.effectAllowed = "copy";
            
      // Copy the relative address of a picture to extract on drop      
      e.originalEvent.dataTransfer.setData("text/plain", $this.attr("src"));      
      
      $.each($slots, function(){
         if(!$(this).hasClass('filled')){
            $slots.addClass('highlight');
         }    
      });      
      
      })
      .on('dragend', function(){
         $slots.removeClass('highlight');
   });
   
   
   $slots
      .on('dragover', function(){      
         return false;      
   })
      .on('drop', function(e){      
         e.stopImmediatePropagation();

         var target = $(this);
         var imgAddress = e.originalEvent.dataTransfer.getData("text");
         e.originalEvent.dataTransfer.clearData();
         var image = $("<img />");      
         image.attr("src", imgAddress);
         image.addClass("slot__image");
         image.attr("draggable", false);

         if(target.hasClass("filled")){
            clearSlot(target);         
         }       
         target.addClass('filled');
         
         target.append(image);
      
         resetPlayerImages();

         return false;
   })
      .on('contextmenu', function(e){
         clearSlot($(this));
         return false;
   });
   
   
   
   
   
});