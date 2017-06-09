export default function () {
    let setFz = ()=> {
        let fz = document.body.getBoundingClientRect().width / 10;
        document.documentElement.style.fontSize = fz + 'px';
    }
    window.addEventListener('resize', setFz, false);
    setFz();
}