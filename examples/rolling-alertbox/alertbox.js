CustomEase.create("custom", ".75,0,.25,1");

function animateInText(text, addclass){
    console.log(`Animating: ${text}`)

    tl = gsap.timeline();

    // Create a new element to animate in
    newelem = document.createElement("div");
    newelem.setAttribute("id", "bottom");
    newelem.classList.add("text", "hidden");

    if (addclass != undefined)
      newelem.classList.add(addclass);

    newelem.innerHTML = Splitting.html({ target: newelem, content: text});
    document.querySelector("#container").appendChild(newelem);

    tl.to("#top .char",
    {
        y: '-175%',
        duration: 1.2,
        stagger: 0.1,
        ease: "custom",
    });
    tl.to("#top .char",
    {
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power0"
    }, "<");

    tl.fromTo("#bottom .char",
    {
        y: '175%',
        opacity: 0
    },
    {
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "custom",
    }, "<");

    tl.to("#bottom .char",
    {
      opacity: 1,
      duration: .7,
      stagger: 0.15,
      ease: "power0"
    }, "<");

    tl.then(() => {
      // Swap out the elements to get ready for the next animation
      document.querySelector("#top").remove();
      elem = document.querySelector("#bottom");
      elem.setAttribute("id", "top");
      elem.classList.remove("hidden");
    })
}

function animateOutText(){
  tl = gsap.timeline();
  tl.to("#top .char",
  {
      y: '-175%',
      duration: 1.2,
      stagger: 0.1,
      ease: "custom",
  });
  tl.to("#top .char",
  {
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power0"
  }, "<");
}

window.addEventListener('DOMContentLoaded', async (event) => {
  Splitting();

  animateInText(first);

  setTimeout(async () => {
    animateInText(login, "colour");
  }, 3750);
  if (last != ""){
    setTimeout(() => {
      animateInText(last);
    }, 7500);
  }
  setTimeout(() => {
    animateOutText();
  }, 12250);
});
