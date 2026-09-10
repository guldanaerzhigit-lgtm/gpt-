(function(){
  function findConnection(id){return state.connections && state.connections.find(c=>c.id===id)}
  function cablePath(con){
    const a=state.objects.find(x=>x.id===con.a), b=state.objects.find(x=>x.id===con.b);
    if(!a||!b)return null;
    return {a,b};
  }
  window.renderConnections=function(){
    document.querySelectorAll('.cable').forEach(e=>e.remove());
    const c=document.getElementById('canvas'); if(!c)return;
    (state.connections||[]).forEach((con,i)=>{
      if(con.id==null)con.id='c'+i+'_'+con.a+'_'+con.b;
      const p=cablePath(con); if(!p)return;
      const e=document.createElement('div');
      const dx=p.b.x-p.a.x, dy=p.b.y-p.a.y;
      e.className='cable'+(state.selected?.kind==='connection'&&state.selected.id===con.id?' selected':'');
      e.dataset.connectionId=con.id;
      e.style.left=p.a.x+'px'; e.style.top=p.a.y+'px';
      e.style.width=Math.hypot(dx,dy)+'px'; e.style.transform='rotate('+Math.atan2(dy,dx)+'rad)';
      e.style.height='7px'; e.style.marginTop='-2px'; e.style.pointerEvents='auto';
      e.style.cursor='pointer'; e.style.background=state.selected?.kind==='connection'&&state.selected.id===con.id?'#2563eb':'#ef4444';
      e.title='Кабель: нажмите для выбора, Delete — удалить';
      e.onpointerdown=function(ev){ev.preventDefault();ev.stopPropagation();state.selected={kind:'connection',id:con.id};renderConnections();renderProps()};
      c.appendChild(e);
    });
  };
  const oldRemove=window.remove;
  window.remove=function(){
    if(state.selected?.kind==='connection'){
      const id=state.selected.id;
      state.connections=(state.connections||[]).filter(c=>c.id!==id);
      state.selected=null; save(); render(); status('Кабель удалён'); return;
    }
    oldRemove();
  };
  const oldProps=window.renderProps;
  window.renderProps=function(){
    if(state.selected?.kind==='connection'){
      const c=findConnection(state.selected.id);
      if(!c){state.selected=null;return oldProps()}
      const a=state.objects.find(x=>x.id===c.a), b=state.objects.find(x=>x.id===c.b);
      const p=document.getElementById('props');
      p.innerHTML='<div class="card"><b>🔗 Кабель</b><div class="field"><label>Откуда</label><div>'+esc(a?a.name:'—')+'</div></div><div class="field"><label>Куда</label><div>'+esc(b?b.name:'—')+'</div></div><button class="danger" onclick="remove()">🗑 Удалить кабель</button></div>';
      return;
    }
    oldProps();
  };
  document.addEventListener('keydown',function(e){
    if((e.key==='Delete'||e.key==='Backspace') && state.selected?.kind==='connection'){
      e.preventDefault(); remove();
    }
  });
  const oldRender=window.render;
  window.render=function(){oldRender(); setTimeout(renderConnections,0)};
  setTimeout(function(){
    (state.connections||[]).forEach((c,i)=>{if(c.id==null)c.id='c'+i+'_'+c.a+'_'+c.b});
    save(); renderConnections(); renderProps();
  },0);
})();
