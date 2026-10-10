'use strict';
// Place the supplied PNG lettering along the actual pink silhouette.
// Each display row keeps its original pixels; only its horizontal position changes.
async function drawCurvedAnnotations() {
  const canvas = document.getElementById('curvedAnnotations');
  const ctx = canvas.getContext('2d');
  const boundary = (y, side) => {
    const points = ANNOTATION_LAYOUT.contours;
    let i = 0;
    while (i < points.length - 2 && points[i+1][0] < y) i++;
    const a = points[i], b = points[i+1];
    const t = Math.max(0, Math.min(1, (y-a[0])/(b[0]-a[0])));
    const k = side === 'left' ? 1 : 2;
    return a[k] + (b[k]-a[k])*t;
  };
  const images = await Promise.all(ANNOTATION_LAYOUT.notes.map(async note => {
    const image = new Image(); image.src = note.src;
    await image.decode(); return {note,image};
  }));
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const {note:n,image} of images) {
    const height = Math.ceil((n.hi-n.lo)*n.scale);
    for (let row=0; row<height; row++) {
      const t = row/height;
      const center = n.coefficients.reduce((sum,c,i) => sum+c*Math.pow(t,i),0);
      const y = n.top+row;
      const x = boundary(y,n.side) + (n.side === 'left' ? n.gap : -n.gap) - center*n.scale;
      ctx.drawImage(image,0,n.lo+row/n.scale,image.width,1/n.scale,x,y,image.width*n.scale,1);
    }
  }
  canvas.dataset.ready = 'true';
}
drawCurvedAnnotations().catch(error => {
  console.error('弧形注释加载失败',error);
  document.getElementById('curvedAnnotations').dataset.ready = 'error';
});
