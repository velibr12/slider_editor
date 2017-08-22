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
      arrows : false
   });
   
   /*
   *  LOAD LIBRARY
   **/
   
   loadLibrary();
   
   /*
   *  Buttons
   **/
   
   //slideshow buttons
   var $playBtn = $('#play');
   var $stopBtn = $('#stop');
   
   //timeline button
   var $newSlotBtn = $('#js-add-slot');
   
   
   $playBtn.on('click', fotorama.startAutoplay.bind(null, 3000));
   $stopBtn.on('click', fotorama.stopAutoplay);
   
   $newSlotBtn.on('click', addNewSlot);
   
   /*
   *  Drag'n'Drop functionality
   **/
   var $thumbnails = $('.js-thumbnail');
   var $slots = $('.js-slot');   
   var $timeline = $('#timeline-container');

   $thumbnails
      .on('dragstart', {event}, dragHandler)
      .on('dragend', function(){
         $slots.removeClass('highlight');
   });
      
   $timeline
      .on('dragover', '.js-slot', function(){ return false; })
      .on('drop', '.js-slot', {event}, dropHandler)
      .on('contextmenu', '.js-slot', function(e){
         clearSlot($(this));
         return false;
   });
   
   /*
   *  FUNCTIONS
   **/
      
   //loads images library
   function loadLibrary(){
      var library = $('#library__container');
      var dir = "images";
      var ext = 'jpg';
      $.get(dir, function(data){
         var elements = $(data).find('a:contains('+ext+')');
         
         elements.each(function(el, val){
            var newImage = $('<img />');
            newImage.addClass('library__thumbnail js-thumbnail');
            newImage.prop('src', dir +'/' +val.innerText);
            library.append(newImage);
         });
      });
   }     
   
   //Drop handler
   function dropHandler(event){
      event.stopImmediatePropagation();

      var target = $(this);
      var imgAddress = event.originalEvent.dataTransfer.getData("text");
      event.originalEvent.dataTransfer.clearData();
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
   }
   
   //Drap start handler
   function dragHandler(event){
      var $this = $(this);  

      //In order to drop allow copy effect
      event.originalEvent.dataTransfer.effectAllowed = "copy";

      // Copy the relative address of a picture to extract on drop      
      event.originalEvent.dataTransfer.setData("text/plain", $this.attr("src"));      

      $.each($slots, function(){
         if(!$(this).hasClass('filled')){
            $slots.addClass('highlight');
         }    
      });      
      
   }
         
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
   
   //reload updated timeline images into player
   function resetPlayerImages(){
      var addresses = collectImagesInfo();
      setPlayerImages(addresses);
   }
   
   //clears timeline slot
   function clearSlot($slot){
      $slot.removeClass("filled");
      $slot.empty();
      resetPlayerImages();
   }
 
   //adds new slot to the timeline
   function addNewSlot(){
      var slot = $('.js-slot:last-child').clone().empty();
      $timeline.append(slot);
   }   
   
});