 
 const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1366,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 4,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
};

// Slider Settings
const singleImageBanner = {
  dots: true, // Enables dots for navigation
  infinite: true, // Loop through slides
  speed: 500, // Transition speed
  slidesToShow: 1, // Number of slides to show
  slidesToScroll: 1, // Number of slides to scroll
  autoplay: true, // Enables autoplay
  autoplaySpeed: 3000, // Slide change interval in milliseconds
  arrows: false, // Hides next/prev arrows
};


 

 

export { singleImageBanner,settings };
