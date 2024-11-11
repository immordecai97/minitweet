export function setViewportHeight(){
    let vh = window.innerHeight * 0.01;
    console.log('VH --> ',vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}