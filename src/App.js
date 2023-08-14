import logo from './logo.svg';
import './App.css';

function App() {
  window.onload = function() {
    var fileInput = document.getElementById('file-upload');
    var imageGrid = document.getElementById('image-grid');
    var previewContainer = document.getElementById('preview-container');
    var previewContainer2 = document.getElementById('preview-container2');
    var previewContainer3 = document.getElementById('preview-container3');
    var previewImage = document.getElementById('preview-image');
    var previewImage2 = document.getElementById('preview-image2');
    var previewImage3 = document.getElementById('preview-image3');
    var prevImageBtn = document.getElementById('prev-image');
    var nextImageBtn = document.getElementById('next-image');
    var closePreviewBtn = document.getElementById('close-preview');
    var magnifierPane = document.getElementById('magnifier-pane');
    var magnifierZoomedImage = document.getElementById('magnifier-zoomed-image');
    var images = [];
    var currentIndex = 0;
  
    fileInput.addEventListener('change', handleFileSelect, false);
  
    function handleFileSelect(event) {
      var files = event.target.files; // Get the selected files
  
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
  
        reader.onload = (function(file) {
          return function(e) {
            var image = document.createElement('img');
            image.className = 'image';
            image.src = e.target.result;
            imageGrid.appendChild(image);
            images.push(e.target.result);
          };
        })(file);
  
        reader.readAsDataURL(file);
      }
    }
  
    // Load and display images from local storage on page reload
    if (localStorage.getItem('uploadedImages')) {
      images = JSON.parse(localStorage.getItem('uploadedImages'));
  
      for (var i = 0; i < images.length; i++) {
        var image = document.createElement('img');
        image.className = 'image';
        image.src = images[i];
        imageGrid.appendChild(image);
      }
    }
  
    // Store the uploaded images in local storage
    window.onbeforeunload = function() {
      localStorage.setItem('uploadedImages', JSON.stringify(images));
    };
  
    // Preview mode functionality
    function showPreview(index) {
      previewImage.src = images[index];
      previewImage2.src = images[index-1];
      previewImage3.src = images[index+1];
      currentIndex = index;
      previewContainer.style.opacity = 1;
      previewContainer2.style.opacity = 1;
      previewContainer3.style.opacity = 1;
    //   previewContainer3.style.transition.previewImage3 ='2s ease-in-out';
      previewContainer.style.pointerEvents = 'auto';
    }
  
    function hidePreview() {
      previewContainer.style.opacity = 0;
      previewContainer2.style.opacity = 0;
      previewContainer3.style.opacity = 0;
      previewContainer.style.pointerEvents = 'none';
    }
    
    function applyTransition() {
        previewImage.style.transition = 'opacity 0.5s, transform 0.5s';
        previewImage.addEventListener('transitionend', function() {
          previewImage.style.transition = '';
        }, { once: true });
      }

    function navigatePreview(direction) {
      currentIndex += direction;
      if (currentIndex < 0) {
        currentIndex = images.length - 1;
      } else if (currentIndex >= images.length) {
        currentIndex = 0;
      }
      previewImage.src = images[currentIndex];
      previewImage2.src = images[currentIndex-1];
      previewImage3.src = images[currentIndex+1];
    }
  
    // Open preview on image click
    imageGrid.addEventListener('click', function(event) {
      if (event.target.classList.contains('image')) {
        var index = Array.prototype.indexOf.call(imageGrid.children, event.target);
        showPreview(index);
      }
    });
  
    // Close preview on close button click
    closePreviewBtn.addEventListener('click', function() {
      hidePreview();
    });
  
    // Close preview on click outside the image
    previewContainer.addEventListener('click', function(event) {
      if (event.target === this) {
        hidePreview();
      }
    });
  
    // Navigate to the previous image
    prevImageBtn.addEventListener('click', function() {
      navigatePreview(-1);
      applyTransition();
    });
  
    // Navigate to the next image
    nextImageBtn.addEventListener('click', function() {
      navigatePreview(1);
      applyTransition();
    });
  
    // Zoom in on the image
    previewImage.addEventListener('mousemove', function(event) {
      var previewRect = previewImage.getBoundingClientRect();
      var x = event.clientX - previewRect.left;
      var y = event.clientY - previewRect.top;
  
      var magnifierRect = magnifierPane.getBoundingClientRect();
      var zoomedWidth = magnifierZoomedImage.offsetWidth;
      var zoomedHeight = magnifierZoomedImage.offsetHeight;
  
      var offsetX = x - magnifierRect.width / 2;
      var offsetY = y - magnifierRect.height / 2;
  
      offsetX = Math.max(Math.min(offsetX, previewRect.width - magnifierRect.width), 0);
      offsetY = Math.max(Math.min(offsetY, previewRect.height - magnifierRect.height), 0);
  
      var zoomX = -offsetX / previewRect.width * zoomedWidth;
      var zoomY = -offsetY / previewRect.height * zoomedHeight;
  
      magnifierZoomedImage.style.transform = `translate(${zoomX}px, ${zoomY}px)`;
    });
  
    // Reset zoom on mouse leave
    previewImage.addEventListener('mouseleave', function() {
      magnifierZoomedImage.style.transform = 'none';
    });
  
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
      if (previewContainer.style.opacity === '1') {
        if (event.key === 'ArrowLeft') {
          navigatePreview(-1);
        } else if (event.key === 'ArrowRight') {
          navigatePreview(1);
        } else if (event.key === 'Escape') {
          hidePreview();
        }
      }
    });
  };
  
  return (<>
    <input type="file" id="file-upload" multiple/>
  <div class="grid" id="image-grid"></div>
  <div class="maincontainer">
  <div class="preview-container2" id="preview-container2"><img class="preview-image2" id="preview-image2"/></div>
  <div class="preview-container3" id="preview-container3"><img class="preview-image3" id="preview-image3"/></div>
  <div class="preview-container" id="preview-container">
    <button class="preview-close" id="close-preview">&times;</button>
    <div class="preview-nav">
      <button class="preview-nav-arrow" id="prev-image">&lt;</button>
      <img class="preview-image" id="preview-image"/>
      <button class="preview-nav-arrow" id="next-image">&gt;</button>
    </div>
    <div class="magnifier-pane" id="magnifier-pane">
      <img class="magnifier-zoomed-image" id="magnifier-zoomed-image" src=""/>
    </div>
  </div></div>
    </>);
}

export default App;
