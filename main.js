const canvas = document.querySelector('#signal');
const ctx = canvas.getContext('2d');

if (ctx) {
  const {width, height} = canvas;
  const points = [104, 104, 94, 97, 109, 86, 92, 89, 99, 67, 79, 72, 87, 31, 16, 80, 92, 75, 87, 67, 77, 66, 76, 60, 65];
  const step = width / (points.length - 1);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(115, 151, 255, .35)');
  gradient.addColorStop(1, 'rgba(115, 151, 255, 0)');
  const trace = () => {
    ctx.moveTo(0, points[0]);
    points.slice(1).forEach((y, index) => ctx.lineTo((index + 1) * step, y));
  };
  ctx.beginPath();
  trace();
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.beginPath();
  trace();
  ctx.strokeStyle = '#a9bbff';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(14 * step, points[14], 5, 0, Math.PI * 2);
  ctx.fillStyle = '#a9bbff';
  ctx.fill();
}

const knot = document.querySelector('#knot');
const brush = knot.getContext('2d');
if (brush) {
  const particles = [];
  for (let ring = 0; ring < 200; ring++) {
    const t = ring * Math.PI / 100;
    for (let strand = 0; strand < 22; strand++) {
      const v = strand * Math.PI / 11;
      const radius = 1.5 + .57 * Math.cos(3*t) + .22 * Math.cos(v);
      particles.push([radius*Math.cos(2*t), radius*Math.sin(2*t), .75*Math.sin(3*t) + .22*Math.sin(v)]);
    }
  }
  const button = document.querySelector('#motion');
  let moving = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = 0, tilt = .45, turn = -.25, frame = 0, previous = 0;
  function paint(time) {
    if (moving && previous) angle += Math.min(time - previous, 50) * .00017;
    previous = time;
    brush.clearRect(0,0,knot.width,knot.height);
    const yaw = angle + turn;
    for (const [x,y,z] of particles) {
      const u = x*Math.cos(yaw) - z*Math.sin(yaw);
      const w = x*Math.sin(yaw) + z*Math.cos(yaw);
      const depth = y*Math.sin(tilt) + w*Math.cos(tilt);
      const scale = 118/(1-depth*.09);
      const light = Math.round(58 + depth*13);
      brush.fillStyle = 'hsl(' + (217-depth*7) + ' 100% ' + light + '%)';
      brush.fillRect(350+u*scale,310+(y*Math.cos(tilt)-w*Math.sin(tilt))*scale,2.7+depth*.55,2.7+depth*.55);
    }
    if (moving) frame = requestAnimationFrame(paint);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    previous = 0;
    button.textContent = moving ? 'Pause motion' : 'Play motion';
    paint(performance.now());
  }
  knot.addEventListener('pointermove', event => {
    const box = knot.getBoundingClientRect();
    turn = ((event.clientX-box.left)/box.width-.5)*2;
    tilt = ((event.clientY-box.top)/box.height-.5)*1.4+.45;
    if (!moving) paint(performance.now());
  });
  button.hidden = false;
  button.onclick = () => { moving = !moving; refresh(); };
  refresh();
}

const sectionLinks = [...document.querySelectorAll('nav a')];
const sections = sectionLinks.map(link => document.querySelector(link.hash));
function highlightSection() {
  const lastVisible = sections.filter(section => section.getBoundingClientRect().top <= innerHeight * .45).pop();
  const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  const current = atEnd ? sections[sections.length - 1] : lastVisible;
  sectionLinks.forEach((link, index) => {
    if (sections[index] === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', highlightSection, {passive:true});
window.addEventListener('resize', highlightSection);
highlightSection();
