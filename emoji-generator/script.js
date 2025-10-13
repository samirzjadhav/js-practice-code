// Emoji banks by category (not exhaustive, but decent variety)
const i = Math.floor(Math.random()*source.length);
pick.push(source.splice(i,1)[0]);
}
return pick;
}


function render(count,cat){
preview.innerHTML = '';
const base = (cat === 'all') ? allEmojis : BANK[cat] || allEmojis;
const items = uniqueRandom(base, Math.min(count, base.length));
items.forEach(e => {
const el = document.createElement('div');
el.className = 'emoji';
el.textContent = e;
el.style.fontSize = sizeSelect.value + 'px';
el.title = 'Click to copy / select';
el.addEventListener('click', ()=>{
copyText(e);
setSelected(e);
});
el.addEventListener('dblclick', ()=>{
setSelected(e);
});
preview.appendChild(el);
});
// if none, show placeholder
if(items.length === 0){ preview.innerHTML = '<div class="small">No emojis for this category.</div>' }
}


function setSelected(ch){
selectedEl.textContent = ch;
selectedEl.style.fontSize = (Number(sizeSelect.value)*1.4) + 'px';
}


function copyText(t){
// use navigator clipboard if available
if(navigator.clipboard && navigator.clipboard.writeText){
navigator.clipboard.writeText(t).then(()=>{
flashButton(document.querySelector('.emoji[title]'));
}).catch(()=> fallbackCopy(t));
} else fallbackCopy(t);
}


function fallbackCopy(t){
const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select();
try{ document.execCommand('copy'); }catch(e){ }
ta.remove();
}


function flashButton(el){
// tiny visual feedback
if(!el) return;
const orig = el.style.transform;
el.style.transform = 'scale(0.95)';
setTimeout(()=> el.style.transform = orig, 120);
}


generateBtn.addEventListener('click', ()=>{
const c = Number(countEl.value) || 8;
render(c, category.value);
});


shuffleBtn.addEventListener('click', ()=>{
const nodes = Array.from(preview.children);
for (let i = nodes.length -1; i>0; i--){
const j = Math.floor(Math.random()*(i+1));
preview.appendChild(nodes[j]);
nodes.splice(j,1);
}
});


copySelectedBtn.addEventListener('click', ()=>{
const t = selectedEl.textContent.trim();
if(!t || t === '—') return alert('Select an emoji first (click one).');
copyText(t);
alert('Copied: ' + t);
});


downloadPNGBtn.addEventListener('click', ()=>{
const t = selectedEl.textContent.trim();
if(!t || t === '—') return alert('Select an emoji first (click one).');
const canvas = document.getElementById('canvas');
const size = Number(sizeSelect.value) * 4; // make it high-res
canvas.width = size; canvas.height = size;
const ctx = canvas.getContext('2d');
// background transparent
ctx.clearRect(0,0,canvas.width,canvas.height);
// draw emoji in center
ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
// choose font that supports color emoji
ctx.font = Math.floor(size * 0.9) + 'px serif';
ctx.fillText(t, canvas.width/2, canvas.height/2);
// trigger download
const link = document.createElement('a');
link.download = 'emoji-'+encodeURIComponent(t)+'.png';
link.href = canvas.toDataURL('image/png');
link.click();
});


// initial render
render(Number(countEl.value), category.value);


// handy: press G to generate, C to copy selected
window.addEventListener('keydown', (e)=>{
if(e.key.toLowerCase() === 'g') generateBtn.click();
if(e.key.toLowerCase() === 'c') copySelectedBtn.click();
});